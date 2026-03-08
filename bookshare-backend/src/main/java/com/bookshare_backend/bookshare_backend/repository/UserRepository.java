package com.bookshare_backend.bookshare_backend.repository;

//─── UserRepository.java ───────────────────────────────────────────────

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bookshare_backend.bookshare_backend.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
 Optional<User> findByEmail(String email);
 boolean existsByEmail(String email);

 @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
 long countActiveUsers();

 Page<User> findByEmailContaining(String email, Pageable pageable);
}
