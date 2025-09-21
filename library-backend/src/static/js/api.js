// API Integration for Modern Library System

// Base API URL
const API_BASE_URL = '/api';

// API utility functions
class LibraryAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Books API
    async getBooks(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/books${queryString ? '?' + queryString : ''}`;
        return this.request(endpoint);
    }

    async getBook(bookId) {
        return this.request(`/books/${bookId}`);
    }

    async getPopularBooks(limit = 8) {
        return this.request(`/books/popular?limit=${limit}`);
    }

    async getRecentBooks(limit = 8) {
        return this.request(`/books/recent?limit=${limit}`);
    }

    async searchBooks(query, params = {}) {
        const searchParams = new URLSearchParams({ q: query, ...params }).toString();
        return this.request(`/books/search?${searchParams}`);
    }

    async downloadBook(bookId) {
        return this.request(`/books/${bookId}/download`, { method: 'POST' });
    }

    // Categories API
    async getCategories() {
        return this.request('/categories');
    }

    async getCategory(categoryId) {
        return this.request(`/categories/${categoryId}`);
    }

    // Reviews API
    async getBookReviews(bookId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/books/${bookId}/reviews${queryString ? '?' + queryString : ''}`;
        return this.request(endpoint);
    }

    async addBookReview(bookId, reviewData) {
        return this.request(`/books/${bookId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }

    // Favorites API
    async addToFavorites(bookId, userId) {
        return this.request(`/books/${bookId}/favorite`, {
            method: 'POST',
            body: JSON.stringify({ user_id: userId })
        });
    }

    async removeFromFavorites(bookId, userId) {
        return this.request(`/books/${bookId}/favorite`, {
            method: 'DELETE',
            body: JSON.stringify({ user_id: userId })
        });
    }

    async getUserFavorites(userId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/users/${userId}/favorites${queryString ? '?' + queryString : ''}`;
        return this.request(endpoint);
    }

    // Users API
    async getUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/users${queryString ? '?' + queryString : ''}`;
        return this.request(endpoint);
    }

    async getUser(userId) {
        return this.request(`/users/${userId}`);
    }

    async createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async updateUser(userId, userData) {
        return this.request(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async deleteUser(userId) {
        return this.request(`/users/${userId}`, {
            method: 'DELETE'
        });
    }

    // Contact API
    async submitContact(contactData) {
        return this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }

    async getContactMessages(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/contact/messages${queryString ? '?' + queryString : ''}`;
        return this.request(endpoint);
    }

    async getContactMessage(messageId) {
        return this.request(`/contact/messages/${messageId}`);
    }

    async updateContactMessageStatus(messageId, status) {
        return this.request(`/contact/messages/${messageId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    async getContactStats() {
        return this.request('/contact/stats');
    }

    // Newsletter API
    async subscribeNewsletter(email) {
        return this.request('/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    async unsubscribeNewsletter(email) {
        return this.request('/newsletter/unsubscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    async getNewsletterSubscribers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/newsletter/subscribers${queryString ? '?' + queryString : ''}`;
        return this.request(endpoint);
    }
}

// Create global API instance
const api = new LibraryAPI();

// Enhanced functions that integrate with the API
async function loadBooksFromAPI(params = {}) {
    try {
        showInfoToast('جاري تحميل الكتب...', 'انتظر');
        const response = await api.getBooks(params);
        
        if (response.success) {
            return response;
        } else {
            throw new Error(response.error || 'فشل في تحميل الكتب');
        }
    } catch (error) {
        showErrorToast('حدث خطأ في تحميل الكتب: ' + error.message);
        throw error;
    }
}

async function loadCategoriesFromAPI() {
    try {
        const response = await api.getCategories();
        
        if (response.success) {
            return response.categories;
        } else {
            throw new Error(response.error || 'فشل في تحميل التصنيفات');
        }
    } catch (error) {
        showErrorToast('حدث خطأ في تحميل التصنيفات: ' + error.message);
        throw error;
    }
}

