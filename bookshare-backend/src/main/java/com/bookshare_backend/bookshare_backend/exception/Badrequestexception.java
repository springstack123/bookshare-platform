package com.bookshare_backend.bookshare_backend.exception;


public class Badrequestexception extends RuntimeException {
    public Badrequestexception(String message) {
        super(message);
    }
}