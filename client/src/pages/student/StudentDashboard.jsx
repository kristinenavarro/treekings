import React, { useState, useEffect, useRef } from 'react';
import './studentDashboard.css';

// MOCK API IMPLEMENTATION (replaces the missing import)
const bookAPI = {
  getAllBooks: async () => {
    // Mock data
    const mockBooks = [
      {
        _id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic',
        rating: 4.2,
        status: 'available',
        availableCopies: 3,
        category: 'featured'
      },
      {
        _id: '2',
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        rating: 4.8,
        status: 'available',
        availableCopies: 2,
        category: 'popular'
      },
      {
        _id: '3',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        rating: 4.5,
        status: 'borrowed',
        availableCopies: 0,
        category: 'featured',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        borrowedBy: 'student123'
      },
      {
        _id: '4',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        rating: 4.3,
        status: 'available',
        availableCopies: 1,
        category: 'all'
      },
      {
        _id: '5',
        title: '1984',
        author: 'George Orwell',
        genre: 'Fiction',
        rating: 4.6,
        status: 'available',
        availableCopies: 4,
        category: 'popular'
      },
      {
        _id: '6',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        rating: 4.7,
        status: 'available',
        availableCopies: 2,
        category: 'featured'
      },
      {
        _id: '7',
        title: 'Murder on the Orient Express',
        author: 'Agatha Christie',
        genre: 'Mystery',
        rating: 4.4,
        status: 'available',
        availableCopies: 3,
        category: 'popular'
      },
      {
        _id: '8',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Classic',
        rating: 4.0,
        status: 'available',
        availableCopies: 2,
        category: 'all'
      },
      {
        _id: '9',
        title: 'Brave New World',
        author: 'Aldous Huxley',
        genre: 'Fiction',
        rating: 4.1,
        status: 'borrowed',
        availableCopies: 0,
        category: 'all',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        borrowedBy: 'student123'
      },
      {
        _id: '10',
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        rating: 4.9,
        status: 'available',
        availableCopies: 1,
        category: 'popular'
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: mockBooks
    };
  },

  borrowBooks: async (studentId, bookIds) => {
    console.log('Mock API: Borrowing books', { studentId, bookIds });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful response
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    
    return {
      success: true,
      data: {
        studentId,
        borrowedBooks: bookIds,
        dueDate,
        books: bookIds.map(id => ({
          _id: id,
          status: 'borrowed',
          dueDate,
          borrowedBy: studentId,
          availableCopies: 0
        }))
      }
    };
  },

  returnBook: async (bookId, studentId) => {
    console.log('Mock API: Returning book', { bookId, studentId });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      message: 'Book returned successfully'
    };
  }
};

