from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.book import Book, Category, BookReview, UserFavorite
from datetime import datetime
import os

book_bp = Blueprint('book', __name__)

# Get all books with pagination and filtering
@book_bp.route('/books', methods=['GET'])
def get_books():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        category_id = request.args.get('category_id', type=int)
        search = request.args.get('search', '')
        sort_by = request.args.get('sort_by', 'created_at')
        order = request.args.get('order', 'desc')
        
        query = Book.query
        
        # Filter by category
        if category_id:
            query = query.filter(Book.category_id == category_id)
        
        # Search filter
        if search:
            query = query.filter(
                db.or_(
                    Book.title.contains(search),
                    Book.author.contains(search),
                    Book.description.contains(search)
                )
            )
        
        # Sorting
        if sort_by == 'title':
            query = query.order_by(Book.title.asc() if order == 'asc' else Book.title.desc())
        elif sort_by == 'author':
            query = query.order_by(Book.author.asc() if order == 'asc' else Book.author.desc())
        elif sort_by == 'rating':
            query = query.order_by(Book.rating.asc() if order == 'asc' else Book.rating.desc())
        elif sort_by == 'download_count':
            query = query.order_by(Book.download_count.asc() if order == 'asc' else Book.download_count.desc())
        else:  # created_at
            query = query.order_by(Book.created_at.asc() if order == 'asc' else Book.created_at.desc())
        
        # Pagination
        books = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'books': [book.to_dict() for book in books.items],
            'pagination': {
                'page': books.page,
                'pages': books.pages,
                'per_page': books.per_page,
                'total': books.total,
                'has_next': books.has_next,
                'has_prev': books.has_prev
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get single book by ID
@book_bp.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    try:
        book = Book.query.get_or_404(book_id)
        return jsonify({
            'success': True,
            'book': book.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get popular books
@book_bp.route('/books/popular', methods=['GET'])
def get_popular_books():
    try:
        limit = request.args.get('limit', 8, type=int)
        books = Book.query.order_by(Book.download_count.desc()).limit(limit).all()
        
        return jsonify({
            'success': True,
            'books': [book.to_dict() for book in books]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get recent books
@book_bp.route('/books/recent', methods=['GET'])
def get_recent_books():
    try:
        limit = request.args.get('limit', 8, type=int)
        books = Book.query.order_by(Book.created_at.desc()).limit(limit).all()
        
        return jsonify({
            'success': True,
            'books': [book.to_dict() for book in books]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Download book (increment download count)
@book_bp.route('/books/<int:book_id>/download', methods=['POST'])
def download_book(book_id):
    try:
        book = Book.query.get_or_404(book_id)
        book.download_count += 1
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Download count updated',
            'download_count': book.download_count
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get all categories
@book_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify({
            'success': True,
            'categories': [category.to_dict() for category in categories]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get single category
@book_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    try:
        category = Category.query.get_or_404(category_id)
        return jsonify({
            'success': True,
            'category': category.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Add book review
@book_bp.route('/books/<int:book_id>/reviews', methods=['POST'])
def add_review(book_id):
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data or 'rating' not in data:
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Check if book exists
        book = Book.query.get_or_404(book_id)
        
        # Check if user exists
        user = User.query.get_or_404(data['user_id'])
        
        # Check if user already reviewed this book
        existing_review = BookReview.query.filter_by(
            book_id=book_id, 
            user_id=data['user_id']
        ).first()
        
        if existing_review:
            return jsonify({'success': False, 'error': 'User already reviewed this book'}), 400
        
        # Create new review
        review = BookReview(
            book_id=book_id,
            user_id=data['user_id'],
            rating=data['rating'],
            comment=data.get('comment', '')
        )
        
        db.session.add(review)
        
        # Update book rating
        all_reviews = BookReview.query.filter_by(book_id=book_id).all()
        if all_reviews:
            avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews)
            book.rating = round(avg_rating, 1)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Review added successfully',
            'review': review.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get book reviews
@book_bp.route('/books/<int:book_id>/reviews', methods=['GET'])
def get_book_reviews(book_id):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        reviews = BookReview.query.filter_by(book_id=book_id).order_by(
            BookReview.created_at.desc()
        ).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'reviews': [review.to_dict() for review in reviews.items],
            'pagination': {
                'page': reviews.page,
                'pages': reviews.pages,
                'per_page': reviews.per_page,
                'total': reviews.total,
                'has_next': reviews.has_next,
                'has_prev': reviews.has_prev
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Add to favorites
@book_bp.route('/books/<int:book_id>/favorite', methods=['POST'])
def add_to_favorites(book_id):
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data:
            return jsonify({'success': False, 'error': 'Missing user_id'}), 400
        
        # Check if book exists
        book = Book.query.get_or_404(book_id)
        
        # Check if user exists
        user = User.query.get_or_404(data['user_id'])
        
        # Check if already in favorites
        existing_favorite = UserFavorite.query.filter_by(
            user_id=data['user_id'],
            book_id=book_id
        ).first()
        
        if existing_favorite:
            return jsonify({'success': False, 'error': 'Book already in favorites'}), 400
        
        # Add to favorites
        favorite = UserFavorite(
            user_id=data['user_id'],
            book_id=book_id
        )
        
        db.session.add(favorite)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Book added to favorites',
            'favorite': favorite.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Remove from favorites
@book_bp.route('/books/<int:book_id>/favorite', methods=['DELETE'])
def remove_from_favorites(book_id):
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data:
            return jsonify({'success': False, 'error': 'Missing user_id'}), 400
        
        favorite = UserFavorite.query.filter_by(
            user_id=data['user_id'],
            book_id=book_id
        ).first()
        
        if not favorite:
            return jsonify({'success': False, 'error': 'Book not in favorites'}), 404
        
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Book removed from favorites'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get user favorites
@book_bp.route('/users/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites(user_id):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        
        favorites = db.session.query(Book).join(UserFavorite).filter(
            UserFavorite.user_id == user_id
        ).order_by(UserFavorite.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'books': [book.to_dict() for book in favorites.items],
            'pagination': {
                'page': favorites.page,
                'pages': favorites.pages,
                'per_page': favorites.per_page,
                'total': favorites.total,
                'has_next': favorites.has_next,
                'has_prev': favorites.has_prev
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Search books
@book_bp.route('/books/search', methods=['GET'])
def search_books():
    try:
        query = request.args.get('q', '')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        
        if not query:
            return jsonify({'success': False, 'error': 'Search query is required'}), 400
        
        books = Book.query.filter(
            db.or_(
                Book.title.contains(query),
                Book.author.contains(query),
                Book.description.contains(query)
            )
        ).order_by(Book.rating.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'query': query,
            'books': [book.to_dict() for book in books.items],
            'pagination': {
                'page': books.page,
                'pages': books.pages,
                'per_page': books.per_page,
                'total': books.total,
                'has_next': books.has_next,
                'has_prev': books.has_prev
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

