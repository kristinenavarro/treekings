import { useState, useEffect } from 'react';
import { FaTree, FaUserGraduate, FaUserShield, FaCrown, FaUser, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaGraduationCap, FaDatabase, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './login.css';
import { useNavigate } from 'react-router-dom';


function App() {

  useEffect 
  useState 

  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:5000/api';
  
  const [mode, setMode] = useState('login');
  const [currentRole, setCurrentRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: '', isSuccess: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessage({ text: '', isSuccess: false });
  }, [mode, currentRole]);

  useEffect(() => {
    testAPIConnection();
  }, []);

  const testAPIConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (response.ok) {
        console.log('✅ API connection successful');
      }
    } catch (error) {
      console.log('⚠️ API connection failed - make sure server is running');
    }
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const showMessage = (text, isSuccess = false) => {
    setMessage({ text, isSuccess });
  };

  const handleRegister = async (name, email, password, role) => {
  try {
    let studentData = {};

    if (role === 'student') {
      const studentId = prompt('Enter Student ID (e.g., 2023-001):');
      const department = prompt('Enter Department (e.g., Computer Science):');
      const yearLevel = prompt('Enter Year Level (1-5):');

      if (!studentId || !department || !yearLevel) {
        showMessage('All student information is required.');
        return false;
      }

      studentData = { studentId, department, yearLevel };
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: name,
        email,
        password,
        role,
        studentInfo: studentData
      })
    });

    const data = await response.json();

    if (response.ok && data.user) {  // <-- use response.ok to check HTTP status
      return true;
    } else {
      showMessage(data.message || 'Registration failed');
      return false;
    }
  } catch (error) {
    showMessage('Network error. Please check if server is running.');
    console.error('Registration error:', error);
    return false;
  }
};


  const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase(), password })
    });

    const data = await response.json();
    console.log('Login response:', data, response.status);

    if (response.ok && data.user) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return data.user;
    } else {
      showMessage(data.message || 'Login failed');
      return null;
    }
  } catch (error) {
    showMessage('Network error. Please check if server is running.');
    console.error('Login error:', error);
    console.log("Trying login:", email);
    console.log("Found user:", user);
    console.log("Password hash:", user?.password);

    return null;
  }
};






  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showMessage('');

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password || (mode === 'signup' && !name)){
      showMessage('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    if (mode === 'signup') {
      const success = await handleRegister(name, email, password, currentRole);
     

    } else {
      const userData = await handleLogin(email, password); // <-- remove currentRole
      if (userData) {
        showMessage('Login successful! Redirecting...', true);

        setTimeout(() => {
          redirectForRole(userData.role); // <-- use actual role from backend
        }, 1500);
      }
    }


    setIsLoading(false);
  };

  // const redirectForRole = (role) => {
  //   const roleLabel = role === 'student' ? 'Student' : 
  //                    role === 'admin' ? 'Admin' : 'Super Admin';
    
  //   alert(`✅ ${roleLabel} login successful!\n\nFull dashboard coming soon.\n\nFor now, you can:\n1. Add books using: POST /api/books\n2. View books using: GET /api/books`);
    
  //   setFormData({
  //     name: '',
  //     email: '',
  //     password: ''
  //   });
  // };

  const redirectForRole = (role) => {
  // Redirect based on role
  if (role === 'admin') navigate('/admin');
  else if (role === 'student') navigate('/student');
  else if (role === 'superadmin') navigate('/superadmin');

  setFormData({ name: '', email: '', password: '' });
};


  const getRoleLabel = () => {
    return currentRole === 'student' ? 'Student'
      : currentRole === 'admin' ? 'Admin'
      : 'Super Admin';
  };

  const roleLabel = getRoleLabel();

  return (
    <div className="shell">
      <div className="left">
        <div className="brand">
          <FaTree className="icon" />
          <span>Tree Kings Library</span>
        </div>
        
        <h1 id="authTitle">
          {mode === 'login' ? `${roleLabel} Login` : `${roleLabel} Signup`}
        </h1>
        
        <p id="authSubtitle">
          {mode === 'login' 
            ? `Sign in as a ${roleLabel.toLowerCase()} to access the Tree Kings dashboard.`
            : `Create a new ${roleLabel.toLowerCase()} account for the Tree Kings system.`
          }
        </p>

        <div className="role-tabs">
          <button 
            className={`role-tab ${currentRole === 'student' ? 'active' : ''}`} 
            data-role="student" 
            id="tab-student"
            onClick={() => handleRoleChange('student')}
            type="button"
          >
            <FaUserGraduate />
            Student
          </button>
          <button 
            className={`role-tab ${currentRole === 'admin' ? 'active' : ''}`} 
            data-role="admin" 
            id="tab-admin"
            onClick={() => handleRoleChange('admin')}
            type="button"
          >
            <FaUserShield />
            Admin
          </button>
          <button 
            className={`role-tab ${currentRole === 'superadmin' ? 'active' : ''}`} 
            data-role="superadmin" 
            id="tab-superadmin"
            onClick={() => handleRoleChange('superadmin')}
            type="button"
          >
            <FaCrown />
            Super Admin
          </button>
        </div>

        <div className="toggle-auth">
          <span id="authToggleText">
            {mode === 'login' ? "Don't have an account yet?" : "Already have an account?"}
          </span>
          <button type="button" id="toggleAuthBtn" onClick={toggleMode}>
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </div>

        <form id="authForm" onSubmit={handleSubmit}>
          <div className="field" id="nameField" style={{ display: mode === 'signup' ? 'flex' : 'none' }}>
            <label htmlFor="name">
              <FaUser />
              Full name
            </label>
            <div className="input-container">
              <FaUser />
              <input 
                type="text" 
                id="name" 
                placeholder="e.g. Juan Dela Cruz" 
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="field">
            <label htmlFor="email">
              <FaEnvelope />
              Email
            </label>
            <div className="input-container">
              <FaEnvelope />
              <input 
                type="email" 
                id="email" 
                placeholder="name@example.com" 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="field">
            <label htmlFor="password">
              <FaLock />
              Password
            </label>
            <div className="input-container">
              <FaLock />
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="actions">
            <button type="submit" className="primary-btn" id="submitBtn" disabled={isLoading}>
              {mode === 'login' ? <FaSignInAlt id="submitIcon" /> : <FaUserPlus id="submitIcon" />}
              <span id="submitLabel">
                {isLoading ? 'Processing...' : `${mode === 'login' ? 'Login' : 'Sign up'} as ${roleLabel}`}
              </span>
            </button>
            
            <div className="helper" id="helperText">
              {mode === 'login' ? (
                currentRole === 'student' ? (
                  <>
                    <FaGraduationCap /> Use your Tree Kings Student email to log in.
                  </>
                ) : currentRole === 'admin' ? (
                  <>
                    <FaUserShield /> Use your registered Tree Kings admin account.
                  </>
                ) : (
                  <>
                    <FaCrown /> Super admin access for system management.
                  </>
                )
              ) : (
                <>
                  <FaDatabase /> Account will be saved in MongoDB database.
                </>
              )}
            </div>
            
            {message.text && (
              <div className={`error ${message.isSuccess ? 'success' : 'danger'}`} id="errorBox">
                {message.isSuccess ? <FaCheckCircle /> : <FaExclamationCircle />}
                {message.text}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;