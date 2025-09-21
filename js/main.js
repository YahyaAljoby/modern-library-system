// Main JavaScript for Modern Library System

$(document).ready(function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize toastr options
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    // Add fade-in animation to elements
    $('.feature-card, .book-card, .stat-item').addClass('fade-in');

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if( target.length ) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Form validation
    $('.needs-validation').on('submit', function(event) {
        if (!this.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        $(this).addClass('was-validated');
    });

    // Auto-hide alerts after 5 seconds
    $('.alert').delay(5000).fadeOut('slow');

    // Loading animation for buttons
    $('.btn-loading').on('click', function() {
        var $btn = $(this);
        var originalText = $btn.html();
        $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>جاري التحميل...');
        $btn.prop('disabled', true);
        
        setTimeout(function() {
            $btn.html(originalText);
            $btn.prop('disabled', false);
        }, 3000);
    });
});

// Toast Notifications
function showWelcomeToast() {
    toastr.success('مرحباً بك في المكتبة الإلكترونية الحديثة!', 'أهلاً وسهلاً');
}

function showSuccessToast(message, title = 'نجح') {
    toastr.success(message, title);
}

function showErrorToast(message, title = 'خطأ') {
    toastr.error(message, title);
}

function showInfoToast(message, title = 'معلومة') {
    toastr.info(message, title);
}

function showWarningToast(message, title = 'تحذير') {
    toastr.warning(message, title);
}

