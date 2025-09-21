// Books page JavaScript

$(document).ready(function() {
    loadBooks();
    
    // Filter and search event listeners
    $('#categoryFilter, #sortFilter').on('change', function() {
        filterBooks();
    });
    
    $('#searchInput').on('keyup', function(e) {
        if (e.keyCode === 13) {
            performSearch();
        }
    });
});

// Sample books data
var booksData = [
    {
        id: 1,
        title: 'كتاب البرمجة الحديثة',
        author: 'أحمد محمد',
        category: 'programming',
        description: 'دليل شامل لتعلم البرمجة من الصفر',
        rating: 4.8,
        downloads: 15420,
        publishDate: '2024-01-15',
        color: 'primary'
    },
    {
        id: 2,
        title: 'أساسيات التصميم الجرافيكي',
        author: 'فاطمة علي',
        category: 'design',
        description: 'تعلم مبادئ التصميم الجرافيكي',
        rating: 4.6,
        downloads: 12350,
        publishDate: '2024-02-10',
        color: 'success'
    },
    {
        id: 3,
        title: 'إدارة الأعمال الحديثة',
        author: 'محمد حسن',
        category: 'business',
        description: 'استراتيجيات النجاح في الأعمال',
        rating: 4.7,
        downloads: 18750,
        publishDate: '2024-01-28',
        color: 'info'
    },
    {
        id: 4,
        title: 'علم النفس التطبيقي',
        author: 'سارة أحمد',
        category: 'psychology',
        description: 'فهم السلوك الإنساني والنفسي',
        rating: 4.9,
        downloads: 21300,
        publishDate: '2024-03-05',
        color: 'warning'
    },
    {
        id: 5,
        title: 'الفيزياء الحديثة',
        author: 'عبدالله محمود',
        category: 'science',
        description: 'مقدمة في الفيزياء الحديثة والكمية',
        rating: 4.5,
        downloads: 9800,
        publishDate: '2024-02-20',
        color: 'danger'
    },
    {
        id: 6,
        title: 'الأدب العربي المعاصر',
        author: 'نورا سالم',
        category: 'literature',
        description: 'رحلة في الأدب العربي الحديث',
        rating: 4.4,
        downloads: 7650,
        publishDate: '2024-03-12',
        color: 'secondary'
    },
    {
        id: 7,
        title: 'تطوير تطبيقات الويب',
        author: 'خالد عمر',
        category: 'programming',
        description: 'تعلم تطوير تطبيقات الويب الحديثة',
        rating: 4.7,
        downloads: 13200,
        publishDate: '2024-02-28',
        color: 'primary'
    },
    {
        id: 8,
        title: 'التصميم الداخلي',
        author: 'ليلى حسن',
        category: 'design',
        description: 'أساسيات التصميم الداخلي والديكور',
        rating: 4.3,
        downloads: 8900,
        publishDate: '2024-03-08',
        color: 'success'
    },
    {
        id: 9,
        title: 'ريادة الأعمال',
        author: 'يوسف الأحمد',
        category: 'business',
        description: 'دليل شامل لبدء مشروعك الخاص',
        rating: 4.6,
        downloads: 16400,
        publishDate: '2024-01-22',
        color: 'info'
    },
    {
        id: 10,
        title: 'علم النفس الاجتماعي',
        author: 'مريم عبدالله',
        category: 'psychology',
        description: 'دراسة السلوك في المجتمع',
        rating: 4.5,
        downloads: 11200,
        publishDate: '2024-02-15',
        color: 'warning'
    },
    {
        id: 11,
        title: 'الكيمياء العضوية',
        author: 'حسام الدين',
        category: 'science',
        description: 'مبادئ الكيمياء العضوية والتطبيقات',
        rating: 4.2,
        downloads: 6800,
        publishDate: '2024-03-01',
        color: 'danger'
    },
    {
        id: 12,
        title: 'الشعر العربي الكلاسيكي',
        author: 'عائشة محمد',
        category: 'literature',
        description: 'دراسة في الشعر العربي القديم',
        rating: 4.1,
        downloads: 5400,
        publishDate: '2024-03-15',
        color: 'secondary'
    }
];