async function loadPopularBooksFromAPI(limit = 8) {
    try {
        const response = await api.getPopularBooks(limit);
        
        if (response.success) {
            return response.books;
        } else {
            throw new Error(response.error || 'فشل في تحميل الكتب الشائعة');
        }
    } catch (error) {
        showErrorToast('حدث خطأ في تحميل الكتب الشائعة: ' + error.message);
        throw error;
    }
}

async function searchBooksAPI(query, params = {}) {
    try {
        showInfoToast('جاري البحث...', 'انتظر');
        const response = await api.searchBooks(query, params);
        
        if (response.success) {
            showSuccessToast(`تم العثور على ${response.pagination.total} نتيجة`);
            return response;
        } else {
            throw new Error(response.error || 'فشل في البحث');
        }
    } catch (error) {
        showErrorToast('حدث خطأ في البحث: ' + error.message);
        throw error;
    }
}

async function downloadBookAPI(bookId) {
    try {
        showInfoToast('جاري تحضير التحميل...', 'انتظر');
        const response = await api.downloadBook(bookId);
        
        if (response.success) {
            showSuccessToast('تم بدء التحميل بنجاح!');
            return response;
        } else {
            throw new Error(response.error || 'فشل في التحميل');
        }
    } catch (error) {
        showErrorToast('حدث خطأ في التحميل: ' + error.message);
        throw error;
    }
}

async function submitContactFormAPI(formData) {
    try {
        showInfoToast('جاري إرسال الرسالة...', 'انتظر');
        const response = await api.submitContact(formData);
        
        if (response.success) {
            showSuccessToast(response.message || 'تم إرسال رسالتك بنجاح!');
            return response;
        } else {
            throw new Error(response.error || 'فشل في إرسال الرسالة');
        }
    } catch (error) {
        showErrorToast('حدث خطأ في إرسال الرسالة: ' + error.message);
        throw error;
    }
}

async function subscribeNewsletterAPI(email) {
    try {
        showInfoToast('جاري الاشتراك...', 'انتظر');
        const response = await api.subscribeNewsletter(email);
        
        if (response.success) {
            showSuccessToast(response.message || 'تم الاشتراك بنجاح!');
            return response;
        } else {
            throw new Error(response.error || 'فشل في الاشتراك');
        }
    } catch (error) {
        showErrorToast('حدث خطأ في الاشتراك: ' + error.message);
        throw error;
    }
}

// Enhanced book modal with API data
async function showBookModalAPI(bookId) {
    try {
        $('#bookModal').modal('show');
        $('#bookModalBody').html('<div class="text-center"><div class="spinner"></div><p>جاري تحميل تفاصيل الكتاب...</p></div>');
        
        const response = await api.getBook(bookId);
        
        if (response.success) {
            const book = response.book;
            loadBookDetailsFromAPI(book);
        } else {
            throw new Error(response.error || 'فشل في تحميل تفاصيل الكتاب');
        }
    } catch (error) {
        $('#bookModalBody').html(`<div class="alert alert-danger">حدث خطأ: ${error.message}</div>`);
    }
}

