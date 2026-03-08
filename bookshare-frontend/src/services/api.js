const API_URL = "http://localhost:8080/api";

/**
 * Centralized API service with JWT authentication
 * All endpoints return ApiResponse<T> with structure: {success, message, data}
 */

class ApiService {
  constructor() {
    this.tokenKey = "bookshare_token";
    this.userKey = "bookshare_user";
  }

  // Get stored token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Set token
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Remove token
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Get stored user
  getStoredUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Set user
  setStoredUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Remove user
  removeStoredUser() {
    localStorage.removeItem(this.userKey);
  }

  // Check if logged in
  isAuthenticated() {
    return !!this.getToken();
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getStoredUser();
    return user && user.role === "ADMIN";
  }

  // Generic fetch wrapper with auth
  async fetchWithAuth(url, options = {}) {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      this.logout();
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    return response;
  }

  // Parse API response
  async parseResponse(response) {
    const json = await response.json();
    if (!json.success) {
      throw new Error(json.message || "An error occurred");
    }
    return json.data;
  }

  // ==================== AUTH ====================

  /**
   * POST /api/auth/login
   * Body: {email, password}
   */
  async login(email, password) {
    const response = await this.fetchWithAuth(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await this.parseResponse(response);
    
    // Store token and user info
    if (data.token) {
      this.setToken(data.token);
      this.setStoredUser({
        id: data.userId,
        name: data.name,
        email: data.email,
        city: data.city,
        role: data.role,
      });
    }
    
    return data;
  }

  /**
   * POST /api/auth/register
   * Body: {name, email, password, phone, city}
   */
  async register(userData) {
    const response = await this.fetchWithAuth(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });

    const data = await this.parseResponse(response);
    
    // Auto-login after register
    if (data.token) {
      this.setToken(data.token);
      this.setStoredUser({
        id: data.userId,
        name: data.name,
        email: data.email,
        city: data.city,
        role: data.role,
      });
    }
    
    return data;
  }

  // Logout
  logout() {
    this.removeToken();
    this.removeStoredUser();
  }

  // ==================== BOOKS ====================