var currentBooks = [...booksData];

function loadBooks() {
    displayBooks(currentBooks);
}

function displayBooks(books) {
    var container = $('#booksContainer');
    container.empty();
    
    if (books.length === 0) {
        container.html(`
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-5x text-muted mb-3"></i>
                <h3 class="text-muted">لم يتم العثور على كتب</h3>
                <p class="text-muted">جرب تغيير معايير البحث أو الفلترة</p>
            </div>
        `);
        return;
    }
    
    books.forEach(function(book) {
        var bookCard = `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="book-card h-100 bg-white rounded-3 shadow-sm overflow-hidden">
                    <div class="book-cover bg-${book.color} d-flex align-items-center justify-content-center" style="height: 200px;">
                        <i class="fas fa-book fa-4x text-white"></i>
                    </div>
                    <div class="p-3">
                        <h5 class="fw-bold mb-2">${book.title}</h5>
                        <p class="text-muted small mb-2">
                            <i class="fas fa-user me-1"></i>المؤلف: ${book.author}
                        </p>
                        <p class="text-muted small mb-2">
                            <i class="fas fa-tag me-1"></i>التصنيف: ${getCategoryName(book.category)}
                        </p>
                        <p class="text-muted small mb-3">${book.description}</p>
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="rating">
                                <span class="text-warning">
                                    ${generateStars(book.rating)}
                                </span>
                                <small class="text-muted ms-1">${book.rating}</small>
                            </div>
                            <small class="text-muted">
                                <i class="fas fa-download me-1"></i>${book.downloads.toLocaleString()}
                            </small>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button class="btn btn-${book.color} btn-sm" onclick="showBookModal('book${book.id}')">
                                <i class="fas fa-eye me-1"></i>عرض التفاصيل
                            </button>
                            <button class="btn btn-outline-${book.color} btn-sm" onclick="downloadBook(${book.id})">
                                <i class="fas fa-download me-1"></i>تحميل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(bookCard);
    });
}

function getCategoryName(category) {
    var categories = {
        'programming': 'البرمجة',
        'design': 'التصميم',
        'business': 'الأعمال',
        'psychology': 'علم النفس',
        'science': 'العلوم',
        'literature': 'الأدب'
    };
    return categories[category] || category;
}

function filterBooks() {
    var categoryFilter = $('#categoryFilter').val();
    var sortFilter = $('#sortFilter').val();
    
    var filteredBooks = [...booksData];
    
    // Apply category filter
    if (categoryFilter) {
        filteredBooks = filteredBooks.filter(book => book.category === categoryFilter);
    }
    
    // Apply sorting
    switch (sortFilter) {
        case 'newest':
            filteredBooks.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
            break;
        case 'popular':
            filteredBooks.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'rating':
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
        case 'alphabetical':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
            break;
    }
    
    currentBooks = filteredBooks;
    displayBooks(currentBooks);
    
    showInfoToast(`تم العثور على ${filteredBooks.length} كتاب`);
}

function performSearch() {
    var searchTerm = $('#searchInput').val().toLowerCase().trim();
    
    if (!searchTerm) {
        currentBooks = [...booksData];
        displayBooks(currentBooks);
        return;
    }
    
    var searchResults = booksData.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
    );
    
    currentBooks = searchResults;
    displayBooks(currentBooks);
    
    if (searchResults.length > 0) {
        showSuccessToast(`تم العثور على ${searchResults.length} نتيجة للبحث عن "${$('#searchInput').val()}"`);
    } else {
        showWarningToast(`لم يتم العثور على نتائج للبحث عن "${$('#searchInput').val()}"`);
    }
}

function downloadBook(bookId) {
    var book = booksData.find(b => b.id === bookId);
    if (book) {
        showInfoToast('جاري تحضير التحميل...', 'انتظر');
        
        setTimeout(function() {
            showSuccessToast(`تم بدء تحميل كتاب "${book.title}"`, 'تحميل ناجح');
            
            // Update download count
            book.downloads++;
            
            // Refresh display if this book is currently visible
            var visibleBook = currentBooks.find(b => b.id === bookId);
            if (visibleBook) {
                visibleBook.downloads = book.downloads;
                displayBooks(currentBooks);
            }
        }, 2000);
    }
}

// Advanced search modal
function showAdvancedSearch() {
    var modalHTML = `
        <div class="modal fade" id="advancedSearchModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">البحث المتقدم</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="advancedSearchForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="advTitle" class="form-label">عنوان الكتاب</label>
                                    <input type="text" class="form-control" id="advTitle">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="advAuthor" class="form-label">المؤلف</label>
                                    <input type="text" class="form-control" id="advAuthor">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="advCategory" class="form-label">التصنيف</label>
                                    <select class="form-select" id="advCategory">
                                        <option value="">جميع التصنيفات</option>
                                        <option value="programming">البرمجة</option>
                                        <option value="design">التصميم</option>
                                        <option value="business">الأعمال</option>
                                        <option value="psychology">علم النفس</option>
                                        <option value="science">العلوم</option>
                                        <option value="literature">الأدب</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="advRating" class="form-label">التقييم الأدنى</label>
                                    <select class="form-select" id="advRating">
                                        <option value="">أي تقييم</option>
                                        <option value="4.5">4.5 نجوم فأكثر</option>
                                        <option value="4.0">4.0 نجوم فأكثر</option>
                                        <option value="3.5">3.5 نجوم فأكثر</option>
                                        <option value="3.0">3.0 نجوم فأكثر</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="advDateFrom" class="form-label">تاريخ النشر من</label>
                                    <input type="date" class="form-control" id="advDateFrom">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="advDateTo" class="form-label">تاريخ النشر إلى</label>
                                    <input type="date" class="form-control" id="advDateTo">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                        <button type="button" class="btn btn-primary" onclick="performAdvancedSearch()">بحث</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#advancedSearchModal').modal('show');
    
    $('#advancedSearchModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function performAdvancedSearch() {
    var title = $('#advTitle').val().toLowerCase();
    var author = $('#advAuthor').val().toLowerCase();
    var category = $('#advCategory').val();
    var minRating = parseFloat($('#advRating').val()) || 0;
    var dateFrom = $('#advDateFrom').val();
    var dateTo = $('#advDateTo').val();
    
    var results = booksData.filter(book => {
        var matchTitle = !title || book.title.toLowerCase().includes(title);
        var matchAuthor = !author || book.author.toLowerCase().includes(author);
        var matchCategory = !category || book.category === category;
        var matchRating = book.rating >= minRating;
        var matchDateFrom = !dateFrom || book.publishDate >= dateFrom;
        var matchDateTo = !dateTo || book.publishDate <= dateTo;
        
        return matchTitle && matchAuthor && matchCategory && matchRating && matchDateFrom && matchDateTo;
    });
    
    currentBooks = results;
    displayBooks(currentBooks);
    $('#advancedSearchModal').modal('hide');
    
    showSuccessToast(`تم العثور على ${results.length} نتيجة من البحث المتقدم`);
}

// Add to favorites
function addToFavorites(bookId) {
    var favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (!favorites.includes(bookId)) {
        favorites.push(bookId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showSuccessToast('تم إضافة الكتاب إلى المفضلة');
    } else {
        showInfoToast('الكتاب موجود بالفعل في المفضلة');
    }
}

// Remove from favorites
function removeFromFavorites(bookId) {
    var favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    var index = favorites.indexOf(bookId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showSuccessToast('تم إزالة الكتاب من المفضلة');
    }
}

// Check if book is in favorites
function isInFavorites(bookId) {
    var favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(bookId);
}

