// Categories page JavaScript

$(document).ready(function() {
    loadCategories();
    
    // Add animations
    $('.popular-category-card, .stat-card').addClass('fade-in');
});

// Categories data
var categoriesData = [
    {
        id: 'programming',
        name: 'البرمجة وتطوير البرمجيات',
        icon: 'fas fa-code',
        color: 'primary',
        description: 'كتب شاملة في البرمجة ولغات البرمجة المختلفة وتطوير التطبيقات',
        bookCount: 150,
        downloadCount: 25000,
        subcategories: ['تطوير الويب', 'تطبيقات الجوال', 'الذكاء الاصطناعي', 'قواعد البيانات']
    },
    {
        id: 'business',
        name: 'إدارة الأعمال والاقتصاد',
        icon: 'fas fa-briefcase',
        color: 'success',
        description: 'استراتيجيات الأعمال والإدارة الحديثة وريادة الأعمال',
        bookCount: 120,
        downloadCount: 18500,
        subcategories: ['ريادة الأعمال', 'التسويق', 'المحاسبة', 'الإدارة المالية']
    },
    {
        id: 'psychology',
        name: 'علم النفس والتنمية البشرية',
        icon: 'fas fa-brain',
        color: 'info',
        description: 'فهم السلوك الإنساني والنفسي والتطوير الذاتي',
        bookCount: 95,
        downloadCount: 15200,
        subcategories: ['علم النفس العام', 'التنمية الذاتية', 'علم النفس الاجتماعي', 'العلاج النفسي']
    },
    {
        id: 'science',
        name: 'العلوم الطبيعية والرياضيات',
        icon: 'fas fa-flask',
        color: 'warning',
        description: 'الفيزياء والكيمياء والرياضيات والعلوم الطبيعية',
        bookCount: 85,
        downloadCount: 12800,
        subcategories: ['الفيزياء', 'الكيمياء', 'الرياضيات', 'علوم الأرض']
    },
    {
        id: 'literature',
        name: 'الأدب واللغة العربية',
        icon: 'fas fa-feather-alt',
        color: 'danger',
        description: 'الأدب العربي والشعر والنثر واللغة العربية',
        bookCount: 110,
        downloadCount: 14600,
        subcategories: ['الشعر العربي', 'الرواية', 'النقد الأدبي', 'اللغة العربية']
    },
    {
        id: 'design',
        name: 'التصميم والفنون',
        icon: 'fas fa-palette',
        color: 'secondary',
        description: 'التصميم الجرافيكي والفنون البصرية والإبداع',
        bookCount: 75,
        downloadCount: 11200,
        subcategories: ['التصميم الجرافيكي', 'التصميم الداخلي', 'الفنون التشكيلية', 'التصوير']
    },
    {
        id: 'medicine',
        name: 'الطب والعلوم الصحية',
        icon: 'fas fa-stethoscope',
        color: 'primary',
        description: 'الطب والصحة والعلوم الطبية والتمريض',
        bookCount: 90,
        downloadCount: 16800,
        subcategories: ['الطب العام', 'التمريض', 'الصيدلة', 'طب الأسنان']
    },
    {
        id: 'engineering',
        name: 'الهندسة والتكنولوجيا',
        icon: 'fas fa-cogs',
        color: 'success',
        description: 'الهندسة بجميع فروعها والتكنولوجيا الحديثة',
        bookCount: 105,
        downloadCount: 19200,
        subcategories: ['الهندسة المدنية', 'الهندسة الكهربائية', 'هندسة الحاسوب', 'الهندسة الميكانيكية']
    },
    {
        id: 'education',
        name: 'التعليم والتربية',
        icon: 'fas fa-graduation-cap',
        color: 'info',
        description: 'علوم التربية والتعليم وطرق التدريس',
        bookCount: 80,
        downloadCount: 13500,
        subcategories: ['طرق التدريس', 'علم النفس التربوي', 'تكنولوجيا التعليم', 'إدارة التعليم']
    },
    {
        id: 'history',
        name: 'التاريخ والحضارة',
        icon: 'fas fa-landmark',
        color: 'warning',
        description: 'التاريخ الإسلامي والعربي والحضارات القديمة',
        bookCount: 70,
        downloadCount: 10800,
        subcategories: ['التاريخ الإسلامي', 'التاريخ العربي', 'الحضارات القديمة', 'التاريخ الحديث']
    },
    {
        id: 'religion',
        name: 'الدين والدراسات الإسلامية',
        icon: 'fas fa-mosque',
        color: 'danger',
        description: 'القرآن الكريم والحديث الشريف والفقه الإسلامي',
        bookCount: 125,
        downloadCount: 22000,
        subcategories: ['القرآن الكريم', 'الحديث الشريف', 'الفقه الإسلامي', 'السيرة النبوية']
    },
    {
        id: 'philosophy',
        name: 'الفلسفة والفكر',
        icon: 'fas fa-lightbulb',
        color: 'secondary',
        description: 'الفلسفة والفكر الإسلامي والفلسفة الغربية',
        bookCount: 60,
        downloadCount: 8900,
        subcategories: ['الفلسفة الإسلامية', 'الفلسفة الغربية', 'الفكر المعاصر', 'المنطق']
    }
];

