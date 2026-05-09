// About page JavaScript

$(document).ready(function() {
    // Initialize animations
    initializeAnimations();
    
    // Initialize timeline
    initializeTimeline();
    
    // Initialize counters
    initializeCounters();
    
    // Add interactive effects
    addInteractiveEffects();
});

function initializeAnimations() {
    // Add fade-in animations to sections
    $('.value-card, .team-card, .timeline-item').addClass('fade-in');
    
    // Stagger animation for value cards
    $('.value-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.2) + 's');
    });
    
    // Stagger animation for team cards
    $('.team-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.3) + 's');
    });
}

function initializeTimeline() {
    // Add timeline styles
    var timelineCSS = `
        <style>
        .timeline {
            position: relative;
            padding: 2rem 0;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #007bff;
            transform: translateX(-50%);
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 3rem;
            display: flex;
            align-items: center;
        }
        
        .timeline-item:nth-child(odd) {
            flex-direction: row;
        }
        
        .timeline-item:nth-child(even) {
            flex-direction: row-reverse;
        }
        
        .timeline-marker {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        
        .timeline-content {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            width: 45%;
            position: relative;
        }
        
        .timeline-item:nth-child(odd) .timeline-content {
            margin-right: auto;
            margin-left: 5%;
        }
        
        .timeline-item:nth-child(even) .timeline-content {
            margin-left: auto;
            margin-right: 5%;
        }
        
        .timeline-content::before {
            content: '';
            position: absolute;
            top: 50%;
            width: 0;
            height: 0;
            border: 10px solid transparent;
            transform: translateY(-50%);
        }
        
        .timeline-item:nth-child(odd) .timeline-content::before {
            right: -20px;
            border-left-color: white;
        }
        
        .timeline-item:nth-child(even) .timeline-content::before {
            left: -20px;
            border-right-color: white;
        }
        
        @media (max-width: 768px) {
            .timeline::before {
                left: 20px;
            }
            
            .timeline-marker {
                left: 20px;
            }
            
            .timeline-item {
                flex-direction: row !important;
            }
            
            .timeline-content {
                width: calc(100% - 60px);
                margin-left: 60px !important;
                margin-right: 0 !important;
            }
            
            .timeline-content::before {
                left: -20px !important;
                right: auto !important;
                border-right-color: white !important;
                border-left-color: transparent !important;
            }
        }
        </style>
    `;
    
    $('head').append(timelineCSS);
    
    // Add click events to timeline items
    $('.timeline-item').on('click', function() {
        $(this).find('.timeline-content').toggleClass('shadow-lg');
        showInfoToast('تم النقر على عنصر الجدول الزمني');
    });
}

function initializeCounters() {
    // Animated counters for statistics
    var counters = [
        { element: '.badge:contains("10,000+")', target: 10000, suffix: '+' },
        { element: '.badge:contains("50,000+")', target: 50000, suffix: '+' },
        { element: '.badge:contains("15")', target: 15, suffix: '' },
        { element: '.badge:contains("1M+")', target: 1000000, suffix: '+' }
    ];
    
    // Intersection Observer for counter animation
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });
    
    var statsSection = document.querySelector('.about-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounters() {
    $('.badge').each(function() {
        var $this = $(this);
        var text = $this.text();
        var match = text.match(/(\d+(?:,\d+)*)/);
        
        if (match) {
            var target = parseInt(match[1].replace(/,/g, ''));
            var suffix = text.replace(match[1], '').trim();
            var current = 0;
            var increment = target / 50;
            
            var timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                var displayValue = Math.floor(current).toLocaleString();
                $this.text(displayValue + ' ' + suffix);
            }, 50);
        }
    });
}

function addInteractiveEffects() {
    // Hover effects for value cards
    $('.value-card').hover(
        function() {
            $(this).addClass('shadow-lg');
            $(this).find('.value-icon i').addClass('fa-bounce');
        },
        function() {
            $(this).removeClass('shadow-lg');
            $(this).find('.value-icon i').removeClass('fa-bounce');
        }
    );
    
    // Hover effects for team cards
    $('.team-card').hover(
        function() {
            $(this).addClass('shadow-lg');
            $(this).find('.team-image').addClass('bg-gradient');
        },
        function() {
            $(this).removeClass('shadow-lg');
            $(this).find('.team-image').removeClass('bg-gradient');
        }
    );
    
    // Click effects for vision and mission cards
    $('.vision-card, .mission-card').on('click', function() {
        $(this).addClass('border-primary border-3');
        setTimeout(() => {
            $(this).removeClass('border-primary border-3');
        }, 2000);
        
        var cardType = $(this).hasClass('vision-card') ? 'الرؤية' : 'الرسالة';
        showInfoToast(`تم النقر على بطاقة ${cardType}`);
    });
}