  /**
   * GET /api/books
   * Query params: city, category, type, search, page, size, sort
   */
  async getBooks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await this.fetchWithAuth(`${API_URL}/books?${queryString}`);
    return this.parseResponse(response);
  }

  /**
   * GET /api/books/:id
   */
  async getBookById(id) {
    const response = await this.fetchWithAuth(`${API_URL}/books/${id}`);
    return this.parseResponse(response);
  }

  /**
   * GET /api/books/my
   * Get current user's books
   */
  async getMyBooks() {
    const response = await this.fetchWithAuth(`${API_URL}/books/my`);
    return this.parseResponse(response);
  }

  /**
   * GET /api/books/cities
   * Get all available cities
   */
  async getCities() {
    const response = await this.fetchWithAuth(`${API_URL}/books/cities`);
    return this.parseResponse(response);
  }

  /**
   * POST /api/books
   * Create a new book listing
   */
  async createBook(bookData) {
    const response = await this.fetchWithAuth(`${API_URL}/books`, {
      method: "POST",
      body: JSON.stringify(bookData),
    });
    return this.parseResponse(response);
  }

  /**
   * PUT /api/books/:id
   * Update a book listing
   */
  async updateBook(id, bookData) {
    const response = await this.fetchWithAuth(`${API_URL}/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    });
    return this.parseResponse(response);
  }

  /**
   * DELETE /api/books/:id
   * Delete a book listing
   */
  async deleteBook(id) {
    const response = await this.fetchWithAuth(`${API_URL}/books/${id}`, {
      method: "DELETE",
    });
    return this.parseResponse(response);
  }

  // ==================== USERS ====================

  /**
   * GET /api/users/me
   * Get current user profile
   */
  async getMyProfile() {
    const response = await this.fetchWithAuth(`${API_URL}/users/me`);
    return this.parseResponse(response);
  }

  /**
   * PUT /api/users/me
   * Update current user profile
   */
  async updateProfile(profileData) {
    const response = await this.fetchWithAuth(`${API_URL}/users/me`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    return this.parseResponse(response);
  }

  /**
   * PUT /api/users/me/password
   * Change password
   */
  async changePassword(passwordData) {
    const response = await this.fetchWithAuth(`${API_URL}/users/me/password`, {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
    return this.parseResponse(response);
  }

  // ==================== WISHLIST ====================

  /**
   * GET /api/wishlist
   * Get user's wishlist
   */
  async getWishlist() {
    const response = await this.fetchWithAuth(`${API_URL}/wishlist`);
    return this.parseResponse(response);
  }

  /**
   * POST /api/wishlist/:bookId
   * Add to wishlist
   */
  async addToWishlist(bookId) {
    const response = await this.fetchWithAuth(`${API_URL}/wishlist/${bookId}`, {
      method: "POST",
    });
    return this.parseResponse(response);
  }

  /**
   * DELETE /api/wishlist/:bookId
   * Remove from wishlist
   */
  async removeFromWishlist(bookId) {
    const response = await this.fetchWithAuth(`${API_URL}/wishlist/${bookId}`, {
      method: "DELETE",
    });
    return this.parseResponse(response);
  }

  /**
   * GET /api/wishlist/check/:bookId
   * Check if book is in wishlist
   */
  async checkWishlist(bookId) {
    const response = await this.fetchWithAuth(`${API_URL}/wishlist/check/${bookId}`);
    return this.parseResponse(response);
  }

  // ==================== REQUESTS ====================

  /**
   * GET /api/requests/sent
   * Get sent requests
   */
  async getSentRequests(page = 0, size = 10) {
    const response = await this.fetchWithAuth(
      `${API_URL}/requests/sent?page=${page}&size=${size}`
    );
    return this.parseResponse(response);
  }

  /**
   * GET /api/requests/received
   * Get received requests
   */
  async getReceivedRequests(page = 0, size = 10) {
    const response = await this.fetchWithAuth(
      `${API_URL}/requests/received?page=${page}&size=${size}`
    );
    return this.parseResponse(response);
  }

  /**
   * POST /api/requests
   * Create a new request
   */
  async createRequest(requestData) {
    const response = await this.fetchWithAuth(`${API_URL}/requests`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });
    return this.parseResponse(response);
  }

  /**
   * POST /api/requests/:id/accept
   * Accept a request
   */
  async acceptRequest(id) {
    const response = await this.fetchWithAuth(`${API_URL}/requests/${id}/accept`, {
      method: "POST",
    });
    return this.parseResponse(response);
  }

  /**
   * POST /api/requests/:id/reject
   * Reject a request
   */
  async rejectRequest(id) {
    const response = await this.fetchWithAuth(`${API_URL}/requests/${id}/reject`, {
      method: "POST",
    });
    return this.parseResponse(response);
  }

  /**
   * POST /api/requests/:id/complete
   * Mark request as completed
   */
  async completeRequest(id) {
    const response = await this.fetchWithAuth(`${API_URL}/requests/${id}/complete`, {
      method: "POST",
    });
    return this.parseResponse(response);
  }

  /**
   * POST /api/requests/:id/cancel
   * Cancel a request
   */
  async cancelRequest(id) {
    const response = await this.fetchWithAuth(`${API_URL}/requests/${id}/cancel`, {
      method: "POST",
    });
    return this.parseResponse(response);
  }

  // ==================== REVIEWS ====================

  /**
   * GET /api/reviews/book/:bookId
   * Get reviews for a book
   */
  async getBookReviews(bookId) {
    const response = await this.fetchWithAuth(`${API_URL}/reviews/book/${bookId}`);
    return this.parseResponse(response);
  }

  /**
   * POST /api/reviews
   * Add a review
   */
  async addReview(reviewData) {
    const response = await this.fetchWithAuth(`${API_URL}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
    return this.parseResponse(response);
  }

  // ==================== STATS ====================

  /**
   * GET /api/stats
   * Get platform statistics
   */
  async getStats() {
    const response = await this.fetchWithAuth(`${API_URL}/stats`);
    return this.parseResponse(response);
  }

  // ==================== ADMIN ====================

  /**
   * GET /api/admin/stats
   * Get admin statistics
   */
  async getAdminStats() {
    const response = await this.fetchWithAuth(`${API_URL}/admin/stats`);
    return this.parseResponse(response);
  }

  /**
   * GET /api/admin/users
   * Get all users (admin)
   */
  async getAllUsers(page = 0, size = 20, search = "") {
    const params = new URLSearchParams({ page, size });
    if (search) params.set("search", search);
    const response = await this.fetchWithAuth(`${API_URL}/admin/users?${params}`);
    return this.parseResponse(response);
  }

  /**
   * DELETE /api/admin/users/:id
   * Deactivate user (admin)
   */
  async deactivateUser(id) {
    const response = await this.fetchWithAuth(`${API_URL}/admin/users/${id}`, {
      method: "DELETE",
    });
    return this.parseResponse(response);
  }

  /**
   * PUT /api/admin/users/:id/verify
   * Toggle user verification (admin)
   */
  async toggleUserVerification(id) {
    const response = await this.fetchWithAuth(`${API_URL}/admin/users/${id}/verify`, {
      method: "PUT",
    });
    return this.parseResponse(response);
  }

  /**
   * PUT /api/admin/users/:id/role
   * Update user role (admin)
   */
  async updateUserRole(id, role) {
    const response = await this.fetchWithAuth(`${API_URL}/admin/users/${id}/role?role=${role}`, {
      method: "PUT",
    });
    return this.parseResponse(response);
  }

  /**
   * GET /api/admin/books
   * Get all books including inactive (admin)
   */
  async getAllBooksAdmin(page = 0, size = 20, search = "", status = "") {
    const params = new URLSearchParams({ page, size });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    const response = await this.fetchWithAuth(`${API_URL}/admin/books?${params}`);
    return this.parseResponse(response);
  }

  /**
   * DELETE /api/admin/books/:id
   * Delete book (admin)
   */
  async deleteBookAdmin(id) {
    const response = await this.fetchWithAuth(`${API_URL}/admin/books/${id}`, {
      method: "DELETE",
    });
    return this.parseResponse(response);
  }
}

// Export singleton instance
const api = new ApiService();
export default api;

