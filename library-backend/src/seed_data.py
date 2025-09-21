#!/usr/bin/env python3
"""
Seed data script for the Modern Library System
This script populates the database with sample data for testing and demonstration
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from datetime import datetime, date
from src.models.user import db, User
from src.models.book import Book, Category, BookReview, UserFavorite
from src.routes.contact import ContactMessage, NewsletterSubscription
from src.main import app

def create_categories():
    """Create sample categories"""
    categories_data = [
        {
            'name': 'البرمجة وتطوير البرمجيات',
            'description': 'كتب شاملة في البرمجة ولغات البرمجة المختلفة وتطوير التطبيقات',
            'icon': 'fas fa-code',
            'color': 'primary'
        },
        {
            'name': 'إدارة الأعمال والاقتصاد',
            'description': 'استراتيجيات الأعمال والإدارة الحديثة وريادة الأعمال',
            'icon': 'fas fa-briefcase',
            'color': 'success'
        },
        {
            'name': 'علم النفس والتنمية البشرية',
            'description': 'فهم السلوك الإنساني والنفسي والتطوير الذاتي',
            'icon': 'fas fa-brain',
            'color': 'info'
        },
        {
            'name': 'العلوم الطبيعية والرياضيات',
            'description': 'الفيزياء والكيمياء والرياضيات والعلوم الطبيعية',
            'icon': 'fas fa-flask',
            'color': 'warning'
        },
        {
            'name': 'الأدب واللغة العربية',
            'description': 'الأدب العربي والشعر والنثر واللغة العربية',
            'icon': 'fas fa-feather-alt',
            'color': 'danger'
        },
        {
            'name': 'التصميم والفنون',
            'description': 'التصميم الجرافيكي والفنون البصرية والإبداع',
            'icon': 'fas fa-palette',
            'color': 'secondary'
        },
        {
            'name': 'الطب والعلوم الصحية',
            'description': 'الطب والصحة والعلوم الطبية والتمريض',
            'icon': 'fas fa-stethoscope',
            'color': 'primary'
        },
        {
            'name': 'الهندسة والتكنولوجيا',
            'description': 'الهندسة بجميع فروعها والتكنولوجيا الحديثة',
            'icon': 'fas fa-cogs',
            'color': 'success'
        },
        {
            'name': 'التعليم والتربية',
            'description': 'علوم التربية والتعليم وطرق التدريس',
            'icon': 'fas fa-graduation-cap',
            'color': 'info'
        },
        {
            'name': 'التاريخ والحضارة',
            'description': 'التاريخ الإسلامي والعربي والحضارات القديمة',
            'icon': 'fas fa-landmark',
            'color': 'warning'
        }
    ]
    
    categories = []
    for cat_data in categories_data:
        category = Category(**cat_data)
        db.session.add(category)
        categories.append(category)
    
    db.session.commit()
    return categories

def create_users():
    """Create sample users"""
    users_data = [
        {'username': 'admin', 'email': 'admin@library.com'},
        {'username': 'محمد_أحمد', 'email': 'mohamed@example.com'},
        {'username': 'فاطمة_علي', 'email': 'fatima@example.com'},
        {'username': 'عبدالله_محمود', 'email': 'abdullah@example.com'},
        {'username': 'سارة_حسن', 'email': 'sara@example.com'},
        {'username': 'يوسف_الأحمد', 'email': 'youssef@example.com'},
        {'username': 'نورا_سالم', 'email': 'nora@example.com'},
        {'username': 'خالد_عمر', 'email': 'khaled@example.com'},
        {'username': 'ليلى_حسن', 'email': 'layla@example.com'},
        {'username': 'مريم_عبدالله', 'email': 'mariam@example.com'}
    ]
    
    users = []
    for user_data in users_data:
        user = User(**user_data)
        db.session.add(user)
        users.append(user)
    
    db.session.commit()
    return users

def create_books(categories):
    """Create sample books"""
    books_data = [
        {
            'title': 'كتاب البرمجة الحديثة',
            'author': 'أحمد محمد',
            'description': 'دليل شامل لتعلم البرمجة من الصفر حتى الاحتراف. يغطي الكتاب أساسيات البرمجة ولغات البرمجة المختلفة مع أمثلة عملية وتطبيقات حقيقية.',
            'category_id': 1,
            'isbn': '978-1234567890',
            'pages': 350,
            'language': 'العربية',
            'publish_date': date(2024, 1, 15),
            'rating': 4.8,
            'download_count': 15420
        },
        {
            'title': 'أساسيات التصميم الجرافيكي',
            'author': 'فاطمة علي',
            'description': 'تعلم مبادئ التصميم الجرافيكي والتصميم الرقمي. يشمل الكتاب نظرية الألوان، التايبوغرافي، والتكوين البصري مع أمثلة عملية.',
            'category_id': 6,
            'isbn': '978-1234567891',
            'pages': 280,
            'language': 'العربية',
            'publish_date': date(2024, 2, 10),
            'rating': 4.6,
            'download_count': 12350
        },
        {
            'title': 'إدارة الأعمال الحديثة',
            'author': 'محمد حسن',
            'description': 'استراتيجيات النجاح في الأعمال والإدارة الحديثة. يغطي الكتاب مواضيع القيادة، التخطيط الاستراتيجي، وإدارة الفرق.',
            'category_id': 2,
            'isbn': '978-1234567892',
            'pages': 420,
            'language': 'العربية',
            'publish_date': date(2024, 1, 28),
            'rating': 4.7,
            'download_count': 18750
        },
        {
            'title': 'علم النفس التطبيقي',
            'author': 'سارة أحمد',
            'description': 'فهم السلوك الإنساني والنفسي من منظور علمي حديث. يتناول الكتاب علم النفس التطبيقي والعلاج النفسي.',
            'category_id': 3,
            'isbn': '978-1234567893',
            'pages': 390,
            'language': 'العربية',
            'publish_date': date(2024, 3, 5),
            'rating': 4.9,
            'download_count': 21300
        },
        {
            'title': 'الفيزياء الحديثة',
            'author': 'عبدالله محمود',
            'description': 'مقدمة في الفيزياء الحديثة والكمية. يشرح الكتاب المفاهيم الأساسية للفيزياء النووية والذرية.',
            'category_id': 4,
            'isbn': '978-1234567894',
            'pages': 450,
            'language': 'العربية',
            'publish_date': date(2024, 2, 20),
            'rating': 4.5,
            'download_count': 9800
        },
        {
            'title': 'الأدب العربي المعاصر',
            'author': 'نورا سالم',
            'description': 'رحلة في الأدب العربي الحديث والمعاصر. يستعرض الكتاب أهم الأعمال الأدبية والكتاب المعاصرين.',
            'category_id': 5,
            'isbn': '978-1234567895',
            'pages': 320,
            'language': 'العربية',
            'publish_date': date(2024, 3, 12),
            'rating': 4.4,
            'download_count': 7650
        },
        {
            'title': 'تطوير تطبيقات الويب',
            'author': 'خالد عمر',
            'description': 'تعلم تطوير تطبيقات الويب الحديثة باستخدام أحدث التقنيات والأدوات. يشمل HTML5، CSS3، JavaScript، وأطر العمل الحديثة.',
            'category_id': 1,
            'isbn': '978-1234567896',
            'pages': 380,
            'language': 'العربية',
            'publish_date': date(2024, 2, 28),
            'rating': 4.7,
            'download_count': 13200
        },
        {
            'title': 'التصميم الداخلي والديكور',
            'author': 'ليلى حسن',
            'description': 'أساسيات التصميم الداخلي والديكور. يتناول الكتاب مبادئ التصميم، اختيار الألوان، والأثاث.',
            'category_id': 6,
            'isbn': '978-1234567897',
            'pages': 290,
            'language': 'العربية',
            'publish_date': date(2024, 3, 8),
            'rating': 4.3,
            'download_count': 8900
        },
        {
            'title': 'ريادة الأعمال والابتكار',
            'author': 'يوسف الأحمد',
            'description': 'دليل شامل لبدء مشروعك الخاص وتطوير الأفكار الإبداعية. يغطي جميع جوانب ريادة الأعمال من الفكرة إلى التنفيذ.',
            'category_id': 2,
            'isbn': '978-1234567898',
            'pages': 360,
            'language': 'العربية',
            'publish_date': date(2024, 1, 22),
            'rating': 4.6,
            'download_count': 16400
        },
        {
            'title': 'علم النفس الاجتماعي',
            'author': 'مريم عبدالله',
            'description': 'دراسة السلوك الإنساني في المجتمع والتفاعلات الاجتماعية. يتناول الكتاب نظريات علم النفس الاجتماعي وتطبيقاتها.',
            'category_id': 3,
            'isbn': '978-1234567899',
            'pages': 340,
            'language': 'العربية',
            'publish_date': date(2024, 2, 15),
            'rating': 4.5,
            'download_count': 11200
        },
        {
            'title': 'الكيمياء العضوية المتقدمة',
            'author': 'حسام الدين',
            'description': 'مبادئ الكيمياء العضوية والتطبيقات الصناعية. يشرح الكتاب التفاعلات الكيميائية والمركبات العضوية.',
            'category_id': 4,
            'isbn': '978-1234567800',
            'pages': 410,
            'language': 'العربية',
            'publish_date': date(2024, 3, 1),
            'rating': 4.2,
            'download_count': 6800
        },
        {
            'title': 'الشعر العربي الكلاسيكي',
            'author': 'عائشة محمد',
            'description': 'دراسة في الشعر العربي القديم وأشهر الشعراء. يتناول الكتاب العصور الأدبية المختلفة وخصائص كل عصر.',
            'category_id': 5,
            'isbn': '978-1234567801',
            'pages': 300,
            'language': 'العربية',
            'publish_date': date(2024, 3, 15),
            'rating': 4.1,
            'download_count': 5400
        },
        {
            'title': 'أساسيات الطب الباطني',
            'author': 'د. أحمد الطبيب',
            'description': 'مرجع شامل في الطب الباطني والتشخيص السريري. يغطي أهم الأمراض الباطنية وطرق علاجها.',
            'category_id': 7,
            'isbn': '978-1234567802',
            'pages': 520,
            'language': 'العربية',
            'publish_date': date(2024, 1, 10),
            'rating': 4.8,
            'download_count': 19500
        },
        {
            'title': 'الهندسة المدنية الحديثة',
            'author': 'م. محمد المهندس',
            'description': 'أسس الهندسة المدنية والإنشاءات الحديثة. يتناول التصميم الإنشائي والمواد الحديثة.',
            'category_id': 8,
            'isbn': '978-1234567803',
            'pages': 480,
            'language': 'العربية',
            'publish_date': date(2024, 2, 5),
            'rating': 4.6,
            'download_count': 14200
        },
        {
            'title': 'طرق التدريس الحديثة',
            'author': 'د. فاطمة المعلمة',
            'description': 'استراتيجيات التعليم والتعلم الحديثة. يشرح الكتاب أحدث طرق التدريس والتقنيات التعليمية.',
            'category_id': 9,
            'isbn': '978-1234567804',
            'pages': 350,
            'language': 'العربية',
            'publish_date': date(2024, 1, 30),
            'rating': 4.4,
            'download_count': 10800
        },
        {
            'title': 'التاريخ الإسلامي المبكر',
            'author': 'د. عبدالرحمن المؤرخ',
            'description': 'دراسة شاملة للتاريخ الإسلامي من البعثة النبوية حتى نهاية الخلافة الراشدة.',
            'category_id': 10,
            'isbn': '978-1234567805',
            'pages': 420,
            'language': 'العربية',
            'publish_date': date(2024, 2, 12),
            'rating': 4.7,
            'download_count': 13800
        }
    ]
    
    books = []
    for book_data in books_data:
        book = Book(**book_data)
        db.session.add(book)
        books.append(book)
    
    db.session.commit()
    return books

def create_reviews(users, books):
    """Create sample book reviews"""
    import random
    
    reviews_data = []
    
    # Create random reviews
    for _ in range(50):
        user = random.choice(users[1:])  # Skip admin user
        book = random.choice(books)
        
        # Check if user already reviewed this book
        existing = any(r['user_id'] == user.id and r['book_id'] == book.id for r in reviews_data)
        if existing:
            continue
        
        rating = random.choice([3, 4, 4, 4, 5, 5, 5])  # Bias towards higher ratings
        comments = [
            'كتاب ممتاز ومفيد جداً',
            'استفدت كثيراً من هذا الكتاب',
            'محتوى رائع وأسلوب واضح',
            'كتاب شامل ومرجع مهم',
            'أنصح بقراءة هذا الكتاب',
            'معلومات قيمة ومفيدة',
            'كتاب جيد لكن يحتاج تحديث',
            'مرجع ممتاز في هذا المجال'
        ]
        
        review_data = {
            'book_id': book.id,
            'user_id': user.id,
            'rating': rating,
            'comment': random.choice(comments)
        }
        
        reviews_data.append(review_data)
    
    reviews = []
    for review_data in reviews_data:
        review = BookReview(**review_data)
        db.session.add(review)
        reviews.append(review)
    
    db.session.commit()
    
    # Update book ratings based on reviews
    for book in books:
        book_reviews = [r for r in reviews if r.book_id == book.id]
        if book_reviews:
            avg_rating = sum(r.rating for r in book_reviews) / len(book_reviews)
            book.rating = round(avg_rating, 1)
    
    db.session.commit()
    return reviews

def create_favorites(users, books):
    """Create sample user favorites"""
    import random
    
    favorites = []
    
    for user in users[1:]:  # Skip admin user
        # Each user has 3-8 favorite books
        num_favorites = random.randint(3, 8)
        user_books = random.sample(books, num_favorites)
        
        for book in user_books:
            favorite = UserFavorite(user_id=user.id, book_id=book.id)
            db.session.add(favorite)
            favorites.append(favorite)
    
    db.session.commit()
    return favorites

def create_contact_messages():
    """Create sample contact messages"""
    messages_data = [
        {
            'first_name': 'أحمد',
            'last_name': 'محمد',
            'email': 'ahmed@example.com',
            'phone': '+967771234567',
            'subject': 'استفسار عام',
            'message': 'أريد معرفة المزيد عن خدمات المكتبة الإلكترونية',
            'status': 'new'
        },
        {
            'first_name': 'فاطمة',
            'last_name': 'علي',
            'email': 'fatima@example.com',
            'phone': '+967772345678',
            'subject': 'طلب كتاب',
            'message': 'هل يمكنكم إضافة كتب في مجال الذكاء الاصطناعي؟',
            'status': 'read'
        },
        {
            'first_name': 'محمد',
            'last_name': 'حسن',
            'email': 'mohamed@example.com',
            'subject': 'مشكلة تقنية',
            'message': 'أواجه مشكلة في تحميل الكتب من الموقع',
            'status': 'replied'
        },
        {
            'first_name': 'سارة',
            'last_name': 'أحمد',
            'email': 'sara@example.com',
            'phone': '+967773456789',
            'subject': 'اقتراح',
            'message': 'اقترح إضافة ميزة القراءة الصوتية للكتب',
            'status': 'closed'
        }
    ]
    
    messages = []
    for msg_data in messages_data:
        message = ContactMessage(**msg_data)
        db.session.add(message)
        messages.append(message)
    
    db.session.commit()
    return messages

def create_newsletter_subscriptions():
    """Create sample newsletter subscriptions"""
    emails = [
        'subscriber1@example.com',
        'subscriber2@example.com',
        'subscriber3@example.com',
        'subscriber4@example.com',
        'subscriber5@example.com',
        'reader@example.com',
        'student@example.com',
        'teacher@example.com',
        'researcher@example.com',
        'librarian@example.com'
    ]
    
    subscriptions = []
    for email in emails:
        subscription = NewsletterSubscription(email=email)
        db.session.add(subscription)
        subscriptions.append(subscription)
    
    db.session.commit()
    return subscriptions

def seed_database():
    """Main function to seed the database with sample data"""
    print("🌱 Starting database seeding...")
    
    # Create all tables
    db.create_all()
    
    # Check if data already exists
    if Category.query.count() > 0:
        print("⚠️  Database already contains data. Skipping seeding.")
        return
    
    print("📚 Creating categories...")
    categories = create_categories()
    print(f"✅ Created {len(categories)} categories")
    
    print("👥 Creating users...")
    users = create_users()
    print(f"✅ Created {len(users)} users")
    
    print("📖 Creating books...")
    books = create_books(categories)
    print(f"✅ Created {len(books)} books")
    
    print("⭐ Creating reviews...")
    reviews = create_reviews(users, books)
    print(f"✅ Created {len(reviews)} reviews")
    
    print("❤️  Creating favorites...")
    favorites = create_favorites(users, books)
    print(f"✅ Created {len(favorites)} favorites")
    
    print("📧 Creating contact messages...")
    messages = create_contact_messages()
    print(f"✅ Created {len(messages)} contact messages")
    
    print("📰 Creating newsletter subscriptions...")
    subscriptions = create_newsletter_subscriptions()
    print(f"✅ Created {len(subscriptions)} newsletter subscriptions")
    
    print("🎉 Database seeding completed successfully!")
    print("\n📊 Summary:")
    print(f"   Categories: {Category.query.count()}")
    print(f"   Users: {User.query.count()}")
    print(f"   Books: {Book.query.count()}")
    print(f"   Reviews: {BookReview.query.count()}")
    print(f"   Favorites: {UserFavorite.query.count()}")
    print(f"   Contact Messages: {ContactMessage.query.count()}")
    print(f"   Newsletter Subscriptions: {NewsletterSubscription.query.count()}")

if __name__ == '__main__':
    with app.app_context():
        seed_database()