// Newsletter subscription
function subscribeNewsletter() {
    var email = $('.input-group input[type="email"]').val();
    
    if (!email) {
        showErrorToast('يرجى إدخال بريدك الإلكتروني');
        return;
    }
    
    if (!isValidEmail(email)) {
        showErrorToast('يرجى إدخال بريد إلكتروني صحيح');
        return;
    }
    
    // Simulate API call
    showInfoToast('جاري الاشتراك...', 'انتظر');
    
    setTimeout(function() {
        showSuccessToast('تم الاشتراك بنجاح في النشرة الإخبارية!', 'شكراً لك');
        $('.input-group input[type="email"]').val('');
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Login handling
function handleLogin() {
    var email = $('#loginEmail').val();
    var password = $('#loginPassword').val();
    
    // Basic validation
    if (!email || !password) {
        showErrorToast('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    if (!isValidEmail(email)) {
        showErrorToast('يرجى إدخال بريد إلكتروني صحيح');
        return;
    }
    
    if (password.length < 6) {
        showErrorToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    // Simulate login process
    showInfoToast('جاري تسجيل الدخول...', 'انتظر');
    
    setTimeout(function() {
        showSuccessToast('تم تسجيل الدخول بنجاح!', 'مرحباً بك');
        $('#loginModal').modal('hide');
        
        // Update UI to show logged in state
        updateUIForLoggedInUser(email);
    }, 2000);
}

// Register handling
function handleRegister() {
    var name = $('#registerName').val();
    var email = $('#registerEmail').val();
    var password = $('#registerPassword').val();
    var confirmPassword = $('#confirmPassword').val();
    var agreeTerms = $('#agreeTerms').is(':checked');
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showErrorToast('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    if (!isValidEmail(email)) {
        showErrorToast('يرجى إدخال بريد إلكتروني صحيح');
        return;
    }
    
    if (password.length < 6) {
        showErrorToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    if (password !== confirmPassword) {
        showErrorToast('كلمات المرور غير متطابقة');
        return;
    }
    
    if (!agreeTerms) {
        showErrorToast('يجب الموافقة على الشروط والأحكام');
        return;
    }
    
    // Simulate registration process
    showInfoToast('جاري إنشاء الحساب...', 'انتظر');
    
    setTimeout(function() {
        showSuccessToast('تم إنشاء الحساب بنجاح!', 'مرحباً بك');
        $('#registerModal').modal('hide');
        
        // Update UI to show logged in state
        updateUIForLoggedInUser(email);
    }, 2000);
}

// Update UI for logged in user
function updateUIForLoggedInUser(email) {
    // Hide login/register buttons and show user menu
    var userMenu = `
        <div class="dropdown">
            <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>${email.split('@')[0]}
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>الملف الشخصي</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-book me-2"></i>كتبي</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-heart me-2"></i>المفضلة</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" onclick="handleLogout()"><i class="fas fa-sign-out-alt me-2"></i>تسجيل الخروج</a></li>
            </ul>
        </div>
    `;
    
    $('.navbar-nav .nav-item:last-child').prev().prev().nextAll().remove();
    $('.navbar-nav').append('<li class="nav-item">' + userMenu + '</li>');
}

// Logout handling
function handleLogout() {
    showInfoToast('جاري تسجيل الخروج...', 'انتظر');
    
    setTimeout(function() {
        showSuccessToast('تم تسجيل الخروج بنجاح', 'وداعاً');
        location.reload();
    }, 1000);
}

// Book modal handling with AJAX
function showBookModal(bookId) {
    $('#bookModal').modal('show');
    $('#bookModalBody').html('<div class="text-center"><div class="spinner"></div><p>جاري تحميل تفاصيل الكتاب...</p></div>');
    
    // Simulate AJAX call to get book details
    setTimeout(function() {
        loadBookDetails(bookId);
    }, 1500);
}

function loadBookDetails(bookId) {
    // Sample book data
    var books = {
        'book1': {
            title: 'كتاب البرمجة الحديثة',
            author: 'أحمد محمد',
            description: 'دليل شامل لتعلم البرمجة من الصفر حتى الاحتراف. يغطي الكتاب أساسيات البرمجة ولغات البرمجة المختلفة مع أمثلة عملية وتطبيقات حقيقية.',
            pages: 350,
            language: 'العربية',
            category: 'تكنولوجيا',
            rating: 4.8,
            downloads: 15420,
            publishDate: '2024-01-15'
        },
        'book2': {
            title: 'أساسيات التصميم',
            author: 'فاطمة علي',
            description: 'تعلم مبادئ التصميم الجرافيكي والتصميم الرقمي. يشمل الكتاب نظرية الألوان، التايبوغرافي، والتكوين البصري مع أمثلة عملية.',
            pages: 280,
            language: 'العربية',
            category: 'فنون وتصميم',
            rating: 4.6,
            downloads: 12350,
            publishDate: '2024-02-10'
        },
        'book3': {
            title: 'إدارة الأعمال',
            author: 'محمد حسن',
            description: 'استراتيجيات النجاح في الأعمال والإدارة الحديثة. يغطي الكتاب مواضيع القيادة، التخطيط الاستراتيجي، وإدارة الفرق.',
            pages: 420,
            language: 'العربية',
            category: 'أعمال وإدارة',
            rating: 4.7,
            downloads: 18750,
            publishDate: '2024-01-28'
        },
        'book4': {
            title: 'علم النفس',
            author: 'سارة أحمد',
            description: 'فهم السلوك الإنساني والنفسي من منظور علمي حديث. يتناول الكتاب علم النفس التطبيقي والعلاج النفسي.',
            pages: 390,
            language: 'العربية',
            category: 'علم النفس',
            rating: 4.9,
            downloads: 21300,
            publishDate: '2024-03-05'
        }
    };
    
    var book = books[bookId];
    
    if (book) {
        var bookDetailsHTML = `
            <div class="row">
                <div class="col-md-4">
                    <div class="book-cover bg-primary d-flex align-items-center justify-content-center" style="height: 300px; border-radius: 10px;">
                        <i class="fas fa-book fa-6x text-white"></i>
                    </div>
                </div>
                <div class="col-md-8">
                    <h3 class="fw-bold mb-3">${book.title}</h3>
                    <p class="text-muted mb-2"><i class="fas fa-user me-2"></i><strong>المؤلف:</strong> ${book.author}</p>
                    <p class="text-muted mb-2"><i class="fas fa-tag me-2"></i><strong>التصنيف:</strong> ${book.category}</p>
                    <p class="text-muted mb-2"><i class="fas fa-file-alt me-2"></i><strong>عدد الصفحات:</strong> ${book.pages}</p>
                    <p class="text-muted mb-2"><i class="fas fa-language me-2"></i><strong>اللغة:</strong> ${book.language}</p>
                    <p class="text-muted mb-2"><i class="fas fa-calendar me-2"></i><strong>تاريخ النشر:</strong> ${book.publishDate}</p>
                    <p class="text-muted mb-3"><i class="fas fa-download me-2"></i><strong>التحميلات:</strong> ${book.downloads.toLocaleString()}</p>
                    
                    <div class="rating mb-3">
                        <span class="text-warning">
                            ${generateStars(book.rating)}
                        </span>
                        <span class="ms-2">${book.rating}/5</span>
                    </div>
                    
                    <div class="description">
                        <h5>وصف الكتاب:</h5>
                        <p class="text-muted">${book.description}</p>
                    </div>
                </div>
            </div>
        `;
        
        $('#bookModalTitle').text(book.title);
        $('#bookModalBody').html(bookDetailsHTML);
    } else {
        $('#bookModalBody').html('<div class="alert alert-danger">عذراً، لم يتم العثور على تفاصيل الكتاب.</div>');
    }
}

function generateStars(rating) {
    var stars = '';
    var fullStars = Math.floor(rating);
    var hasHalfStar = rating % 1 !== 0;
    
    for (var i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    var emptyStars = 5 - Math.ceil(rating);
    for (var i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Search functionality
function performSearch() {
    var searchTerm = $('#searchInput').val();
    
    if (!searchTerm.trim()) {
        showWarningToast('يرجى إدخال كلمة البحث');
        return;
    }
    
    showInfoToast('جاري البحث...', 'انتظر');
    
    // Simulate search
    setTimeout(function() {
        showSuccessToast(`تم العثور على ${Math.floor(Math.random() * 50) + 1} نتيجة للبحث عن "${searchTerm}"`);
    }, 1500);
}

// Keyboard shortcuts
$(document).keydown(function(e) {
    // Ctrl + K for search
    if (e.ctrlKey && e.keyCode === 75) {
        e.preventDefault();
        $('#searchInput').focus();
    }
    
    // Escape to close modals
    if (e.keyCode === 27) {
        $('.modal').modal('hide');
    }
});

// Lazy loading for images
function lazyLoadImages() {
    var images = document.querySelectorAll('img[data-src]');
    var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(function(img) {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading when DOM is ready
$(document).ready(function() {
    lazyLoadImages();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed');
        });
    });
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    var isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    if (isDarkMode) {
        showInfoToast('تم تفعيل الوضع الليلي');
    } else {
        showInfoToast('تم تفعيل الوضع النهاري');
    }
}

// Load dark mode preference
$(document).ready(function() {
    var isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});

// Print functionality
function printPage() {
    window.print();
}

// Share functionality
function shareContent(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).then(function() {
            showSuccessToast('تم المشاركة بنجاح');
        }).catch(function(error) {
            console.log('Error sharing:', error);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        var shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        window.open(shareUrl, '_blank');
    }
}