const StudentDashboard = () => {
  // State management
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [addedBooks, setAddedBooks] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [genreFilter, setGenreFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isSortedAZ, setIsSortedAZ] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get student ID from localStorage or context
  const [studentId, setStudentId] = useState(localStorage.getItem('studentId') || 'student123');

  const searchRef = useRef(null);
  const cartRef = useRef(null);

  // Fetch books from API on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to fetch books from backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getAllBooks();
      
      if (response.success) {
        setBooks(response.data);
        setError(null);
      } else {
        throw new Error(response.message || 'Failed to load books');
      }
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query)
    );

    setSearchResults(results);
    setShowSearchResults(true);
  }, [searchQuery, books]);

  // Handle navbar scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target) && !event.target.closest('.cart-icon')) {
        setCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setSuccessMessage(message);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Render stars
  const renderStars = (rating) => {
    let starsHTML = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHTML.push(<i key={i} className="fas fa-star star"></i>);
      } else if (i === fullStars && hasHalfStar) {
        starsHTML.push(<i key={i} className="fas fa-star-half-alt star"></i>);
      } else {
        starsHTML.push(<i key={i} className="far fa-star star empty"></i>);
      }
    }
    return starsHTML;
  };

  // Add book to cart
  const addToCart = (book) => {
    if (book.status === "borrowed") {
      showNotification('This book is currently borrowed!', 'warning');
      return;
    }

    const bookId = book._id || book.id;
    
    if (addedBooks.has(bookId)) {
      showNotification('This book is already in your cart!', 'warning');
      return;
    }

    if (cart.length >= 5) {
      showNotification('Maximum 5 books allowed in cart!', 'warning');
      return;
    }

    setCart(prevCart => [...prevCart, book]);
    setAddedBooks(prev => new Set(prev).add(bookId));
    showNotification(`${book.title} added to borrow cart!`, 'success');
  };

  // Remove book from cart
  const removeFromCart = (bookId) => {
    setCart(prevCart => prevCart.filter(book => (book._id || book.id) !== bookId));
    setAddedBooks(prev => {
      const newSet = new Set(prev);
      newSet.delete(bookId);
      return newSet;
    });
    showNotification('Book removed from cart!', 'info');
  };

  // Return borrowed book
  const returnBook = async (bookId) => {
    try {
      const response = await bookAPI.returnBook(bookId, studentId);
      
      if (response.success) {
        // Update local state
        setBooks(prevBooks => 
          prevBooks.map(book => 
            (book._id || book.id) === bookId 
              ? { 
                  ...book, 
                  status: "available", 
                  dueDate: null, 
                  borrowedBy: null,
                  availableCopies: book.availableCopies + 1 
                } 
              : book
          )
        );
        
        showNotification('Book returned successfully!', 'success');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      showNotification('Failed to return book. Please try again.', 'error');
      console.error('Error returning book:', err);
    }
  };

  // Filter and sort books
  const filteredBooks = books.filter(book => {
    const genreMatch = genreFilter === 'all' || book.genre === genreFilter;
    const ratingMatch = ratingFilter === 'all' || book.rating >= parseFloat(ratingFilter);
    return genreMatch && ratingMatch;
  });

  const sortedBooks = isSortedAZ 
    ? [...filteredBooks].sort((a, b) => a.title.localeCompare(b.title))
    : filteredBooks;

  // Get books by category
  const featuredBooks = sortedBooks.filter(book => book.category === 'featured');
  const popularBooks = sortedBooks.filter(book => book.category === 'popular');
  const allBooks = sortedBooks.filter(book => book.category === 'all');
  
  // Get borrowed books (for "My Borrowed Books" section)
  const borrowedBooks = books.filter(book => book.status === "borrowed");

  // Toggle sort
  const toggleSort = () => {
    setIsSortedAZ(!isSortedAZ);
  };

  // Checkout functions
  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'warning');
      return;
    }
    setCheckoutOpen(true);
  };

  const confirmCheckout = async () => {
    try {
      const bookIds = cart.map(book => book._id || book.id);
      
      // Call API to borrow books
      const response = await bookAPI.borrowBooks(studentId, bookIds);
      
      if (response.success) {
        // Update local state with new book data
        const updatedBooks = response.data.books || [];
        
        setBooks(prevBooks => 
          prevBooks.map(book => {
            const updatedBook = updatedBooks.find(ub => ub._id === (book._id || book.id));
            return updatedBook ? updatedBook : book;
          })
        );
        
        // Close modals
        setCheckoutOpen(false);
        setCartOpen(false);
        
        // Clear cart
        setCart([]);
        setAddedBooks(new Set());
        
        // Show success message
        showNotification(`Successfully borrowed ${cart.length} book(s)!`, 'success');
        
        // Alert with details
        setTimeout(() => {
          const bookTitles = cart.map(book => book.title);
          const dueDate = new Date(response.data.dueDate).toLocaleDateString();
          alert(`Successfully borrowed ${cart.length} book(s)!\n\nBooks:\n${bookTitles.map(title => `- ${title}`).join('\n')}\n\nDue Date: ${dueDate}`);
        }, 500);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      showNotification('Failed to checkout. Please try again.', 'error');
      console.error('Error during checkout:', err);
    }
  };

  // Book card component for available books
  const BookCard = ({ book }) => {
    const isAdded = addedBooks.has(book._id || book.id);
    const isBorrowed = book.status === "borrowed";
    const tagText = book.category === 'featured' ? 'Featured' : 
                    book.category === 'popular' ? 'Popular' : 'New';
    
    // Determine button text and state
    let buttonText = 'Add to Cart';
    let buttonIcon = 'fas fa-cart-plus';
    let buttonDisabled = false;
    let buttonClass = 'btn-add-cart';
    
    if (isAdded) {
      buttonText = 'Added';
      buttonIcon = 'fas fa-check';
      buttonDisabled = true;
      buttonClass += ' added';
    } else if (isBorrowed) {
      buttonText = 'Borrowed';
      buttonIcon = 'fas fa-ban';
      buttonDisabled = true;
      buttonClass += ' borrowed';
    }
    
    const handleButtonClick = () => {
      if (!buttonDisabled) {
        addToCart(book);
      }
    };
    
    return (
      <div className="book-card" data-category={book.category}>
        <div className="book-image">
          <i className="fas fa-book"></i>
          <span className="book-tag">{tagText}</span>
          {book.availableCopies > 0 && (
            <span className="book-copies">Available: {book.availableCopies}</span>
          )}
        </div>
        <div className="book-info">
          <div className="book-title">{book.title}</div>
          <div className="book-author">
            <i className="fas fa-user-pen"></i>
            {book.author}
          </div>
          <div className="book-meta">
            <div className="book-genre">
              <i className="fas fa-tag"></i>
              {book.genre}
            </div>
            <div className="book-rating">
              <div className="stars">{renderStars(book.rating)}</div>
              <span className="rating-value">{book.rating}</span>
            </div>
          </div>
          <div className="book-actions">
            <button 
              className={buttonClass}
              onClick={handleButtonClick}
              disabled={buttonDisabled}
            >
              <i className={buttonIcon}></i>
              {buttonText}
            </button>
            {isBorrowed && book.dueDate && (
              <div className="borrowed-status">
                <i className="fas fa-clock"></i>
                Due: {new Date(book.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Borrowed book card component
  const BorrowedBookCard = ({ book }) => {
    return (
      <div className="book-card" data-category={book.category}>
        <div className="book-image">
          <i className="fas fa-book"></i>
          <span className="book-tag">Borrowed</span>
        </div>
        <div className="book-info">
          <div className="book-title">{book.title}</div>
          <div className="book-author">
            <i className="fas fa-user-pen"></i>
            {book.author}
          </div>
          <div className="book-meta">
            <div className="book-genre">
              <i className="fas fa-tag"></i>
              {book.genre}
            </div>
            <div className="book-rating">
              <div className="stars">{renderStars(book.rating)}</div>
              <span className="rating-value">{book.rating}</span>
            </div>
          </div>
          <div className="book-due">
            <i className="fas fa-calendar-alt"></i>
            Due Date: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}
          </div>
          <div className="book-actions">
            <button 
              className="btn-return"
              onClick={() => returnBook(book._id || book.id)}
            >
              <i className="fas fa-undo"></i>
              Return Book
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading books from database...</p>
        <small>Connecting to MongoDB...</small>
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
        <p className="error-hint">Make sure your backend server is running on port 5000</p>
        <button onClick={fetchBooks} className="retry-btn">
          <i className="fas fa-redo"></i>
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* Success Message */}
      {showSuccess && (
        <div className="success-message show">
          <i className="fas fa-check-circle"></i>
          <strong>Success!</strong> {successMessage}
        </div>
      )}

      {/* Navbar */}
      <nav className={`navbar ${navbarScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <i className="fas fa-tree"></i>
          <span className="logo-text">Tree Kings</span>
          <small className="db-status">
            <i className="fas fa-database"></i>
            Connected to MongoDB
          </small>
        </div>
        <div className="nav-right">
          <div className="search-container" ref={searchRef}>
            <span className="search-icon">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results active">
                {searchResults.map(book => (
                  <div 
                    key={book._id || book.id} 
                    className="search-result-item"
                    onClick={() => {
                      if (book.status !== "borrowed") {
                        addToCart(book);
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }
                    }}
                  >
                    <div className="search-result-image">
                      <i className="fas fa-book"></i>
                      {book.status === "borrowed" && (
                        <span className="borrowed-badge">Borrowed</span>
                      )}
                    </div>
                    <div className="search-result-info">
                      <div className="search-result-title">{book.title}</div>
                      <div className="search-result-author">
                        <i className="fas fa-user-pen"></i> {book.author}
                      </div>
                      <div className="search-result-details">
                        <span className="search-result-genre">
                          <i className="fas fa-tag"></i> {book.genre}
                        </span>
                        <span className="search-result-rating">
                          <i className="fas fa-star"></i> {book.rating}
                        </span>
                        {book.availableCopies > 0 && (
                          <span className="search-result-copies">
                            <i className="fas fa-layer-group"></i> {book.availableCopies} left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="cart-icon" onClick={() => setCartOpen(!cartOpen)}>
            <i className="fas fa-shopping-cart"></i>
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </div>
          
          <div className="student-info">
            <i className="fas fa-user-graduate"></i>
            <span className="student-id">Student ID: {studentId}</span>
          </div>
          
          <a href="/" className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span className="btn-text">Logout</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Filters and Sort Bar */}
        <div className="filters-bar">
          <div className="filter-group">
            <span className="filter-label">
              <i className="fas fa-filter"></i> Genre:
            </span>
            <select 
              className="filter-select" 
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="all">All Genres</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Classic">Classic</option>
              <option value="Romance">Romance</option>
              <option value="Fiction">Fiction</option>
              <option value="Mystery">Mystery</option>
            </select>
          </div>
          
          <div className="filter-group">
            <span className="filter-label">
              <i className="fas fa-star"></i> Rating:
            </span>
            <select 
              className="filter-select" 
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3.0">3.0+ Stars</option>
            </select>
          </div>
          
          <button 
            className={`sort-btn ${isSortedAZ ? 'active' : ''}`} 
            onClick={toggleSort}
          >
            <i className={`fas ${isSortedAZ ? 'fa-sort-alpha-down-alt' : 'fa-sort-alpha-down'}`}></i>
            <span>{isSortedAZ ? 'Sorted A-Z' : 'Sort A-Z'}</span>
          </button>

          <button 
            className="refresh-btn" 
            onClick={fetchBooks}
            title="Refresh books from database"
          >
            <i className="fas fa-sync-alt"></i>
            <span>Refresh</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <h1>Discover Your Next Read</h1>
            <p>Browse our extensive collection of books and borrow your favorites. Start your reading journey today!</p>
            <div className="stats">
              <div className="stat">
                <i className="fas fa-book"></i>
                <span>{books.length} Books Total</span>
              </div>
              <div className="stat">
                <i className="fas fa-check-circle"></i>
                <span>{books.filter(b => b.status === 'available').length} Available</span>
              </div>
              <div className="stat">
                <i className="fas fa-user-graduate"></i>
                <span>{borrowedBooks.length} Borrowed by You</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="content-wrapper">
          {/* My Borrowed Books Section */}
          {borrowedBooks.length > 0 && (
            <div className="section">
              <h2 className="section-title">
                <i className="fas fa-bookmark"></i>
                My Borrowed Books ({borrowedBooks.length})
              </h2>
              <div className="row">
                {borrowedBooks.map(book => (
                  <BorrowedBookCard key={book._id || book.id} book={book} />
                ))}
              </div>
            </div>
          )}

          {/* Featured Books */}
          <div className="section">
            <h2 className="section-title">
              <i className="fas fa-star"></i>
              Featured Books ({featuredBooks.length})
            </h2>
            <div className="row">
              {featuredBooks.map(book => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
            </div>
          </div>

          {/* Popular Books */}
          <div className="section">
            <h2 className="section-title">
              <i className="fas fa-fire"></i>
              Popular This Week ({popularBooks.length})
            </h2>
            <div className="row">
              {popularBooks.map(book => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
            </div>
          </div>

          {/* All Books */}
          <div className="section">
            <h2 className="section-title">
              <i className="fas fa-book-open"></i>
              All Books ({allBooks.length})
            </h2>
            <div className="row">
              {allBooks.map(book => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className={`overlay ${cartOpen || checkoutOpen ? 'active' : ''}`} 
           onClick={() => {
             setCartOpen(false);
             setCheckoutOpen(false);
           }}></div>
      
      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`} ref={cartRef}>
        <div className="cart-header">
          <h2>
            <i className="fas fa-shopping-cart"></i>
            Borrow Cart
            <span className="cart-count">({cart.length}/5)</span>
          </h2>
          <button className="close-cart" onClick={() => setCartOpen(false)}>×</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <p>Your cart is empty</p>
              <small>Add books from the collection</small>
            </div>
          ) : (
            cart.map(book => (
              <div key={book._id || book.id} className="cart-item">
                <div className="cart-item-image">
                  <i className="fas fa-book"></i>
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-title">{book.title}</div>
                  <div className="cart-item-author">
                    <i className="fas fa-user-pen"></i>
                    {book.author}
                  </div>
                  <div className="cart-item-due">
                    <i className="fas fa-calendar-alt"></i>
                    Due in 14 days
                  </div>
                  <button 
                    className="remove-item" 
                    onClick={() => removeFromCart(book._id || book.id)}
                  >
                    <i className="fas fa-trash"></i>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="cart-footer">
          <div className="cart-total">
            <span>
              <i className="fas fa-box"></i> Total Items:
            </span>
            <span>{cart.length}</span>
          </div>
          <div className="cart-reminder">
            <i className="fas fa-info-circle"></i>
            Books are due 14 days after checkout
          </div>
          <button 
            className="btn-checkout" 
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            <i className="fas fa-check-circle"></i>
            Checkout ({cart.length} items)
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <div className={`checkout-modal ${checkoutOpen ? 'active' : ''}`}>
        <div className="checkout-header">
          <h2>
            <i className="fas fa-clipboard-check"></i>
            Confirm Borrow
          </h2>
          <p>Review your selection before proceeding</p>
        </div>
        
        <div className="checkout-summary">
          <div className="summary-item">
            <div><i className="fas fa-box"></i> Items:</div>
            <div>{cart.length}</div>
          </div>
          <div className="summary-item">
            <div><i className="fas fa-book"></i> Books:</div>
            <div className="book-list">
              {cart.map(book => (
                <div key={book._id || book.id} className="book-item">
                  <i className="fas fa-book"></i> {book.title}
                </div>
              ))}
            </div>
          </div>
          <div className="summary-item important">
            <div><i className="fas fa-calendar-alt"></i> Due Date:</div>
            <div>14 days from checkout</div>
          </div>
          <div className="summary-item">
            <div><i className="fas fa-list-check"></i> Total:</div>
            <div>{cart.length} book{cart.length > 1 ? 's' : ''}</div>
          </div>
        </div>
        
        <div className="checkout-actions">
          <button className="btn-cancel" onClick={() => setCheckoutOpen(false)}>
            <i className="fas fa-times"></i>
            Cancel
          </button>
          <button className="btn-confirm" onClick={confirmCheckout}>
            <i className="fas fa-check"></i>
            Confirm Borrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;