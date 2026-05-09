// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Books API
const BooksAPI = {
  getAll: async (search = '', categoryId = '', language = '') => {
    let url = '/books?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (categoryId) url += `categoryId=${categoryId}&`;
    if (language) url += `language=${language}&`;
    return apiCall(url);
  },

  getById: (id) => apiCall(`/books/${id}`),

  create: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  update: (id, data) => apiCall(`/books/${id}`, 'PUT', data),

  delete: (id) => apiCall(`/books/${id}`, 'DELETE')
};

// Categories API
const CategoriesAPI = {
  getAll: () => apiCall('/categories')
};

// Downloads API
const DownloadsAPI = {
  record: (bookId, userId = null) => apiCall(`/downloads/${bookId}`, 'POST', { userId })
};

// Contacts API
const ContactsAPI = {
  submit: (data) => apiCall('/contacts', 'POST', data),
  getAll: () => apiCall('/contacts')
};

// Statistics API
const StatsAPI = {
  getAll: () => apiCall('/stats')
};

// Load books on page load
async function loadBooks() {
  try {
    const books = await BooksAPI.getAll();
    displayBooks(books);
  } catch (error) {
    console.error('Failed to load books:', error);
    toastr.error('فشل تحميل الكتب');
  }
}

// Load categories on page load
async function loadCategories() {
  try {
    const categories = await CategoriesAPI.getAll();
    displayCategories(categories);
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

// Display books
function displayBooks(books) {
  const booksContainer = document.getElementById('booksContainer');
  if (!booksContainer) return;

  if (books.length === 0) {
    booksContainer.innerHTML = '<p class="text-center text-muted">لا توجد كتب متاحة</p>';
    return;
  }

  booksContainer.innerHTML = books.map(book => `
    <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
      <div class="card book-card h-100 shadow-sm hover-shadow">
        <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 250px;">
          ${book.coverImage ? `<img src="/uploads/${book.coverImage}" alt="${book.title}" class="img-fluid">` : `<i class="fas fa-book fa-5x text-muted"></i>`}
        </div>
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text text-muted">${book.author}</p>
          <p class="card-text small">${book.description?.substring(0, 100)}...</p>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="badge bg-primary">${book.pageCount} صفحة</span>
            <span class="text-warning"><i class="fas fa-download"></i> ${book.downloadCount}</span>
          </div>
          <button class="btn btn-primary btn-sm w-100" onclick="downloadBook(${book.id}, '${book.title}')">
            <i class="fas fa-download me-2"></i>تحميل
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Display categories
function displayCategories(categories) {
  const categoriesContainer = document.getElementById('categoriesContainer');
  if (!categoriesContainer) return;

  categoriesContainer.innerHTML = categories.map(cat => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card category-card h-100 shadow-sm hover-shadow cursor-pointer" onclick="filterByCategory(${cat.id})">
        <div class="card-body text-center">
          <div class="fs-1 mb-3">${cat.icon || '📚'}</div>
          <h5 class="card-title">${cat.name}</h5>
          <p class="card-text text-muted">${cat.description}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Download book
async function downloadBook(bookId, bookTitle) {
  try {
    await DownloadsAPI.record(bookId);
    toastr.success(`تم تحميل "${bookTitle}" بنجاح`);
    // In a real app, this would trigger an actual file download
    console.log(`Download recorded for book: ${bookTitle}`);
  } catch (error) {
    toastr.error('فشل تحميل الكتاب');
  }
}

// Search books
async function searchBooks(query) {
  if (!query) {
    loadBooks();
    return;
  }

  try {
    const books = await BooksAPI.getAll(query);
    displayBooks(books);
  } catch (error) {
    toastr.error('فشل البحث');
  }
}

// Filter by category
async function filterByCategory(categoryId) {
  try {
    const books = await BooksAPI.getAll('', categoryId);
    displayBooks(books);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    toastr.error('فشل تصفية الكتب');
  }
}

// Submit contact form
async function submitContactForm(event) {
  event.preventDefault();
  
  const formData = {
    firstName: document.getElementById('firstName')?.value || '',
    lastName: document.getElementById('lastName')?.value || '',
    email: document.getElementById('email')?.value || '',
    phone: document.getElementById('phone')?.value || '',
    subject: document.getElementById('subject')?.value || '',
    message: document.getElementById('message')?.value || ''
  };

  try {
    await ContactsAPI.submit(formData);
    toastr.success('تم إرسال رسالتك بنجاح');
    document.getElementById('contactForm')?.reset();
  } catch (error) {
    toastr.error('فشل إرسال الرسالة');
  }
}

// Load statistics
async function loadStatistics() {
  try {
    const stats = await StatsAPI.getAll();
    
    // Update stats in the page
    const totalBooksEl = document.getElementById('totalBooks');
    const totalCategoriesEl = document.getElementById('totalCategories');
    const totalDownloadsEl = document.getElementById('totalDownloads');

    if (totalBooksEl) totalBooksEl.textContent = stats.totalBooks || 0;
    if (totalCategoriesEl) totalCategoriesEl.textContent = stats.totalCategories || 0;
    if (totalDownloadsEl) totalDownloadsEl.textContent = stats.totalDownloads || 0;
  } catch (error) {
    console.error('Failed to load statistics:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
  loadCategories();
  loadStatistics();
});
