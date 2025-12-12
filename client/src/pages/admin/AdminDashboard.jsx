import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

 useEffect(() => {
  const fetchData = async () => {
    try {
      const studentRes = await fetch("http://localhost:5000/api/students");
      const bookRes = await fetch("http://localhost:5000/api/books");

      const studentData = await studentRes.json();
      const bookData = await bookRes.json();

      // Ensure we set arrays, fallback to empty array if response is unexpected
      setStudents(Array.isArray(studentData.data) ? studentData.data : []);
      setBooks(Array.isArray(bookData.data) ? bookData.data : []);

    } catch (error) {
      console.error("Error fetching admin data:", error);
      // fallback empty arrays
      setStudents([]);
      setBooks([]);
    }
  };

  fetchData();
}, []);


  // Student form state
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    yearLevel: ''
  });

// Book form state
const [bookForm, setBookForm] = useState({
  isbn: '',
  title: '',
  author: '',
  status: 'available',
  category: 'all',
  genre: '',
  rating: '',
  description: '',
  copies: '1',
  imageUrl: ''
});

  // Statistics
const totalStudents = students.length;
const totalBooks = books.length;
const availableBooks = books.filter(book => book.status === 'available').length; // Changed from 'Available'
const activeStudents = students.length;

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle student form change
  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle book form change
  const handleBookFormChange = (e) => {
    const { name, value } = e.target;
    setBookForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit student form
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    
    const { name, email, password, studentId, department, yearLevel } = studentForm;
    
    if (editingStudent) {
      // For editing, don't require password (only update if provided)
      if (!name || !email || !studentId || !department || !yearLevel) {
        showNotification("Please fill out all fields except password (optional for updates).", 'danger');
        return;
      }
    } else {
      // For new student, require all fields including password
      if (!name || !email || !password || !studentId || !department || !yearLevel) {
        showNotification("Please fill out all fields including password.", 'danger');
        return;
      }
    }

    try {
      if (editingStudent) {
        // Update existing student via API
        // Only include password if it was changed
        const updateData = { name, email, studentId, department, yearLevel };
        if (password) {
          updateData.password = password;
        }

        const response = await fetch(`http://localhost:5000/api/students/${editingStudent._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        const result = await response.json();

        if (result.success) {
          // Update local state with the updated student
          const updatedStudents = students.map(student => 
            student._id === editingStudent._id ? result.data : student
          );
          setStudents(updatedStudents);
          showNotification(`${name}'s information has been updated.`, 'success');
        } else {
          showNotification(result.message || 'Failed to update student.', 'danger');
        }
      } else {
        // Add new student via API
        const response = await fetch('http://localhost:5000/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            studentId,
            department,
            yearLevel,
            role: 'student'
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStudents([result.data, ...students]);
          showNotification(`${name} has been added to the directory.`, 'success');
        } else {
          showNotification(result.message || 'Failed to add student.', 'danger');
        }
      }

      resetStudentForm();
    } catch (error) {
      console.error('Error submitting student:', error);
      showNotification('An error occurred. Please try again.', 'danger');
    }
  };

