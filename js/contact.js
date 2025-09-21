// Contact page JavaScript

$(document).ready(function() {
    // Initialize form validation
    initializeFormValidation();
    
    // Add smooth animations
    $('.contact-item').addClass('fade-in');
    
    // Auto-resize textarea
    $('#message').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});

function initializeFormValidation() {
    // Custom validation for contact form
    $('#contactForm').on('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (this.checkValidity()) {
            handleContactFormSubmission();
        } else {
            showErrorToast('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
        }
        
        $(this).addClass('was-validated');
    });
    
    // Real-time email validation
    $('#email').on('blur', function() {
        var email = $(this).val();
        if (email && !isValidEmail(email)) {
            $(this).addClass('is-invalid');
            showWarningToast('يرجى إدخال بريد إلكتروني صحيح');
        } else if (email) {
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });
    
    // Phone number formatting
    $('#phone').on('input', function() {
        var phone = $(this).val().replace(/\D/g, '');
        if (phone.length > 0) {
            // Format phone number (example: 967779644339 -> +967 77 964 4339)
            if (phone.startsWith('967')) {
                var formatted = '+967 ' + phone.substring(3, 5) + ' ' + 
                               phone.substring(5, 8) + ' ' + phone.substring(8);
                $(this).val(formatted.trim());
            }
        }
    });
}

function handleContactFormSubmission() {
    var formData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        subject: $('#subject').val(),
        message: $('#message').val()
    };
    
    // Show loading state
    var submitBtn = $('#contactForm button[type="submit"]');
    var originalText = submitBtn.html();
    submitBtn.html('<i class="fas fa-spinner fa-spin me-1"></i>جاري الإرسال...').prop('disabled', true);
    
    // Simulate form submission
    setTimeout(function() {
        // Reset button
        submitBtn.html(originalText).prop('disabled', false);
        
        // Show success message
        showSuccessToast('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'شكراً لك');
        
        // Reset form
        $('#contactForm')[0].reset();
        $('#contactForm').removeClass('was-validated');
        
        // Send confirmation email (simulation)
        sendConfirmationEmail(formData);
        
        // Log the contact attempt
        logContactAttempt(formData);
        
    }, 2000);
}

function sendConfirmationEmail(formData) {
    // Simulate sending confirmation email
    setTimeout(function() {
        showInfoToast('تم إرسال رسالة تأكيد إلى بريدك الإلكتروني', 'تأكيد الاستلام');
    }, 3000);
}

