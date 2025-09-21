from flask import Blueprint, request, jsonify
from src.models.user import db
from datetime import datetime
import re

contact_bp = Blueprint('contact', __name__)

# Contact form model
class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    subject = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='new')  # new, read, replied, closed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<ContactMessage {self.first_name} {self.last_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Newsletter subscription model
class NewsletterSubscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    status = db.Column(db.String(20), default='active')  # active, unsubscribed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<NewsletterSubscription {self.email}>'

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return True  # Phone is optional
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    # Check if it's a valid length (7-15 digits)
    return 7 <= len(digits_only) <= 15

# Submit contact form
@contact_bp.route('/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False, 
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # Validate phone if provided
        if data.get('phone') and not validate_phone(data['phone']):
            return jsonify({
                'success': False,
                'error': 'Invalid phone number format'
            }), 400
        
        # Create contact message
        contact_message = ContactMessage(
            first_name=data['first_name'].strip(),
            last_name=data['last_name'].strip(),
            email=data['email'].strip().lower(),
            phone=data.get('phone', '').strip(),
            subject=data['subject'].strip(),
            message=data['message'].strip()
        )
        
        db.session.add(contact_message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
            'contact_id': contact_message.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Get all contact messages (admin only)
@contact_bp.route('/contact/messages', methods=['GET'])
def get_contact_messages():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        
        query = ContactMessage.query
        
        if status:
            query = query.filter(ContactMessage.status == status)
        
        messages = query.order_by(ContactMessage.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'messages': [message.to_dict() for message in messages.items],
            'pagination': {
                'page': messages.page,
                'pages': messages.pages,
                'per_page': messages.per_page,
                'total': messages.total,
                'has_next': messages.has_next,
                'has_prev': messages.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get single contact message
@contact_bp.route('/contact/messages/<int:message_id>', methods=['GET'])
def get_contact_message(message_id):
    try:
        message = ContactMessage.query.get_or_404(message_id)
        
        # Mark as read if it's new
        if message.status == 'new':
            message.status = 'read'
            db.session.commit()
        
        return jsonify({
            'success': True,
            'message': message.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Update contact message status
@contact_bp.route('/contact/messages/<int:message_id>/status', methods=['PUT'])
def update_message_status(message_id):
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'success': False, 'error': 'Missing status field'}), 400
        
        valid_statuses = ['new', 'read', 'replied', 'closed']
        if data['status'] not in valid_statuses:
            return jsonify({
                'success': False, 
                'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
            }), 400
        
        message = ContactMessage.query.get_or_404(message_id)
        message.status = data['status']
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Status updated successfully',
            'contact_message': message.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Newsletter subscription
@contact_bp.route('/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'success': False, 'error': 'Missing email field'}), 400
        
        email = data['email'].strip().lower()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # Check if already subscribed
        existing_subscription = NewsletterSubscription.query.filter_by(email=email).first()
        
        if existing_subscription:
            if existing_subscription.status == 'active':
                return jsonify({
                    'success': False,
                    'error': 'Email already subscribed to newsletter'
                }), 400
            else:
                # Reactivate subscription
                existing_subscription.status = 'active'
                existing_subscription.updated_at = datetime.utcnow()
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'message': 'تم تفعيل اشتراكك في النشرة الإخبارية مرة أخرى!'
                })
        
        # Create new subscription
        subscription = NewsletterSubscription(email=email)
        db.session.add(subscription)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم الاشتراك بنجاح في النشرة الإخبارية!'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Newsletter unsubscribe
@contact_bp.route('/newsletter/unsubscribe', methods=['POST'])
def unsubscribe_newsletter():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'success': False, 'error': 'Missing email field'}), 400
        
        email = data['email'].strip().lower()
        
        subscription = NewsletterSubscription.query.filter_by(email=email).first()
        
        if not subscription:
            return jsonify({
                'success': False,
                'error': 'Email not found in newsletter subscriptions'
            }), 404
        
        subscription.status = 'unsubscribed'
        subscription.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'تم إلغاء الاشتراك من النشرة الإخبارية بنجاح'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get newsletter subscribers (admin only)
@contact_bp.route('/newsletter/subscribers', methods=['GET'])
def get_newsletter_subscribers():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        status = request.args.get('status', 'active')
        
        subscribers = NewsletterSubscription.query.filter_by(status=status).order_by(
            NewsletterSubscription.created_at.desc()
        ).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'subscribers': [subscriber.to_dict() for subscriber in subscribers.items],
            'pagination': {
                'page': subscribers.page,
                'pages': subscribers.pages,
                'per_page': subscribers.per_page,
                'total': subscribers.total,
                'has_next': subscribers.has_next,
                'has_prev': subscribers.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get contact statistics
@contact_bp.route('/contact/stats', methods=['GET'])
def get_contact_stats():
    try:
        # Contact messages stats
        total_messages = ContactMessage.query.count()
        new_messages = ContactMessage.query.filter_by(status='new').count()
        read_messages = ContactMessage.query.filter_by(status='read').count()
        replied_messages = ContactMessage.query.filter_by(status='replied').count()
        closed_messages = ContactMessage.query.filter_by(status='closed').count()
        
        # Newsletter stats
        total_subscribers = NewsletterSubscription.query.filter_by(status='active').count()
        unsubscribed = NewsletterSubscription.query.filter_by(status='unsubscribed').count()
        
        # Recent messages (last 7 days)
        from datetime import datetime, timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_messages = ContactMessage.query.filter(
            ContactMessage.created_at >= week_ago
        ).count()
        
        return jsonify({
            'success': True,
            'stats': {
                'contact_messages': {
                    'total': total_messages,
                    'new': new_messages,
                    'read': read_messages,
                    'replied': replied_messages,
                    'closed': closed_messages,
                    'recent_week': recent_messages
                },
                'newsletter': {
                    'active_subscribers': total_subscribers,
                    'unsubscribed': unsubscribed,
                    'total_ever': total_subscribers + unsubscribed
                }
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