// Submit book form
const handleBookSubmit = async (e) => {
  e.preventDefault();
  
  const { isbn, title, author, status, category, genre, rating, description, copies, imageUrl } = bookForm;
  
  if (!title || !author) {
    showNotification("Please fill out title and author fields.", 'danger');
    return;
  }

  try {
if (editingBook) {
      // Update existing book via API
      // Calculate availableCopies based on the difference
      const oldCopies = editingBook.copies || 1;
      const oldAvailable = editingBook.availableCopies !== undefined ? editingBook.availableCopies : oldCopies;
      const newCopies = parseInt(copies) || 1;
      
      // Calculate how many are currently borrowed
      const borrowed = oldCopies - oldAvailable;
      
      // New available copies = new total copies - borrowed copies
      const newAvailableCopies = Math.max(0, newCopies - borrowed);
      
      const response = await fetch(`http://localhost:5000/api/books/${editingBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isbn,
          title,
          author,
          status,
          category,
          genre,
          rating: parseFloat(rating) || 0,
          description,
          copies: newCopies,
          availableCopies: newAvailableCopies,
          imageUrl
        }),
      });

      const result = await response.json();

      if (result.success) {
        const updatedBooks = books.map(book => 
          book._id === editingBook._id ? result.data : book
        );
        setBooks(updatedBooks);
        showNotification(`"${title}" has been updated.`, 'success');
        resetBookForm();
      } else {
        showNotification(result.message || 'Failed to update book.', 'danger');
      }
    } else {
      // Add new book via API
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isbn,
          title,
          author,
          status,
          category,
          genre,
          rating: parseFloat(rating) || 0,
          description,
          copies: parseInt(copies) || 1,
          availableCopies: parseInt(copies) || 1,
          imageUrl
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBooks([result.data, ...books]);
        showNotification(`"${title}" has been added to the library.`, 'success');
        resetBookForm();
      } else {
        showNotification(result.message || 'Failed to add book.', 'danger');
      }
    }

  } catch (error) {
    console.error('Error submitting book:', error);
    showNotification('An error occurred. Please try again.', 'danger');
  }
};
  // Start editing a student
  const startStudentEdit = (student) => {
    setStudentForm({
      name: student.name,
      email: student.email,
      password: '', // Leave password empty for editing
      studentId: student.studentId,
      department: student.department,
      yearLevel: student.yearLevel
    });
    setEditingStudent(student);
    
    // Scroll to student form
    document.querySelector('.student-section').scrollIntoView({ behavior: 'smooth' });
  };

  // Start editing a book
const startBookEdit = (book) => {
  setBookForm({
    isbn: book.isbn || '',
    title: book.title || '',
    author: book.author || '',
    status: book.status || 'available',
    category: book.category || 'all',
    genre: book.genre || '',
    rating: book.rating || '',
    description: book.description || '',
    copies: book.copies || '1',
    imageUrl: book.imageUrl || ''
  });
  setEditingBook(book);
  
  // Scroll to book form
  document.querySelector('.book-section').scrollIntoView({ behavior: 'smooth' });
};

  // Delete a student
  const deleteStudent = async (studentId) => {
    const student = students.find(s => s._id === studentId);
    if (!student) return;
    
    if (!window.confirm(`Are you sure you want to delete "${student.name}" from the directory?`)) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        const updatedStudents = students.filter(s => s._id !== studentId);
        setStudents(updatedStudents);
        resetStudentForm();
        showNotification(`${student.name} has been removed from the directory.`, 'info');
      } else {
        showNotification(result.message || 'Failed to delete student.', 'danger');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      showNotification('An error occurred while deleting the student.', 'danger');
    }
  };

// Delete a book
const deleteBook = async (bookId) => {
  const book = books.find(b => b._id === bookId);
  if (!book) return;
  
  if (!window.confirm(`Are you sure you want to delete "${book.title}" from the library?`)) return;
  
  try {
    const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      const updatedBooks = books.filter(b => b._id !== bookId);
      setBooks(updatedBooks);
      resetBookForm();
      showNotification(`"${book.title}" has been removed from the library.`, 'info');
    } else {
      showNotification(result.message || 'Failed to delete book.', 'danger');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    showNotification('An error occurred while deleting the book.', 'danger');
  }
};

  // Reset student form
  const resetStudentForm = () => {
    setStudentForm({
      name: '',
      email: '',
      password: '',
      studentId: '',
      department: '',
      yearLevel: ''
    });
    setEditingStudent(null);
  };

// Reset book form
const resetBookForm = () => {
  setBookForm({
    isbn: '',
    title: '',
    author: '',
    status: 'available',
    category: 'all',
    genre: '',
    rating: '',
    description: '',
    copies: '1',
    imageUrl: ''
  });
  setEditingBook(null);
};

  // Get status badge class
const getStatusBadgeClass = (status) => {
  // Convert to lowercase for comparison
  const statusLower = status?.toLowerCase();
  switch(statusLower) {
    case 'active':
    case 'available':
      return 'status-active';
    case 'on leave':
      return 'status-leave';
    case 'inactive':
      return 'status-inactive';
    case 'borrowed':
      return 'status-borrowed';
    default:
      return '';
  }
};

  // Get status icon
const getStatusIcon = (status) => {
  // Convert to lowercase for comparison
  const statusLower = status?.toLowerCase();
  switch(statusLower) {
    case 'active':
    case 'available':
      return 'fas fa-check-circle';
    case 'on leave':
      return 'fas fa-clock';
    case 'inactive':
      return 'fas fa-times-circle';
    case 'borrowed':
      return 'fas fa-book-reader';
    default:
      return 'fas fa-circle';
  }
};

  return (
    <div className="admin-dashboard">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={notification.type === 'success' ? 'fas fa-check-circle' : 
                       notification.type === 'danger' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle'}></i>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header>
        <div className="header-content">
          <i className="fas fa-user-shield"></i>
          <h1>Admin Dashboard</h1>
        </div>
        <a href="/" className="logout-link">
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </header>

      {/* Main Content */}
      <main>
        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <div className="stat-card-content">
              <h3>{totalStudents}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-book"></i>
            <div className="stat-card-content">
              <h3>{totalBooks}</h3>
              <p>Total Books</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-check-circle"></i>
            <div className="stat-card-content">
              <h3>{availableBooks}</h3>
              <p>Books Available</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-user-check"></i>
            <div className="stat-card-content">
              <h3>{activeStudents}</h3>
              <p>Active Students</p>
            </div>
          </div>
        </div>

        {/* Student Directory Section */}
        <section className="section student-section">
          <div className="section-header">
            <i className="fas fa-users"></i>
            <h2>Student Directory</h2>
          </div>
          <p className="section-description">
            Manage student roster: add new students, update information, or remove records.
          </p>

          <form onSubmit={handleStudentSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="studentName">
                  <i className="fas fa-user"></i> Name
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="name"
                  className="form-control"
                  placeholder="Student name"
                  value={studentForm.name}
                  onChange={handleStudentFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="studentEmail">
                  <i className="fas fa-envelope"></i> Email
                </label>
                <input
                  type="email"
                  id="studentEmail"
                  name="email"
                  className="form-control"
                  placeholder="student@example.com"
                  value={studentForm.email}
                  onChange={handleStudentFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="studentPassword">
                  <i className="fas fa-lock"></i> Password {editingStudent && <span style={{fontSize: '0.85em', color: '#666'}}>(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  id="studentPassword"
                  name="password"
                  className="form-control"
                  placeholder={editingStudent ? "Enter new password (optional)" : "Password"}
                  value={studentForm.password}
                  onChange={handleStudentFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="studentId">
                  <i className="fas fa-id-card"></i> Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  className="form-control"
                  placeholder="e.g. 2024-001"
                  value={studentForm.studentId}
                  onChange={handleStudentFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="studentDepartment">
                  <i className="fas fa-building"></i> Department
                </label>
                <input
                  type="text"
                  id="studentDepartment"
                  name="department"
                  className="form-control"
                  placeholder="Department"
                  value={studentForm.department}
                  onChange={handleStudentFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="studentYearLevel">
                  <i className="fas fa-graduation-cap"></i> Year Level
                </label>
                <select
                  id="studentYearLevel"
                  name="yearLevel"
                  className="form-control"
                  value={studentForm.yearLevel}
                  onChange={handleStudentFormChange}
                >
                  <option value="">Select Year Level</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <i className={editingStudent ? "fas fa-save" : "fas fa-plus"}></i>
                <span>{editingStudent ? 'Save Changes' : 'Add Student'}</span>
              </button>
              {editingStudent && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={resetStudentForm}
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>
                    <i className="fas fa-user"></i> Name
                  </th>
                  <th style={{ width: '20%' }}>
                    <i className="fas fa-envelope"></i> Email
                  </th>
                  <th style={{ width: '15%' }}>
                    <i className="fas fa-id-card"></i> Student ID
                  </th>
                  <th style={{ width: '15%' }}>
                    <i className="fas fa-building"></i> Department
                  </th>
                  <th style={{ width: '10%' }}>
                    <i className="fas fa-graduation-cap"></i> Year
                  </th>
                  <th style={{ width: '20%' }}>
                    <i className="fas fa-cog"></i> Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <i className="fas fa-users"></i>
                      <h3>No Students Found</h3>
                      <p>Add your first student above.</p>
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr key={student._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <div className="user-name">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="course-info">
                          <i className="fas fa-envelope"></i>
                          {student.email}
                        </div>
                      </td>
                      <td>
                        <div className="isbn-info">
                          <i className="fas fa-id-card"></i>
                          {student.studentId}
                        </div>
                      </td>
                      <td>
                        <div className="course-info">
                          <i className="fas fa-building"></i>
                          {student.department}
                        </div>
                      </td>
                      <td>
                        <div className="isbn-info">
                          <i className="fas fa-graduation-cap"></i>
                          Year {student.yearLevel}
                        </div>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn edit"
                            onClick={() => startStudentEdit(student)}
                          >
                            <i className="fas fa-edit"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteStudent(student._id)}
                          >
                            <i className="fas fa-trash"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Books Section */}
        <section className="section book-section">
          <div className="section-header">
            <i className="fas fa-books"></i>
            <h2>Manage Books</h2>
          </div>
          <p className="section-description">
            Add new titles to the collection, update availability, or remove outdated items.
          </p>

<form onSubmit={handleBookSubmit}>
  <div className="form-grid">
    <div className="form-group">
      <label htmlFor="bookIsbn">
        <i className="fas fa-barcode"></i> ISBN
      </label>
      <input
        type="text"
        id="bookIsbn"
        name="isbn"
        className="form-control"
        placeholder="e.g. 978-0-00-000000-0"
        value={bookForm.isbn}
        onChange={handleBookFormChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="bookTitle">
        <i className="fas fa-book"></i> Title
      </label>
      <input
        type="text"
        id="bookTitle"
        name="title"
        className="form-control"
        placeholder="Book title"
        value={bookForm.title}
        onChange={handleBookFormChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="bookAuthor">
        <i className="fas fa-user-pen"></i> Author
      </label>
      <input
        type="text"
        id="bookAuthor"
        name="author"
        className="form-control"
        placeholder="Author name"
        value={bookForm.author}
        onChange={handleBookFormChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="bookCategory">
        <i className="fas fa-tag"></i> Category
      </label>
      <select
        id="bookCategory"
        name="category"
        className="form-control"
        value={bookForm.category}
        onChange={handleBookFormChange}
      >
        <option value="all">All</option>
        <option value="featured">Featured</option>
        <option value="popular">Popular</option>
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="bookGenre">
        <i className="fas fa-layer-group"></i> Genre
      </label>
      <input
        type="text"
        id="bookGenre"
        name="genre"
        className="form-control"
        placeholder="e.g. Fantasy, Romance, Mystery"
        value={bookForm.genre}
        onChange={handleBookFormChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="bookRating">
        <i className="fas fa-star"></i> Rating
      </label>
      <input
        type="number"
        id="bookRating"
        name="rating"
        className="form-control"
        placeholder="0.0 - 5.0"
        min="0"
        max="5"
        step="0.1"
        value={bookForm.rating}
        onChange={handleBookFormChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="bookCopies">
        <i className="fas fa-copy"></i> Number of Copies
      </label>
      <input
        type="number"
        id="bookCopies"
        name="copies"
        className="form-control"
        placeholder="1"
        min="1"
        value={bookForm.copies}
        onChange={handleBookFormChange}
      />
    </div>
    <div className="form-group">
      <label htmlFor="bookStatus">
        <i className="fas fa-circle"></i> Status
      </label>
      <select
        id="bookStatus"
        name="status"
        className="form-control"
        value={bookForm.status}
        onChange={handleBookFormChange}
      >
        <option value="available">Available</option>
        <option value="borrowed">Borrowed</option>
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="bookImageUrl">
        <i className="fas fa-image"></i> Image URL
      </label>
      <input
        type="text"
        id="bookImageUrl"
        name="imageUrl"
        className="form-control"
        placeholder="https://example.com/image.jpg"
        value={bookForm.imageUrl}
        onChange={handleBookFormChange}
      />
    </div>
    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
      <label htmlFor="bookDescription">
        <i className="fas fa-align-left"></i> Description
      </label>
      <textarea
        id="bookDescription"
        name="description"
        className="form-control"
        placeholder="Book description"
        rows="3"
        value={bookForm.description}
        onChange={handleBookFormChange}
      />
    </div>
  </div>

  <div className="form-actions">
    <button type="submit" className="btn btn-primary">
      <i className={editingBook ? "fas fa-save" : "fas fa-plus"}></i>
      <span>{editingBook ? 'Save Changes' : 'Add Book'}</span>
    </button>
    {editingBook && (
      <button
        type="button"
        className="btn btn-outline"
        onClick={resetBookForm}
      >
        <i className="fas fa-times"></i>
        Cancel
      </button>
    )}
  </div>
</form>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>
                    <i className="fas fa-barcode"></i> ISBN
                  </th>
                  <th style={{ width: '35%' }}>
                    <i className="fas fa-book"></i> Title
                  </th>
                  <th style={{ width: '25%' }}>
                    <i className="fas fa-user-pen"></i> Author
                  </th>
                  <th style={{ width: '10%' }}>
                    <i className="fas fa-circle"></i> Status
                  </th>
                  <th style={{ width: '10%' }}>
                    <i className="fas fa-cog"></i> Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <i className="fas fa-books"></i>
                      <h3>No Books Found</h3>
                      <p>Add your first book above.</p>
                    </td>
                  </tr>
                ) : (
                  books.map(book => (
                    <tr key={book._id}>
                      <td>
                        <div className="isbn-info">
                          <i className="fas fa-barcode"></i>
                          {book.isbn}
                        </div>
                      </td>
                      <td>
                        <div className="book-info">
                          <i className="fas fa-book"></i>
                          {book.title}
                        </div>
                      </td>
                      <td>
                        <div className="author-info">
                          <i className="fas fa-user-pen"></i>
                          {book.author}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(book.status)}`}>
                          <i className={getStatusIcon(book.status)}></i>
                          {book.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn edit"
                            onClick={() => startBookEdit(book)}
                          >
                            <i className="fas fa-edit"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteBook(book._id)}
                          >
                            <i className="fas fa-trash"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;