function logContactAttempt(formData) {
    // Store contact attempts in localStorage for analytics
    var contacts = JSON.parse(localStorage.getItem('contactAttempts') || '[]');
    contacts.push({
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    
    // Keep only last 50 contacts
    if (contacts.length > 50) {
        contacts = contacts.slice(-50);
    }
    
    localStorage.setItem('contactAttempts', JSON.stringify(contacts));
}

// Quick contact functions
function quickCall() {
    if (confirm('هل تريد الاتصال بنا الآن؟')) {
        window.location.href = 'tel:967779644339';
        showInfoToast('جاري فتح تطبيق الهاتف...', 'اتصال');
    }
}

function quickWhatsApp() {
    var message = encodeURIComponent('مرحباً، أريد الاستفسار عن المكتبة الإلكترونية الحديثة');
    var whatsappUrl = `https://wa.me/967779644339?text=${message}`;
    window.open(whatsappUrl, '_blank');
    showInfoToast('جاري فتح واتساب...', 'واتساب');
}

function quickEmail() {
    var subject = encodeURIComponent('استفسار عن المكتبة الإلكترونية الحديثة');
    var body = encodeURIComponent('مرحباً،\n\nأريد الاستفسار عن...\n\nشكراً لكم');
    var emailUrl = `mailto:yahayaljoby3@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
    showInfoToast('جاري فتح تطبيق البريد الإلكتروني...', 'إيميل');
}

// FAQ interactions
function searchFAQ() {
    var searchTerm = prompt('ابحث في الأسئلة الشائعة:');
    if (searchTerm) {
        var found = false;
        $('.accordion-body').each(function() {
            var text = $(this).text().toLowerCase();
            var header = $(this).closest('.accordion-item').find('.accordion-button').text().toLowerCase();
            
            if (text.includes(searchTerm.toLowerCase()) || header.includes(searchTerm.toLowerCase())) {
                $(this).closest('.accordion-item').find('.accordion-button').click();
                found = true;
                return false; // Break the loop
            }
        });
        
        if (found) {
            showSuccessToast(`تم العثور على إجابة لـ "${searchTerm}"`);
        } else {
            showWarningToast(`لم يتم العثور على إجابة لـ "${searchTerm}". يرجى التواصل معنا مباشرة.`);
        }
    }
}

// Contact form auto-save
function autoSaveForm() {
    var formData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        subject: $('#subject').val(),
        message: $('#message').val()
    };
    
    localStorage.setItem('contactFormDraft', JSON.stringify(formData));
}

function loadFormDraft() {
    var draft = localStorage.getItem('contactFormDraft');
    if (draft) {
        var formData = JSON.parse(draft);
        $('#firstName').val(formData.firstName || '');
        $('#lastName').val(formData.lastName || '');
        $('#email').val(formData.email || '');
        $('#phone').val(formData.phone || '');
        $('#subject').val(formData.subject || '');
        $('#message').val(formData.message || '');
        
        if (Object.values(formData).some(value => value)) {
            showInfoToast('تم استرداد مسودة الرسالة المحفوظة', 'مسودة محفوظة');
        }
    }
}

function clearFormDraft() {
    localStorage.removeItem('contactFormDraft');
}

// Initialize auto-save
$(document).ready(function() {
    // Load draft on page load
    loadFormDraft();
    
    // Auto-save every 30 seconds
    setInterval(autoSaveForm, 30000);
    
    // Auto-save on form changes
    $('#contactForm input, #contactForm select, #contactForm textarea').on('input change', function() {
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(autoSaveForm, 2000);
    });
    
    // Clear draft on successful submission
    $('#contactForm').on('submit', function() {
        if (this.checkValidity()) {
            setTimeout(clearFormDraft, 3000);
        }
    });
});

// Contact statistics
function getContactStatistics() {
    var contacts = JSON.parse(localStorage.getItem('contactAttempts') || '[]');
    var stats = {
        total: contacts.length,
        thisMonth: 0,
        bySubject: {},
        recentContacts: contacts.slice(-5)
    };
    
    var currentMonth = new Date().getMonth();
    var currentYear = new Date().getFullYear();
    
    contacts.forEach(function(contact) {
        var contactDate = new Date(contact.timestamp);
        if (contactDate.getMonth() === currentMonth && contactDate.getFullYear() === currentYear) {
            stats.thisMonth++;
        }
        
        stats.bySubject[contact.subject] = (stats.bySubject[contact.subject] || 0) + 1;
    });
    
    return stats;
}

// Export contact data
function exportContactData() {
    var contacts = JSON.parse(localStorage.getItem('contactAttempts') || '[]');
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "التاريخ,الاسم الأول,الاسم الأخير,البريد الإلكتروني,الهاتف,الموضوع,الرسالة\n";
    
    contacts.forEach(function(contact) {
        var row = [
            contact.timestamp,
            contact.firstName,
            contact.lastName,
            contact.email,
            contact.phone,
            contact.subject,
            contact.message.replace(/,/g, ';')
        ].join(',');
        csvContent += row + "\n";
    });
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contact_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessToast('تم تصدير بيانات الاتصال بنجاح');
}

// Keyboard shortcuts for contact page
$(document).keydown(function(e) {
    // Ctrl + Enter to submit form
    if (e.ctrlKey && e.keyCode === 13) {
        e.preventDefault();
        $('#contactForm').submit();
    }
    
    // Ctrl + S to save draft
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        autoSaveForm();
        showInfoToast('تم حفظ المسودة');
    }
});

// Contact page analytics
function trackContactPageView() {
    var pageViews = parseInt(localStorage.getItem('contactPageViews') || '0');
    pageViews++;
    localStorage.setItem('contactPageViews', pageViews.toString());
    
    var lastVisit = localStorage.getItem('lastContactPageVisit');
    var currentVisit = new Date().toISOString();
    localStorage.setItem('lastContactPageVisit', currentVisit);
    
    // Track time spent on page
    var startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        var timeSpent = Date.now() - startTime;
        var totalTime = parseInt(localStorage.getItem('contactPageTimeSpent') || '0');
        localStorage.setItem('contactPageTimeSpent', (totalTime + timeSpent).toString());
    });
}

// Initialize contact page tracking
$(document).ready(function() {
    trackContactPageView();
});

