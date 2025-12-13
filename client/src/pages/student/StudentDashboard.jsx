import React, { useState, useEffect, useRef } from 'react';
import './StudentDashboard.css';

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
  const [checkoutSuccessOpen, setCheckoutSuccessOpen] = useState(false);
  const [checkoutSuccessData, setCheckoutSuccessData] = useState({
    books: [],
    dueDate: null
  });
  const [notifications, setNotifications] = useState([]);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get student ID
  const [studentId, setStudentId] = useState(
    localStorage.getItem('studentId') || 
    localStorage.getItem('userId') || 
    '693c09673897f33eaaf77154'
  );

  const searchRef = useRef(null);
  const cartRef = useRef(null);

  // Sample books with exact ratings for testing
  const sampleBooks = [
    {
      _id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic',
      rating: 5.0,
      category: 'featured',
      status: 'available',
      availableCopies: 3,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg/480px-The_Great_Gatsby_Cover_1925_Retouched.jpg'
    },
    {
      _id: '2',
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      rating: 5.0,
      category: 'popular',
      status: 'available',
      availableCopies: 5,
      image: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Harry_Potter_and_the_Philosopher%27s_Stone_banner.jpg/480px-Harry_Potter_and_the_Philosopher%27s_Stone_banner.jpg'
    },
    {
      _id: '3',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      genre: 'Romance',
      rating: 4.5,
      category: 'featured',
      status: 'available',
      availableCopies: 2,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/PrideAndPrejudiceTitlePage.jpg/480px-PrideAndPrejudiceTitlePage.jpg'
    },
    {
      _id: '4',
      title: '1984',
      author: 'George Orwell',
      genre: 'Fiction',
      rating: 4.5,
      category: 'all',
      status: 'available',
      availableCopies: 4,
      image: 'https://upload.wikimedia.org/wikipedia/en/c/c3/1984first.jpg'
    },
    {
      _id: '5',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      rating: 4.0,
      category: 'popular',
      status: 'available',
      availableCopies: 3,
      image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&h=600&fit=crop'
    },
    {
      _id: '6',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Classic',
      rating: 4.0,
      category: 'all',
      status: 'available',
      availableCopies: 2,
      image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop'
    },
    {
      _id: '7',
      title: 'The Da Vinci Code',
      author: 'Dan Brown',
      genre: 'Mystery',
      rating: 3.5,
      category: 'popular',
      status: 'available',
      availableCopies: 4,
      image: 'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=400&h=600&fit=crop'
    },
    {
      _id: '8',
      title: 'Dune',
      author: 'Frank Herbert',
      genre: 'Science Fiction',
      rating: 3.5,
      category: 'all',
      status: 'available',
      availableCopies: 3,
      image: 'https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?w=400&h=600&fit=crop'
    },
    {
      _id: '9',
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      genre: 'Biography',
      rating: 3.0,
      category: 'all',
      status: 'available',
      availableCopies: 2,
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop'
    },
    {
      _id: '10',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      genre: 'History',
      rating: 3.0,
      category: 'featured',
      status: 'available',
      availableCopies: 5,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop'
    },
    {
      _id: '11',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      genre: 'Classic',
      rating: 2.5,
      category: 'all',
      status: 'available',
      availableCopies: 3,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop'
    },
    {
      _id: '12',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Fiction',
      rating: 2.5,
      category: 'all',
      status: 'available',
      availableCopies: 4,
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop'
    },
    {
      _id: '13',
      title: 'Two Star Book',
      author: 'Test Author',
      genre: 'Fiction',
      rating: 2.0,
      category: 'all',
      status: 'available',
      availableCopies: 1,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
    },
    {
      _id: '14',
      title: 'Another Two Star',
      author: 'Test Author',
      genre: 'Classic',
      rating: 2.0,
      category: 'all',
      status: 'available',
      availableCopies: 1,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop'
    },
    {
      _id: '15',
      title: 'One Point Five Star',
      author: 'Test Author',
      genre: 'Mystery',
      rating: 1.5,
      category: 'all',
      status: 'available',
      availableCopies: 1,
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop'
    },
    {
      _id: '16',
      title: 'One Star Book',
      author: 'Test Author',
      genre: 'Biography',
      rating: 1.0,
      category: 'all',
      status: 'available',
      availableCopies: 1,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop'
    },
    {
      _id: '17',
      title: 'Another One Star',
      author: 'Test Author',
      genre: 'History',
      rating: 1.0,
      category: 'all',
      status: 'available',
      availableCopies: 1,
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop'
    }
  ];  

  // Fetch books from database on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to fetch books from backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      
      if (result.success) {
        const booksWithImages = result.data.map(book => ({
          ...book,
          image: book.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
          availableCopies: book.availableCopies || 0
        }));
        setBooks(booksWithImages);
      } else {
        throw new Error(result.message || 'Failed to load books');
      }
    } catch (err) {
      console.log('Using sample books data:', err.message);
      setBooks(sampleBooks);
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const newNotification = {
      id,
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 2)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
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

  // Render stars
  const renderStars = (rating) => {
    let starsHTML = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHTML.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        starsHTML.push(<span key={i} className="star half">⯨</span>);
      } else {
        starsHTML.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return starsHTML;
  };

  // Helper function to get rounded rating for filtering
  const getRoundedRating = (rating) => {
    return Math.round(rating * 2) / 2; // Round to nearest 0.5
  };

  // ========== UPDATED: Add book to cart with copy check ==========
  const addToCart = (book) => {
    // Check if book has available copies
    if (book.availableCopies <= 0) {
      showNotification('Book Not Available! No copies left.', 'warning');
      return;
    }

    const bookId = book._id;
    
    // Check if book is already in cart
    if (addedBooks.has(bookId)) {
      showNotification('This book is already in your cart!', 'warning');
      return;
    }

    // Check cart limit
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
    setCart(prevCart => prevCart.filter(book => book._id !== bookId));
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
      const response = await fetch(`http://localhost:5000/api/books/return/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setBooks(prevBooks => 
          prevBooks.map(book => {
            if (book._id === bookId) {
              return {
                ...book,
                availableCopies: (book.availableCopies || 0) + 1,
                status: 'available'
              };
            }
            return book;
          })
        );
        
        showNotification('Book returned successfully!', 'success');
      } else {
        throw new Error(result.message || 'Failed to return book');
      }
    } catch (err) {
      showNotification(err.message || 'Failed to return book. Please try again.', 'error');
      console.error('Error returning book:', err);
    }
  };

  // FIXED: Rating filter to show books with EXACT ratings only
  const filteredBooks = books.filter(book => {
    const genreMatch = genreFilter === 'all' || book.genre === genreFilter;
    
    let ratingMatch = true;
    if (ratingFilter !== 'all') {
      const selectedRating = parseFloat(ratingFilter);
      const bookRatingRounded = getRoundedRating(book.rating);
      ratingMatch = bookRatingRounded === selectedRating;
    }
    
    return genreMatch && ratingMatch;
  });

  const sortedBooks = isSortedAZ 
    ? [...filteredBooks].sort((a, b) => a.title.localeCompare(b.title))
    : filteredBooks;

  // Get books by category
  const featuredBooks = sortedBooks.filter(book => book.category === 'featured');
  const popularBooks = sortedBooks.filter(book => book.category === 'popular');
  const allBooks = sortedBooks.filter(book => book.category === 'all');
  
  // Get borrowed books (books borrowed by current student)
  const borrowedBooks = books.filter(book => 
    book.status === "borrowed" && book.borrowedBy === studentId
  );

  // Calculate rating distribution
  const calculateRatingDistribution = () => {
    const distribution = {
      '5.0': 0,
      '4.5': 0,
      '4.0': 0,
      '3.5': 0,
      '3.0': 0,
      '2.5': 0,
      '2.0': 0,
      '1.5': 0,
      '1.0': 0,
    };
    
    books.forEach(book => {
      const roundedRating = getRoundedRating(book.rating);
      if (distribution[roundedRating.toString()] !== undefined) {
        distribution[roundedRating.toString()]++;
      }
    });
    
    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution();

  // Toggle sort
  const toggleSort = () => {
    setIsSortedAZ(!isSortedAZ);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    showNotification('Logged out successfully!', 'success');
    
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  // Checkout functions
  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'warning');
      return;
    }
    
    // Check if any book in cart is now unavailable
    const unavailableBooks = cart.filter(book => {
      const currentBook = books.find(b => b._id === book._id);
      return !currentBook || currentBook.availableCopies <= 0;
    });
    
    if (unavailableBooks.length > 0) {
      showNotification(`Some books are no longer available. Please update your cart.`, 'warning');
      return;
    }
    
    setCheckoutOpen(true);
  };

  // ========== UPDATED: Confirm checkout with copy management ==========
  const confirmCheckout = async () => {
    try {
      const bookIds = cart.map(book => book._id);
      
      const response = await fetch('http://localhost:5000/api/books/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          bookIds
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local books state to reflect reduced copies
        setBooks(prevBooks => 
          prevBooks.map(book => {
            if (cart.some(cartBook => cartBook._id === book._id)) {
              // Decrease available copies by 1
              const newCopies = Math.max(0, (book.availableCopies || 0) - 1);
              
              return {
                ...book,
                availableCopies: newCopies,
                status: newCopies === 0 ? 'unavailable' : book.status
              };
            }
            return book;
          })
        );

        // Save cart data before clearing it
        const checkedOutBooks = [...cart];
        const dueDate = result.data.dueDate;
        
        // Clear cart and close modals
        setCheckoutOpen(false);
        setCartOpen(false);
        setCart([]);
        setAddedBooks(new Set());
        
        // Show checkout success modal
        setCheckoutSuccessData({
          books: checkedOutBooks,
          dueDate: dueDate
        });
        setCheckoutSuccessOpen(true);
        
        // Show notification
        showNotification(`Successfully borrowed ${checkedOutBooks.length} book(s)!`, 'success');
        
      } else {
        throw new Error(result.message || 'Failed to borrow books');
      }
    } catch (err) {
      showNotification(err.message || 'Failed to checkout. Please try again.', 'error');
      console.error('Error during checkout:', err);
    }
  };

  // ========== UPDATED: Get book image with availability badge ==========
  const getBookImage = (book) => {
    const isAvailable = book.availableCopies > 0;
    
    return (
      <div 
        className="book-image" 
        style={{ 
          backgroundImage: `url(${book.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <span className="book-tag">
          {book.category === 'featured' ? <><i className="fas fa-star"></i> Featured</> : 
           book.category === 'popular' ? <><i className="fas fa-fire"></i> Popular</> : <><i className="fas fa-book"></i> New</>}
        </span>
        {isAvailable ? (
          <span className="book-copies available">
            <i className="fas fa-box"></i> {book.availableCopies} available
          </span>
        ) : (
          <span className="book-copies unavailable">
            <i className="fas fa-ban"></i> Not Available
          </span>
        )}
        {book.status === 'borrowed' && book.borrowedBy === studentId && (
          <span className="book-borrowed"><i className="fas fa-book-reader"></i> Borrowed by You</span>
        )}
      </div>
    );
  };

  // ========== UPDATED: Book card with copy availability ==========
  const BookCard = ({ book }) => {
    const isAdded = addedBooks.has(book._id);
    const isBorrowedByYou = book.status === "borrowed" && book.borrowedBy === studentId;
    const isAvailable = book.availableCopies > 0;
    
    let buttonText = 'Add to Cart';
    let buttonDisabled = false;
    let buttonClass = 'btn-add-cart';
    let statusMessage = '';
    
    if (isAdded) {
      buttonText = <><i className="fas fa-check"></i> Added</>;
      buttonDisabled = true;
      buttonClass += ' added';
      statusMessage = 'In your cart';
    } else if (isBorrowedByYou) {
      buttonText = <><i className="fas fa-ban"></i> Borrowed by You</>;
      buttonDisabled = true;
      buttonClass += ' borrowed';
      statusMessage = 'Currently borrowed by you';
    } else if (!isAvailable) {
      buttonText = <><i className="fas fa-times"></i> Not Available</>;
      buttonDisabled = true;
      buttonClass += ' unavailable';
      statusMessage = 'No copies available';
    }
    
    return (
      <div className="book-card">
        {getBookImage(book)}
        <div className="book-info">
          <div className="book-title">{book.title}</div>
          <div className="book-author">
            <i className="fas fa-user-edit"></i> {book.author}
          </div>
          <div className="book-meta">
            <div className="book-genre">
              <i className="fas fa-tag"></i> {book.genre}
            </div>
            <div className="book-rating">
              <div className="stars">{renderStars(book.rating)}</div>
              <span className="rating-value">{book.rating.toFixed(1)}</span>
            </div>
          </div>
          {statusMessage && (
            <div className="book-status-message">
              <i className="fas fa-info-circle"></i> {statusMessage}
            </div>
          )}
          <div className="book-actions">
            <button 
              className={buttonClass}
              onClick={() => !buttonDisabled && addToCart(book)}
              disabled={buttonDisabled}
              title={!isAvailable ? 'No copies available' : ''}
            >
              <i className="fas fa-cart-plus"></i> {buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Borrowed book card
  const BorrowedBookCard = ({ book }) => (
    <div className="book-card">
      {getBookImage(book)}
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">
          <i className="fas fa-user-edit"></i> {book.author}
        </div>
        <div className="book-meta">
          <div className="book-genre">
            <i className="fas fa-tag"></i> {book.genre}
          </div>
          <div className="book-rating">
            <div className="stars">{renderStars(book.rating)}</div>
            <span className="rating-value">{book.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="book-due">
          <i className="fas fa-calendar-alt"></i> Due: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}
        </div>
        <div className="book-actions">
          <button className="btn-return" onClick={() => returnBook(book._id)}>
            <i className="fas fa-undo-alt"></i> Return Book
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* Notifications Stack */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.type}`}
          >
            <div className="notification-icon">
              {notification.type === 'success' && <i className="fas fa-check-circle"></i>}
              {notification.type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
              {notification.type === 'error' && <i className="fas fa-times-circle"></i>}
              {notification.type === 'info' && <i className="fas fa-info-circle"></i>}
            </div>
            <div className="notification-content">
              <div className="notification-title">
                {notification.type === 'success' && 'Success!'}
                {notification.type === 'warning' && 'Warning!'}
                {notification.type === 'error' && 'Error!'}
                {notification.type === 'info' && 'Info!'}
              </div>
              <div className="notification-message">{notification.message}</div>
            </div>
            <button 
              className="notification-close"
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Navbar */}
      <nav className={`navbar ${navbarScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <i className="fas fa-tree"></i>
          <span className="logo-text">Tree Kings Library</span>
          <span className="db-status">
            {/* <i className="fas fa-database"></i> 
            {books === sampleBooks ? 'Sample Data' : 'Live DB'} */}
          </span>
        </div>
        <div className="nav-right">
          <div className="search-container" ref={searchRef}>
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search books by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className={`search-results ${showSearchResults ? 'active' : ''}`}>
                {searchResults.map(book => (
                  <div 
                    key={book._id} 
                    className="search-result-item"
                    onClick={() => {
                      if (book.availableCopies > 0 && !addedBooks.has(book._id)) {
                        addToCart(book);
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }
                    }}
                  >
                    <div 
                      className="search-result-image"
                      style={{ backgroundImage: `url(${book.image})` }}
                    >
                      {book.availableCopies <= 0 && (
                        <span className="unavailable-badge"><i className="fas fa-ban"></i> Unavailable</span>
                      )}
                      {book.status === "borrowed" && book.borrowedBy === studentId && (
                        <span className="borrowed-badge"><i className="fas fa-book-reader"></i> Borrowed</span>
                      )}
                    </div>
                    <div className="search-result-info">
                      <div className="search-result-title">{book.title}</div>
                      <div className="search-result-author">
                        <i className="fas fa-user-edit"></i> {book.author}
                      </div>
                      <div className="search-result-details">
                        <span className="search-result-genre">
                          <i className="fas fa-tag"></i> {book.genre}
                        </span>
                        <span className="search-result-rating">
                          <i className="fas fa-star"></i> {book.rating.toFixed(1)}
                        </span>
                        <span className={`search-result-copies ${book.availableCopies <= 0 ? 'unavailable' : 'available'}`}>
                          <i className={`fas ${book.availableCopies > 0 ? 'fa-box' : 'fa-ban'}`}></i> 
                          {book.availableCopies > 0 ? `${book.availableCopies} left` : 'Unavailable'}
                        </span>
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
          
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <i className="fas fa-sign-out-alt"></i>
            <span className="btn-text">Logout</span>
          </button>
          
          <div className="student-info">
            <i className="fas fa-user-graduate"></i>
            <span className="student-id">ID: {studentId.substring(0, 8)}...</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Filters and Sort Bar */}
        <div className="filters-bar">
          <div className="filter-group">
            <span className="filter-label">
              <i className="fas fa-tag"></i> Genre:
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
              <option value="Science Fiction">Science Fiction</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
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
              <option value="5">5.0 ★★★★★ ({ratingDistribution['5.0']})</option>
              <option value="4.5">4.5 ★★★★☆ ({ratingDistribution['4.5']})</option>
              <option value="4">4.0 ★★★★☆ ({ratingDistribution['4.0']})</option>
              <option value="3.5">3.5 ★★★☆☆ ({ratingDistribution['3.5']})</option>
              <option value="3">3.0 ★★★☆☆ ({ratingDistribution['3.0']})</option>
              <option value="2.5">2.5 ★★☆☆☆ ({ratingDistribution['2.5']})</option>
              <option value="2">2.0 ★★☆☆☆ ({ratingDistribution['2.0']})</option>
              <option value="1.5">1.5 ★☆☆☆☆ ({ratingDistribution['1.5']})</option>
              <option value="1">1.0 ★☆☆☆☆ ({ratingDistribution['1.0']})</option>
            </select>
          </div>
          
          <button 
            className={`sort-btn ${isSortedAZ ? 'active' : ''}`} 
            onClick={toggleSort}
          >
            <i className={`fas ${isSortedAZ ? 'fa-sort-alpha-up' : 'fa-sort-alpha-down'}`}></i>
            <span>{isSortedAZ ? 'Sorted A-Z' : 'Sort A-Z'}</span>
          </button>

          <button 
            className="refresh-btn" 
            onClick={fetchBooks}
            title="Refresh books from database"
          >
            <i className="fas fa-redo"></i>
            <span>Refresh</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <h1><i className="fas fa-book"></i> Discover Your Next Read</h1>
            <p>Browse our extensive collection of books and borrow your favorites. Start your reading journey today!</p>
            <div className="stats">
              <div className="stat">
                <i className="fas fa-book"></i>
                <span>{books.length} Books Total</span>
              </div>
              <div className="stat">
                <i className="fas fa-check-circle"></i>
                <span>{books.filter(b => b.availableCopies > 0).length} Available</span>
              </div>
              <div className="stat">
                <i className="fas fa-user-graduate"></i>
                <span>{borrowedBooks.length} Borrowed by You</span>
              </div>
              <div className="stat">
                <i className="fas fa-filter"></i>
                <span>Filtered: {sortedBooks.length} books</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="content-wrapper">
          {/* Rating Filter Info */}
          {ratingFilter !== 'all' && (
            <div className="rating-filter-info">
              <i className="fas fa-star"></i>
              <span>Showing books with exactly {ratingFilter} star rating</span>
              <span className="book-count">({sortedBooks.length} books)</span>
            </div>
          )}

          {/* My Borrowed Books Section */}
          {borrowedBooks.length > 0 && (
            <div className="section">
              <h2 className="section-title">
                <i className="fas fa-book-open"></i>
                My Borrowed Books ({borrowedBooks.length})
              </h2>
              <div className="row">
                {borrowedBooks.map(book => (
                  <BorrowedBookCard key={book._id} book={book} />
                ))}
              </div>
            </div>
          )}

          {/* Available Books Count */}
          <div className="availability-info">
            <i className="fas fa-info-circle"></i>
            <span>
              Showing {sortedBooks.filter(b => b.availableCopies > 0).length} available books out of {sortedBooks.length} total
            </span>
          </div>

          {/* Featured Books */}
          {featuredBooks.length > 0 && (
            <div className="section">
              <h2 className="section-title">
                <i className="fas fa-star"></i>
                Featured Books ({featuredBooks.filter(b => b.availableCopies > 0).length} available)
              </h2>
              <div className="row">
                {featuredBooks.map(book => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </div>
          )}

          {/* Popular Books */}
          {popularBooks.length > 0 && (
            <div className="section">
              <h2 className="section-title">
                <i className="fas fa-fire"></i>
                Popular This Week ({popularBooks.filter(b => b.availableCopies > 0).length} available)
              </h2>
              <div className="row">
                {popularBooks.map(book => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </div>
          )}

          {/* All Books */}
          {allBooks.length > 0 && (
            <div className="section">
              <h2 className="section-title">
                <i className="fas fa-book"></i>
                All Books ({allBooks.filter(b => b.availableCopies > 0).length} available)
              </h2>
              <div className="row">
                {allBooks.map(book => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {sortedBooks.length === 0 && (
            <div className="no-results">
              <i className="fas fa-book-open"></i>
              <h3>No books found</h3>
              <p>Try adjusting your filters or search query</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setGenreFilter('all');
                  setRatingFilter('all');
                }}
              >
                <i className="fas fa-times"></i> Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div className={`overlay ${cartOpen || checkoutOpen || checkoutSuccessOpen ? 'active' : ''}`} 
           onClick={() => {
             setCartOpen(false);
             setCheckoutOpen(false);
             setCheckoutSuccessOpen(false);
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
              <div key={book._id} className="cart-item">
                <div 
                  className="cart-item-image"
                  style={{ backgroundImage: `url(${book.image})` }}
                >
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-title">{book.title}</div>
                  <div className="cart-item-author">
                    <i className="fas fa-user-edit"></i> {book.author}
                  </div>
                  <div className="cart-item-copies">
                    <i className="fas fa-box"></i> {book.availableCopies} copies available
                  </div>
                  <div className="cart-item-due">
                    <i className="fas fa-calendar-alt"></i> Due in 14 days
                  </div>
                  <button 
                    className="remove-item" 
                    onClick={() => removeFromCart(book._id)}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="cart-footer">
          <div className="cart-total">
            <span><i className="fas fa-box"></i> Total Items:</span>
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
            <i className="fas fa-box"></i>
            <div>Items:</div>
            <div>{cart.length}</div>
          </div>
          <div className="summary-item">
            <i className="fas fa-book"></i>
            <div>Books:</div>
            <div className="book-list">
              {cart.map(book => (
                <div key={book._id} className="book-item">
                  <i className="fas fa-book-open"></i> {book.title} 
                  <span className="book-copies-count">({book.availableCopies} copies left)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="summary-item important">
            <i className="fas fa-calendar-alt"></i>
            <div>Due Date:</div>
            <div>14 days from checkout</div>
          </div>
          <div className="summary-item">
            <i className="fas fa-check-circle"></i>
            <div>Total:</div>
            <div>{cart.length} book{cart.length > 1 ? 's' : ''}</div>
          </div>
        </div>
        
        <div className="checkout-actions">
          <button className="btn-cancel" onClick={() => setCheckoutOpen(false)}>
            <i className="fas fa-times"></i> Cancel
          </button>
          <button className="btn-confirm" onClick={confirmCheckout}>
            <i className="fas fa-check-circle"></i> Confirm Borrow
          </button>
        </div>
      </div>

      {/* Enhanced Checkout Success Modal */}
      <div className={`checkout-success-modal ${checkoutSuccessOpen ? 'active' : ''}`}>
        <div className="checkout-success-header">
          <i className="fas fa-check-circle"></i>
          <h2>Checkout Successful!</h2>
          <p>Your books have been borrowed successfully</p>
        </div>
        
        <div className="checkout-success-content">
          <div className="success-summary">
            <div className="success-summary-item">
              <i className="fas fa-box"></i>
              <div className="label">Items Borrowed:</div>
              <div className="value">{checkoutSuccessData.books.length} book{checkoutSuccessData.books.length > 1 ? 's' : ''}</div>
            </div>
            
            <div className="success-summary-item">
              <i className="fas fa-calendar-alt"></i>
              <div className="label">Due Date:</div>
              <div className="value">
                {checkoutSuccessData.dueDate ? new Date(checkoutSuccessData.dueDate).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
          
          {checkoutSuccessData.books.length > 0 && (
            <div className="success-books-list">
              <div className="success-books-title">
                <i className="fas fa-book"></i>
                <span>Books Borrowed:</span>
              </div>
              {checkoutSuccessData.books.map((book, index) => (
                <div key={book._id} className="success-book-item">
                  <div 
                    className="success-book-image"
                    style={{ 
                      backgroundImage: `url(${book.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  <div className="success-book-info">
                    <div className="success-book-title">{book.title}</div>
                    <div className="success-book-author">
                      <i className="fas fa-user-edit"></i> {book.author}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="success-due-info">
            <i className="fas fa-clock"></i>
            <div className="success-due-info-content">
              <h4>Return Reminder</h4>
              <p>Please return all books by the due date to avoid late fees. You can renew books 2 days before the due date if available.</p>
            </div>
          </div>
          
          <div className="success-reminder">
            <i className="fas fa-info-circle"></i>
            <span>You will receive email reminders 3 days before the due date.</span>
          </div>
          
          <div className="checkout-success-actions">
            <button 
              className="btn-close-success" 
              onClick={() => setCheckoutSuccessOpen(false)}
            >
              <i className="fas fa-check"></i> Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;