// Team member interaction
function showTeamMemberDetails(memberName) {
    var memberDetails = {
        'يحيى الجوبي': {
            name: 'يحيى الجوبي',
            position: 'مؤسس ومدير المشروع',
            bio: 'مختص في تطوير المنصات الرقمية ونشر المحتوى العلمي. يتمتع بخبرة واسعة في مجال التكنولوجيا والتعليم الإلكتروني.',
            skills: ['إدارة المشاريع', 'تطوير المنصات', 'التسويق الرقمي', 'إدارة المحتوى'],
            contact: {
                whatsapp: '967779644339',
                email: 'yahayaljoby3@gmail.com'
            }
        }
    };
    
    var member = memberDetails[memberName];
    if (member) {
        var modalHTML = `
            <div class="modal fade" id="memberModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${member.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-3">
                                <div class="member-avatar bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                                    <i class="fas fa-user fa-2x text-white"></i>
                                </div>
                                <h4 class="mt-2">${member.name}</h4>
                                <p class="text-primary">${member.position}</p>
                            </div>
                            
                            <div class="member-bio mb-3">
                                <h6 class="fw-bold">نبذة شخصية:</h6>
                                <p class="text-muted">${member.bio}</p>
                            </div>
                            
                            <div class="member-skills mb-3">
                                <h6 class="fw-bold">المهارات:</h6>
                                <div class="skills-tags">
                                    ${member.skills.map(skill => 
                                        `<span class="badge bg-primary me-1 mb-1">${skill}</span>`
                                    ).join('')}
                                </div>
                            </div>
                            
                            <div class="member-contact">
                                <h6 class="fw-bold">التواصل:</h6>
                                <div class="contact-buttons">
                                    <a href="https://wa.me/${member.contact.whatsapp}" class="btn btn-success btn-sm me-2" target="_blank">
                                        <i class="fab fa-whatsapp me-1"></i>واتساب
                                    </a>
                                    <a href="mailto:${member.contact.email}" class="btn btn-primary btn-sm">
                                        <i class="fas fa-envelope me-1"></i>إيميل
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHTML);
        $('#memberModal').modal('show');
        
        $('#memberModal').on('hidden.bs.modal', function() {
            $(this).remove();
        });
    }
}

// Company statistics
function getCompanyStatistics() {
    return {
        founded: '2024',
        totalBooks: 10000,
        totalUsers: 50000,
        totalDownloads: 1000000,
        categories: 15,
        teamMembers: 12,
        countries: 22,
        languages: 3
    };
}

function showDetailedStatistics() {
    var stats = getCompanyStatistics();
    var modalHTML = `
        <div class="modal fade" id="statsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">إحصائيات مفصلة</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row text-center">
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-primary text-white rounded">
                                    <i class="fas fa-calendar fa-2x mb-2"></i>
                                    <h4>${stats.founded}</h4>
                                    <p class="mb-0">سنة التأسيس</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-success text-white rounded">
                                    <i class="fas fa-book fa-2x mb-2"></i>
                                    <h4>${stats.totalBooks.toLocaleString()}</h4>
                                    <p class="mb-0">إجمالي الكتب</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-info text-white rounded">
                                    <i class="fas fa-users fa-2x mb-2"></i>
                                    <h4>${stats.totalUsers.toLocaleString()}</h4>
                                    <p class="mb-0">المستخدمون</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-warning text-white rounded">
                                    <i class="fas fa-download fa-2x mb-2"></i>
                                    <h4>${stats.totalDownloads.toLocaleString()}</h4>
                                    <p class="mb-0">التحميلات</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-danger text-white rounded">
                                    <i class="fas fa-layer-group fa-2x mb-2"></i>
                                    <h4>${stats.categories}</h4>
                                    <p class="mb-0">التصنيفات</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-secondary text-white rounded">
                                    <i class="fas fa-user-tie fa-2x mb-2"></i>
                                    <h4>${stats.teamMembers}</h4>
                                    <p class="mb-0">أعضاء الفريق</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-dark text-white rounded">
                                    <i class="fas fa-globe fa-2x mb-2"></i>
                                    <h4>${stats.countries}</h4>
                                    <p class="mb-0">دولة</p>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="stat-box p-3 bg-primary text-white rounded">
                                    <i class="fas fa-language fa-2x mb-2"></i>
                                    <h4>${stats.languages}</h4>
                                    <p class="mb-0">لغات</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <h6 class="fw-bold">نمو المنصة عبر الوقت:</h6>
                            <div class="progress-timeline">
                                <div class="progress mb-2">
                                    <div class="progress-bar bg-success" style="width: 100%">2024 - الإطلاق</div>
                                </div>
                                <div class="progress mb-2">
                                    <div class="progress-bar bg-info" style="width: 75%">التوسع في المحتوى</div>
                                </div>
                                <div class="progress mb-2">
                                    <div class="progress-bar bg-warning" style="width: 50%">تطوير الميزات</div>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar bg-primary" style="width: 25%">المستقبل</div>
                                </div>
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

// Scroll animations
function initializeScrollAnimations() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in-right');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.value-card, .team-card, .timeline-item').forEach(function(el) {
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is ready
$(document).ready(function() {
    initializeScrollAnimations();
    
    // Add click handlers for team cards
    $('.team-card').on('click', function() {
        var memberName = $(this).find('h4').text();
        if (memberName === 'يحيى الجوبي') {
            showTeamMemberDetails(memberName);
        } else {
            showInfoToast(`معلومات ${memberName} ستكون متاحة قريباً`);
        }
    });
    
    // Add click handler for statistics
    $('.badge').on('click', function() {
        showDetailedStatistics();
    });
});

