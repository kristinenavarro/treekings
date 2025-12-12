import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // Initial student data
  const initialStudents = [
    { id: 1, name: "Tin Dela Cruz", course: "STEM Strand", status: "Active" },
    { id: 2, name: "Josh Lim", course: "BS Information Technology", status: "Active" },
    { id: 3, name: "Ava Ramos", course: "ABM Strand", status: "On Leave" },
    { id: 4, name: "Mika Rivera", course: "BS Accountancy", status: "Active" }
  ];

  // Initial book data
  const initialBooks = [
    { id: 1, isbn: "978-1-60309-452-8", title: "Belzebubs", author: "JP Ahonen", status: "Available" },
    { id: 2, isbn: "978-0-545-01022-1", title: "Harry Potter and the Deathly Hallows", author: "J.K. Rowling", status: "Borrowed" },
    { id: 3, isbn: "978-0-06-231500-7", title: "The Alchemist", author: "Paulo Coelho", status: "Available" }
  ];

  // State management
  const [students, setStudents] = useState(initialStudents);
  const [books, setBooks] = useState(initialBooks);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Student form state
  const [studentForm, setStudentForm] = useState({
    name: '',
    course: '',
    status: 'Active'
  });

  // Book form state
  const [bookForm, setBookForm] = useState({
    isbn: '',
    title: '',
    author: '',
    status: 'Available'
  });

  // Statistics
  const totalStudents = students.length;
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.status === 'Available').length;
  const activeStudents = students.filter(student => student.status === 'Active').length;

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
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    
    const { name, course, status } = studentForm;
    
    if (!name || !course) {
      showNotification("Please fill out both name and course fields.", 'danger');
      return;
    }

    if (editingStudent) {
      // Update existing student
      const updatedStudents = students.map(student => 
        student.id === editingStudent.id ? { ...student, ...studentForm } : student
      );
      setStudents(updatedStudents);
      showNotification(`${name}'s information has been updated.`, 'success');
    } else {
      // Add new student
      const newStudent = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        ...studentForm
      };
      setStudents([newStudent, ...students]);
      showNotification(`${name} has been added to the directory.`, 'success');
    }

    resetStudentForm();
  };

  // Submit book form
  const handleBookSubmit = (e) => {
    e.preventDefault();
    
    const { isbn, title, author, status } = bookForm;
    
    if (!isbn || !title || !author) {
      showNotification("Please fill out all fields: ISBN, title, and author.", 'danger');
      return;
    }

    if (editingBook) {
      // Update existing book
      const updatedBooks = books.map(book => 
        book.id === editingBook.id ? { ...book, ...bookForm } : book
      );
      setBooks(updatedBooks);
      showNotification(`"${title}" has been updated.`, 'success');
    } else {
      // Add new book
      const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        ...bookForm
      };
      setBooks([newBook, ...books]);
      showNotification(`"${title}" has been added to the library.`, 'success');
    }

    resetBookForm();
  };

  // Start editing a student
  const startStudentEdit = (student) => {
    setStudentForm({
      name: student.name,
      course: student.course,
      status: student.status
    });
    setEditingStudent(student);
    
    // Scroll to student form
    document.querySelector('.student-section').scrollIntoView({ behavior: 'smooth' });
  };

  // Start editing a book
  const startBookEdit = (book) => {
    setBookForm({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      status: book.status
    });
    setEditingBook(book);
    
    // Scroll to book form
    document.querySelector('.book-section').scrollIntoView({ behavior: 'smooth' });
  };

  // Delete a student
  const deleteStudent = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    if (!window.confirm(`Are you sure you want to delete "${student.name}" from the directory?`)) return;
    
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    resetStudentForm();
    showNotification(`${student.name} has been removed from the directory.`, 'info');
  };

  // Delete a book
  const deleteBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    if (!window.confirm(`Are you sure you want to delete "${book.title}" from the library?`)) return;
    
    const updatedBooks = books.filter(b => b.id !== bookId);
    setBooks(updatedBooks);
    resetBookForm();
    showNotification(`"${book.title}" has been removed from the library.`, 'info');
  };

  // Reset student form
  const resetStudentForm = () => {
    setStudentForm({
      name: '',
      course: '',
      status: 'Active'
    });
    setEditingStudent(null);
  };

  // Reset book form
  const resetBookForm = () => {
    setBookForm({
      isbn: '',
      title: '',
      author: '',
      status: 'Available'
    });
    setEditingBook(null);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Active':
      case 'Available':
        return 'status-active';
      case 'On Leave':
        return 'status-leave';
      case 'Inactive':
        return 'status-inactive';
      case 'Borrowed':
        return 'status-borrowed';
      default:
        return '';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active':
      case 'Available':
        return 'fas fa-check-circle';
      case 'On Leave':
        return 'fas fa-clock';
      case 'Inactive':
        return 'fas fa-times-circle';
      case 'Borrowed':
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
                  onKeyPress={(e) => e.key === 'Enter' && handleStudentSubmit(e)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="studentCourse">
                  <i className="fas fa-graduation-cap"></i> Course
                </label>
                <input
                  type="text"
                  id="studentCourse"
                  name="course"
                  className="form-control"
                  placeholder="Course"
                  value={studentForm.course}
                  onChange={handleStudentFormChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleStudentSubmit(e)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="studentStatus">
                  <i className="fas fa-circle"></i> Status
                </label>
                <select
                  id="studentStatus"
                  name="status"
                  className="form-control"
                  value={studentForm.status}
                  onChange={handleStudentFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
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
                  <th style={{ width: '35%' }}>
                    <i className="fas fa-user"></i> Name
                  </th>
                  <th style={{ width: '30%' }}>
                    <i className="fas fa-graduation-cap"></i> Course
                  </th>
                  <th style={{ width: '15%' }}>
                    <i className="fas fa-circle"></i> Status
                  </th>
                  <th style={{ width: '20%' }}>
                    <i className="fas fa-cog"></i> Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <i className="fas fa-users"></i>
                      <h3>No Students Found</h3>
                      <p>Add your first student above.</p>
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id}>
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
                          <i className="fas fa-graduation-cap"></i>
                          {student.course}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(student.status)}`}>
                          <i className={getStatusIcon(student.status)}></i>
                          {student.status}
                        </span>
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
                            onClick={() => deleteStudent(student.id)}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleBookSubmit(e)}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleBookSubmit(e)}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleBookSubmit(e)}
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
                  <option value="Available">Available</option>
                  <option value="Borrowed">Borrowed</option>
                </select>
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
                    <tr key={book.id}>
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
                            onClick={() => deleteBook(book.id)}
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