function loadCategories() {
    var container = $('#categoriesContainer');
    container.empty();
    
    categoriesData.forEach(function(category) {
        var categoryCard = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="category-card h-100 bg-white rounded-3 shadow-sm overflow-hidden">
                    <div class="category-header bg-${category.color} text-white p-4 text-center">
                        <i class="${category.icon} fa-3x mb-3"></i>
                        <h4 class="fw-bold mb-0">${category.name}</h4>
                    </div>
                    <div class="category-body p-4">
                        <p class="text-muted mb-3">${category.description}</p>
                        
                        <div class="category-stats mb-3">
                            <div class="row text-center">
                                <div class="col-6">
                                    <div class="stat-item">
                                        <h5 class="fw-bold text-${category.color} mb-1">${category.bookCount}</h5>
                                        <small class="text-muted">كتاب</small>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="stat-item">
                                        <h5 class="fw-bold text-${category.color} mb-1">${category.downloadCount.toLocaleString()}</h5>
                                        <small class="text-muted">تحميل</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="subcategories mb-3">
                            <h6 class="fw-bold mb-2">التصنيفات الفرعية:</h6>
                            <div class="subcategory-tags">
                                ${category.subcategories.map(sub => 
                                    `<span class="badge bg-light text-dark me-1 mb-1">${sub}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button class="btn btn-${category.color}" onclick="viewCategory('${category.id}')">
                                <i class="fas fa-eye me-1"></i>عرض الكتب
                            </button>
                            <button class="btn btn-outline-${category.color} btn-sm" onclick="subscribeToCategoryUpdates('${category.id}')">
                                <i class="fas fa-bell me-1"></i>تنبيهات الكتب الجديدة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(categoryCard);
    });
    
    // Add animation to cards
    $('.category-card').addClass('fade-in');
}

function viewCategory(categoryId) {
    // Redirect to books page with category filter
    window.location.href = `books.html?category=${categoryId}`;
    showInfoToast('جاري تحميل كتب التصنيف...', 'انتظر');
}

function subscribeToCategoryUpdates(categoryId) {
    var category = categoriesData.find(cat => cat.id === categoryId);
    if (category) {
        var subscriptions = JSON.parse(localStorage.getItem('categorySubscriptions') || '[]');
        
        if (!subscriptions.includes(categoryId)) {
            subscriptions.push(categoryId);
            localStorage.setItem('categorySubscriptions', JSON.stringify(subscriptions));
            showSuccessToast(`تم الاشتراك في تنبيهات "${category.name}"`, 'اشتراك ناجح');
        } else {
            showInfoToast(`أنت مشترك بالفعل في تنبيهات "${category.name}"`);
        }
    }
}

function unsubscribeFromCategoryUpdates(categoryId) {
    var subscriptions = JSON.parse(localStorage.getItem('categorySubscriptions') || '[]');
    var index = subscriptions.indexOf(categoryId);
    
    if (index > -1) {
        subscriptions.splice(index, 1);
        localStorage.setItem('categorySubscriptions', JSON.stringify(subscriptions));
        
        var category = categoriesData.find(cat => cat.id === categoryId);
        if (category) {
            showSuccessToast(`تم إلغاء الاشتراك من تنبيهات "${category.name}"`);
        }
    }
}

function getCategoryStatistics() {
    var totalBooks = categoriesData.reduce((sum, cat) => sum + cat.bookCount, 0);
    var totalDownloads = categoriesData.reduce((sum, cat) => sum + cat.downloadCount, 0);
    var mostPopular = categoriesData.reduce((prev, current) => 
        (prev.downloadCount > current.downloadCount) ? prev : current
    );
    var leastPopular = categoriesData.reduce((prev, current) => 
        (prev.downloadCount < current.downloadCount) ? prev : current
    );
    
    return {
        totalCategories: categoriesData.length,
        totalBooks: totalBooks,
        totalDownloads: totalDownloads,
        averageBooksPerCategory: Math.round(totalBooks / categoriesData.length),
        mostPopular: mostPopular,
        leastPopular: leastPopular
    };
}

function showCategoryStatistics() {
    var stats = getCategoryStatistics();
    var modalHTML = `
        <div class="modal fade" id="statsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">إحصائيات التصنيفات التفصيلية</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row text-center mb-4">
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-primary text-white rounded">
                                    <h3>${stats.totalCategories}</h3>
                                    <p class="mb-0">إجمالي التصنيفات</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-success text-white rounded">
                                    <h3>${stats.totalBooks.toLocaleString()}</h3>
                                    <p class="mb-0">إجمالي الكتب</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-info text-white rounded">
                                    <h3>${stats.totalDownloads.toLocaleString()}</h3>
                                    <p class="mb-0">إجمالي التحميلات</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-warning text-white rounded">
                                    <h3>${stats.averageBooksPerCategory}</h3>
                                    <p class="mb-0">متوسط الكتب لكل تصنيف</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="fw-bold">الأكثر شعبية:</h6>
                                <div class="alert alert-success">
                                    <i class="${stats.mostPopular.icon} me-2"></i>
                                    <strong>${stats.mostPopular.name}</strong><br>
                                    <small>${stats.mostPopular.downloadCount.toLocaleString()} تحميل</small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6 class="fw-bold">الأقل شعبية:</h6>
                                <div class="alert alert-info">
                                    <i class="${stats.leastPopular.icon} me-2"></i>
                                    <strong>${stats.leastPopular.name}</strong><br>
                                    <small>${stats.leastPopular.downloadCount.toLocaleString()} تحميل</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="category-chart">
                            <h6 class="fw-bold mb-3">توزيع التحميلات حسب التصنيف:</h6>
                            <div class="progress-stacked" style="height: 30px;">
                                ${categoriesData.map(cat => {
                                    var percentage = (cat.downloadCount / stats.totalDownloads * 100).toFixed(1);
                                    return `<div class="progress" role="progressbar" style="width: ${percentage}%" title="${cat.name}: ${percentage}%">
                                        <div class="progress-bar bg-${cat.color}"></div>
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">إغلاق</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    $('#statsModal').modal('show');
    
    $('#statsModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function searchCategories() {
    var searchTerm = prompt('ابحث في التصنيفات:');
    if (searchTerm) {
        var results = categoriesData.filter(cat => 
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        if (results.length > 0) {
            displaySearchResults(results, searchTerm);
        } else {
            showWarningToast(`لم يتم العثور على تصنيفات تحتوي على "${searchTerm}"`);
        }
    }
}

function displaySearchResults(results, searchTerm) {
    var container = $('#categoriesContainer');
    container.empty();
    
    // Add search results header
    container.append(`
        <div class="col-12 mb-4">
            <div class="alert alert-info">
                <i class="fas fa-search me-2"></i>
                <strong>نتائج البحث عن "${searchTerm}":</strong> تم العثور على ${results.length} تصنيف
                <button class="btn btn-sm btn-outline-info ms-2" onclick="loadCategories()">
                    <i class="fas fa-times me-1"></i>إلغاء البحث
                </button>
            </div>
        </div>
    `);
    
    results.forEach(function(category) {
        var categoryCard = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="category-card h-100 bg-white rounded-3 shadow-sm overflow-hidden border-${category.color}">
                    <div class="category-header bg-${category.color} text-white p-4 text-center">
                        <i class="${category.icon} fa-3x mb-3"></i>
                        <h4 class="fw-bold mb-0">${category.name}</h4>
                    </div>
                    <div class="category-body p-4">
                        <p class="text-muted mb-3">${category.description}</p>
                        
                        <div class="category-stats mb-3">
                            <div class="row text-center">
                                <div class="col-6">
                                    <div class="stat-item">
                                        <h5 class="fw-bold text-${category.color} mb-1">${category.bookCount}</h5>
                                        <small class="text-muted">كتاب</small>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="stat-item">
                                        <h5 class="fw-bold text-${category.color} mb-1">${category.downloadCount.toLocaleString()}</h5>
                                        <small class="text-muted">تحميل</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-grid">
                            <button class="btn btn-${category.color}" onclick="viewCategory('${category.id}')">
                                <i class="fas fa-eye me-1"></i>عرض الكتب
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(categoryCard);
    });
    
    showSuccessToast(`تم العثور على ${results.length} تصنيف`);
}

function exportCategoriesData() {
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "التصنيف,الوصف,عدد الكتب,عدد التحميلات,التصنيفات الفرعية\n";
    
    categoriesData.forEach(function(category) {
        var row = [
            category.name,
            category.description,
            category.bookCount,
            category.downloadCount,
            category.subcategories.join('; ')
        ].join(',');
        csvContent += row + "\n";
    });
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "categories_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessToast('تم تصدير بيانات التصنيفات بنجاح');
}

// Initialize categories page
$(document).ready(function() {
    // Check for category parameter in URL
    var urlParams = new URLSearchParams(window.location.search);
    var categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        // Highlight specific category if coming from a link
        setTimeout(function() {
            var categoryCard = $(`.category-card:contains("${categoryParam}")`).first();
            if (categoryCard.length) {
                categoryCard.addClass('border-primary border-3');
                $('html, body').animate({
                    scrollTop: categoryCard.offset().top - 100
                }, 1000);
            }
        }, 500);
    }
});

