from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    isbn = db.Column(db.String(20), unique=True)
    pages = db.Column(db.Integer)
    language = db.Column(db.String(50), default='العربية')
    publish_date = db.Column(db.Date)
    rating = db.Column(db.Float, default=0.0)
    download_count = db.Column(db.Integer, default=0)
    file_path = db.Column(db.String(255))
    cover_image = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    category = db.relationship('Category', backref=db.backref('books', lazy=True))
    reviews = db.relationship('BookReview', backref='book', lazy=True, cascade='all, delete-orphan')
    favorites = db.relationship('UserFavorite', backref='book', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Book {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'isbn': self.isbn,
            'pages': self.pages,
            'language': self.language,
            'publish_date': self.publish_date.isoformat() if self.publish_date else None,
            'rating': self.rating,
            'download_count': self.download_count,
            'file_path': self.file_path,
            'cover_image': self.cover_image,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    icon = db.Column(db.String(50))
    color = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Category {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'color': self.color,
            'book_count': len(self.books),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class BookReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('reviews', lazy=True))

    def __repr__(self):
        return f'<BookReview {self.book_id} by {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'user_id': self.user_id,
            'username': self.user.username if self.user else None,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class UserFavorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('favorites', lazy=True))
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('user_id', 'book_id', name='unique_user_book_favorite'),)

    def __repr__(self):
        return f'<UserFavorite {self.user_id} - {self.book_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

