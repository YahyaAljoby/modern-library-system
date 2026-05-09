import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('public/uploads')) {
  fs.mkdirSync('public/uploads', { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Initialize SQLite database
const db = new sqlite3.Database('library.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Database initialization
function initializeDatabase() {
  db.serialize(() => {
    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Books table
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT,
        categoryId INTEGER,
        coverImage TEXT,
        fileUrl TEXT,
        language TEXT DEFAULT 'ar',
        pageCount INTEGER,
        downloadCount INTEGER DEFAULT 0,
        rating REAL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )
    `);

    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Downloads table
    db.run(`
      CREATE TABLE IF NOT EXISTS downloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        bookId INTEGER NOT NULL,
        downloadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (bookId) REFERENCES books(id)
      )
    `);

    // Contacts table
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        isRead INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized');
    seedDatabase();
  });
}

// Seed database with sample data
function seedDatabase() {
  db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
    if (row.count === 0) {
      const categories = [
        { name: 'البرمجة', description: 'كتب وموارد عن البرمجة وتطوير البرمجيات', icon: '💻' },
        { name: 'إدارة الأعمال', description: 'كتب عن إدارة الأعمال والتسويق', icon: '📊' },
        { name: 'علم النفس', description: 'كتب عن علم النفس والسلوك الإنساني', icon: '🧠' },
        { name: 'الطب', description: 'كتب طبية ومراجع صحية', icon: '⚕️' },
        { name: 'الأدب', description: 'الروايات والقصص والشعر', icon: '📚' },
        { name: 'التصميم', description: 'كتب عن التصميم الجرافيكي والفني', icon: '🎨' },
        { name: 'الهندسة', description: 'كتب هندسية ومراجع تقنية', icon: '⚙️' },
        { name: 'التعليم', description: 'موارد تعليمية وكتب تربوية', icon: '🎓' }
      ];

      categories.forEach(cat => {
        db.run(
          'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)',
          [cat.name, cat.description, cat.icon],
          (err) => {
            if (!err) console.log(`✅ Added category: ${cat.name}`);
          }
        );
      });

      // Add sample books
      setTimeout(() => {
        const books = [
          {
            title: 'تعلم البرمجة بلغة Python',
            author: 'أحمد محمد',
            description: 'كتاب شامل لتعلم البرمجة بلغة Python من الصفر',
            categoryId: 1,
            pageCount: 350
          },
          {
            title: 'أساسيات إدارة الأعمال',
            author: 'فاطمة علي',
            description: 'مرجع أساسي في مبادئ إدارة الأعمال الحديثة',
            categoryId: 2,
            pageCount: 280
          },
          {
            title: 'علم النفس الإيجابي',
            author: 'محمود حسن',
            description: 'كتاب عن تطبيقات علم النفس الإيجابي في الحياة اليومية',
            categoryId: 3,
            pageCount: 320
          },
          {
            title: 'مقدمة في الطب الحديث',
            author: 'د. سارة أحمد',
            description: 'مرجع طبي شامل عن أحدث التطورات الطبية',
            categoryId: 4,
            pageCount: 450
          },
          {
            title: 'الرواية والفن القصصي',
            author: 'نجيب محفوظ',
            description: 'دراسة أدبية عن فن الرواية والقصة القصيرة',
            categoryId: 5,
            pageCount: 200
          }
        ];

        books.forEach(book => {
          db.run(
            'INSERT INTO books (title, author, description, categoryId, pageCount) VALUES (?, ?, ?, ?, ?)',
            [book.title, book.author, book.description, book.categoryId, book.pageCount],
            (err) => {
              if (!err) console.log(`✅ Added book: ${book.title}`);
            }
          );
        });
      }, 1000);
    }
  });
}

// API Routes

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows || []);
    }
  });
});

// Get all books
app.get('/api/books', (req, res) => {
  const { search, categoryId, language } = req.query;
  let query = 'SELECT * FROM books WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (title LIKE ? OR author LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (categoryId) {
    query += ' AND categoryId = ?';
    params.push(categoryId);
  }

  if (language) {
    query += ' AND language = ?';
    params.push(language);
  }

  query += ' ORDER BY createdAt DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows || []);
    }
  });
});

// Get single book
app.get('/api/books/:id', (req, res) => {
  db.get('SELECT * FROM books WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.json(row);
    }
  });
});

// Add new book (admin only)
app.post('/api/books', upload.fields([{ name: 'cover' }, { name: 'file' }]), (req, res) => {
  const { title, author, description, categoryId, pageCount } = req.body;
  const coverImage = req.files?.cover?.[0]?.filename || null;
  const fileUrl = req.files?.file?.[0]?.filename || null;

  db.run(
    'INSERT INTO books (title, author, description, categoryId, coverImage, fileUrl, pageCount) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, author, description, categoryId, coverImage, fileUrl, pageCount],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, message: 'Book added successfully' });
      }
    }
  );
});

// Update book
app.put('/api/books/:id', (req, res) => {
  const { title, author, description, categoryId, pageCount } = req.body;
  db.run(
    'UPDATE books SET title = ?, author = ?, description = ?, categoryId = ?, pageCount = ? WHERE id = ?',
    [title, author, description, categoryId, pageCount, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Book updated successfully' });
      }
    }
  );
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
  db.run('DELETE FROM books WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Book deleted successfully' });
    }
  });
});

// Record download
app.post('/api/downloads/:bookId', (req, res) => {
  const { userId } = req.body;
  db.run(
    'INSERT INTO downloads (userId, bookId) VALUES (?, ?)',
    [userId || null, req.params.bookId],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        // Increment download count
        db.run('UPDATE books SET downloadCount = downloadCount + 1 WHERE id = ?', [req.params.bookId]);
        res.json({ message: 'Download recorded' });
      }
    }
  );
});

// Submit contact form
app.post('/api/contacts', (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;
  db.run(
    'INSERT INTO contacts (firstName, lastName, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
    [firstName, lastName, email, phone, subject, message],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, message: 'Message sent successfully' });
      }
    }
  );
});

// Get all contacts (admin only)
app.get('/api/contacts', (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows || []);
    }
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  db.all(`
    SELECT 
      (SELECT COUNT(*) FROM books) as totalBooks,
      (SELECT COUNT(*) FROM categories) as totalCategories,
      (SELECT COUNT(*) FROM downloads) as totalDownloads,
      (SELECT COUNT(*) FROM contacts) as totalContacts
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows[0] || {});
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
});
