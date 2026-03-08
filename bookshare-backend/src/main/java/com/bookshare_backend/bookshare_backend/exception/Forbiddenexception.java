package com.bookshare_backend.bookshare_backend.exception;


public class Forbiddenexception extends RuntimeException {
    public Forbiddenexception(String message) {
        super(message);
    }
}