function loadBookDetailsFromAPI(book) {
    const bookDetailsHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="book-cover bg-primary d-flex align-items-center justify-content-center" style="height: 300px; border-radius: 10px;">
                    ${book.cover_image ? 
                        `<img src="${book.cover_image}" alt="${book.title}" class="img-fluid rounded">` :
                        `<i class="fas fa-book fa-6x text-white"></i>`
                    }
                </div>
            </div>
            <div class="col-md-8">
                <h3 class="fw-bold mb-3">${book.title}</h3>
                <p class="text-muted mb-2"><i class="fas fa-user me-2"></i><strong>المؤلف:</strong> ${book.author}</p>
                <p class="text-muted mb-2"><i class="fas fa-tag me-2"></i><strong>التصنيف:</strong> ${book.category_name || 'غير محدد'}</p>
                ${book.pages ? `<p class="text-muted mb-2"><i class="fas fa-file-alt me-2"></i><strong>عدد الصفحات:</strong> ${book.pages}</p>` : ''}
                <p class="text-muted mb-2"><i class="fas fa-language me-2"></i><strong>اللغة:</strong> ${book.language}</p>
                ${book.publish_date ? `<p class="text-muted mb-2"><i class="fas fa-calendar me-2"></i><strong>تاريخ النشر:</strong> ${new Date(book.publish_date).toLocaleDateString('ar-SA')}</p>` : ''}
                <p class="text-muted mb-3"><i class="fas fa-download me-2"></i><strong>التحميلات:</strong> ${book.download_count.toLocaleString()}</p>
                
                <div class="rating mb-3">
                    <span class="text-warning">
                        ${generateStars(book.rating)}
                    </span>
                    <span class="ms-2">${book.rating}/5</span>
                </div>
                
                ${book.description ? `
                <div class="description">
                    <h5>وصف الكتاب:</h5>
                    <p class="text-muted">${book.description}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    $('#bookModalTitle').text(book.title);
    $('#bookModalBody').html(bookDetailsHTML);
    
    // Update download button to use API
    $('#bookModal .modal-footer .btn-primary').off('click').on('click', function() {
        downloadBookAPI(book.id);
    });
}

// Cache management
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    set(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    clear() {
        this.cache.clear();
    }
}

// Global cache instance
const cache = new CacheManager();

// Enhanced functions with caching
async function getCachedBooks(params = {}) {
    const cacheKey = `books_${JSON.stringify(params)}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
        return cached;
    }
    
    const response = await loadBooksFromAPI(params);
    cache.set(cacheKey, response);
    return response;
}

async function getCachedCategories() {
    const cacheKey = 'categories';
    const cached = cache.get(cacheKey);
    
    if (cached) {
        return cached;
    }
    
    const categories = await loadCategoriesFromAPI();
    cache.set(cacheKey, categories);
    return categories;
}

// Real-time updates
function setupRealTimeUpdates() {
    // Refresh popular books every 5 minutes
    setInterval(async () => {
        try {
            const books = await loadPopularBooksFromAPI();
            updatePopularBooksDisplay(books);
        } catch (error) {
            console.error('Failed to update popular books:', error);
        }
    }, 5 * 60 * 1000);
    
    // Clear cache every 10 minutes
    setInterval(() => {
        cache.clear();
    }, 10 * 60 * 1000);
}

function updatePopularBooksDisplay(books) {
    // Update popular books section if it exists
    const popularSection = $('.popular-books .row');
    if (popularSection.length && books.length) {
        // Update the display with new data
        console.log('Updated popular books:', books.length);
    }
}

// Initialize API integration when DOM is ready
$(document).ready(function() {
    // Setup real-time updates
    setupRealTimeUpdates();
    
    // Override existing functions to use API
    if (typeof window.loadBooks === 'function') {
        window.loadBooks = async function() {
            try {
                const response = await getCachedBooks();
                if (response.success && typeof displayBooks === 'function') {
                    displayBooks(response.books);
                }
            } catch (error) {
                console.error('Failed to load books:', error);
            }
        };
    }
    
    if (typeof window.loadCategories === 'function') {
        window.loadCategories = async function() {
            try {
                const categories = await getCachedCategories();
                if (typeof displayCategories === 'function') {
                    displayCategories(categories);
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
    }
    
    // Override search function
    if (typeof window.performSearch === 'function') {
        window.performSearch = async function() {
            const searchTerm = $('#searchInput').val();
            
            if (!searchTerm.trim()) {
                showWarningToast('يرجى إدخال كلمة البحث');
                return;
            }
            
            try {
                const response = await searchBooksAPI(searchTerm);
                if (response.success && typeof displayBooks === 'function') {
                    displayBooks(response.books);
                }
            } catch (error) {
                console.error('Search failed:', error);
            }
        };
    }
    
    // Override newsletter subscription
    if (typeof window.subscribeNewsletter === 'function') {
        window.subscribeNewsletter = async function() {
            const email = $('.input-group input[type="email"]').val();
            
            if (!email) {
                showErrorToast('يرجى إدخال بريدك الإلكتروني');
                return;
            }
            
            if (!isValidEmail(email)) {
                showErrorToast('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            try {
                await subscribeNewsletterAPI(email);
                $('.input-group input[type="email"]').val('');
            } catch (error) {
                console.error('Newsletter subscription failed:', error);
            }
        };
    }
});

// Export API instance for use in other files
window.libraryAPI = api;

