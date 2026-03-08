package com.bookshare_backend.bookshare_backend.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.bookshare_backend.bookshare_backend.dto.BookRequest;
import com.bookshare_backend.bookshare_backend.dto.Requestcreatedto;
import com.bookshare_backend.bookshare_backend.dto.Requestresponse;
import com.bookshare_backend.bookshare_backend.entity.Book;
import com.bookshare_backend.bookshare_backend.entity.User;
import com.bookshare_backend.bookshare_backend.repository.Bookrepository;
import com.bookshare_backend.bookshare_backend.repository.Bookrequestrepository;
import com.bookshare_backend.bookshare_backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class Bookrequestservice {

    private final Bookrequestrepository requestRepository;
    private final Bookrepository bookRepository;
    private final UserRepository userRepository;
    private final Bookservice bookService;
    private final Userservice userService;

    // Create request
    @Transactional
    public Requestresponse create(Requestcreatedto dto, String requesterEmail) {

        User requester = findUser(requesterEmail);
        Book book = findBook(dto.getBookId());

        if (book.getStatus() != Book.BookStatus.AVAILABLE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Book not available");
        }

        if (book.getOwner().getId().equals(requester.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Cannot request own book");
        }

        BookRequest request = BookRequest.builder()
                .book(book)
                .requester(requester)
                .owner(book.getOwner())
                .requestType(book.getListingType())
                .status(BookRequest.RequestStatus.PENDING)
                .message(dto.getMessage())
                .pickupPreference(dto.getPickupPreference())
                .exchangeBookTitle(dto.getExchangeBookTitle())
                .build();

        request = requestRepository.save(request);

        book.setRequestCount(book.getRequestCount() + 1);
        bookRepository.save(book);

        return toResponse(request);
    }

    // Accept request
    @Transactional
    public Requestresponse accept(Long requestId,String ownerEmail){

        BookRequest request = findRequest(requestId);

        verifyOwner(request,ownerEmail);

        request.setStatus(BookRequest.RequestStatus.ACCEPTED);

        Book book = request.getBook();

        book.setStatus(Book.BookStatus.PENDING);

        bookRepository.save(book);

        return toResponse(requestRepository.save(request));
    }

    // Reject request
    @Transactional
    public Requestresponse reject(Long requestId,String ownerEmail){

        BookRequest request = findRequest(requestId);

        verifyOwner(request,ownerEmail);

        request.setStatus(BookRequest.RequestStatus.REJECTED);

        return toResponse(requestRepository.save(request));
    }

    // Cancel request
    @Transactional
    public Requestresponse cancel(Long requestId,String requesterEmail){

        BookRequest request = findRequest(requestId);

        if(!request.getRequester().getEmail().equals(requesterEmail)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Not your request");
        }

        request.setStatus(BookRequest.RequestStatus.CANCELLED);

        return toResponse(requestRepository.save(request));
    }

    // My sent requests
    public Page<Requestresponse> getMySent(String email,int page,int size){

        User user = findUser(email);

        return requestRepository
                .findByRequesterIdOrderByCreatedAtDesc(
                        user.getId(),
                        PageRequest.of(page,size,Sort.by("createdAt").descending()))
                .map(this::toResponse);
    }

    // My received requests
    public Page<Requestresponse> getMyReceived(String email,int page,int size){

        User user = findUser(email);

        return requestRepository
                .findByOwnerIdOrderByCreatedAtDesc(
                        user.getId(),
                        PageRequest.of(page,size,Sort.by("createdAt").descending()))
                .map(this::toResponse);
    }

    // Helpers
    private BookRequest findRequest(Long id){
        return requestRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,"Request not found"));
    }

    private Book findBook(Long id){
        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,"Book not found"));
    }

    private User findUser(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
    }

    private void verifyOwner(BookRequest req,String email){

        if(!req.getOwner().getEmail().equals(email)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Not your book");
        }
    }

    private Requestresponse toResponse(BookRequest req){

        return Requestresponse.builder()
                .id(req.getId())
                .book(bookService.toResponse(req.getBook()))
                .requester(userService.toResponse(req.getRequester()))
                .owner(userService.toResponse(req.getOwner()))
                .status(req.getStatus())
                .requestType(req.getRequestType())
                .message(req.getMessage())
                .pickupPreference(req.getPickupPreference())
                .exchangeBookTitle(req.getExchangeBookTitle())
                .createdAt(req.getCreatedAt())
                .resolvedAt(req.getResolvedAt())
                .build();
    }
    @Transactional
    public Requestresponse complete(Long requestId, String ownerEmail) {

        BookRequest request = findRequest(requestId);

        verifyOwner(request, ownerEmail);

        if (request.getStatus() != BookRequest.RequestStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only accepted requests can be completed");
        }

        request.setStatus(BookRequest.RequestStatus.COMPLETED);

        request.setResolvedAt(java.time.LocalDateTime.now());

        return toResponse(requestRepository.save(request));
    }
}