import React, { useState, useEffect } from 'react';
import './superadmin.css';

const SuperAdminDashboard = () => {
    // Initial admins data
    const initialAdmins = [
        { 
            id: 1, 
            name: 'Admin One', 
            email: 'admin1@university.edu', 
            role: 'Full Admin', 
            status: 'Active', 
            lastLogin: '2024-01-15',
            permissions: ['all'],
            createdAt: '2024-01-01'
        },
        { 
            id: 2, 
            name: 'Admin Two', 
            email: 'admin2@university.edu', 
            role: 'Library Admin', 
            status: 'Active', 
            lastLogin: '2024-01-14',
            permissions: ['library', 'content'],
            createdAt: '2024-01-05'
        },
        { 
            id: 3, 
            name: 'Admin Three', 
            email: 'admin3@university.edu', 
            role: 'Student Admin', 
            status: 'Inactive', 
            lastLogin: '2024-01-10',
            permissions: ['students', 'reports'],
            createdAt: '2024-01-08'
        },
        { 
            id: 4, 
            name: 'Admin Four', 
            email: 'admin4@university.edu', 
            role: 'Content Admin', 
            status: 'Active', 
            lastLogin: '2024-01-12',
            permissions: ['content', 'media'],
            createdAt: '2024-01-10'
        }
    ];

    const [admins, setAdmins] = useState(initialAdmins);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Library Admin',
        status: 'Active',
        password: '',
        confirmPassword: '',
        permissions: []
    });
    
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showResetConfirm, setShowResetConfirm] = useState(null);
    const [notification, setNotification] = useState(null);

    // Available permissions based on role
    const rolePermissions = {
        'Full Admin': ['all'],
        'Library Admin': ['library', 'content', 'reports'],
        'Student Admin': ['students', 'attendance', 'reports'],
        'Content Admin': ['content', 'media', 'announcements'],
        'Report Admin': ['reports', 'analytics']
    };

    // Available permissions list
    const allPermissions = [
        { id: 'all', label: 'All Permissions', description: 'Full system access' },
        { id: 'library', label: 'Library Management', description: 'Manage books, resources, loans' },
        { id: 'content', label: 'Content Management', description: 'Create and edit content' },
        { id: 'students', label: 'Student Management', description: 'Manage student records' },
        { id: 'reports', label: 'Reports', description: 'View and generate reports' },
        { id: 'media', label: 'Media Management', description: 'Upload and manage media files' },
        { id: 'announcements', label: 'Announcements', description: 'Create and manage announcements' },
        { id: 'analytics', label: 'Analytics', description: 'View system analytics' },
        { id: 'settings', label: 'System Settings', description: 'Modify system settings' }
    ];

    // Filter admins
    const filteredAdmins = admins.filter(admin => {
        const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            admin.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || admin.role === filterRole;
        const matchesStatus = filterStatus === 'All' || admin.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Stats calculations
    const stats = {
        totalAdmins: admins.length,
        activeAdmins: admins.filter(a => a.status === 'Active').length,
        fullAdmins: admins.filter(a => a.role === 'Full Admin').length,
        inactiveAdmins: admins.filter(a => a.status === 'Inactive').length,
        lastAdded: admins.length > 0 ? 
            new Date(Math.max(...admins.map(a => new Date(a.createdAt)))).toLocaleDateString() : 
            'N/A'
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset permissions when role changes
        if (name === 'role') {
            const defaultPermissions = rolePermissions[value] || [];
            setFormData(prev => ({
                ...prev,
                permissions: defaultPermissions,
                [name]: value
            }));
        }
    };

    // Handle permission toggle
    const handlePermissionToggle = (permissionId) => {
        setFormData(prev => {
            const newPermissions = prev.permissions.includes(permissionId)
                ? prev.permissions.filter(p => p !== permissionId)
                : [...prev.permissions, permissionId];
            
            // If "all" is selected, only keep "all"
            if (permissionId === 'all') {
                return { ...prev, permissions: ['all'] };
            }
            
            // If selecting any other permission when "all" is present, remove "all"
            if (newPermissions.includes('all') && permissionId !== 'all') {
                return { ...prev, permissions: newPermissions.filter(p => p !== 'all') };
            }
            
            return { ...prev, permissions: newPermissions };
        });
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (!editingId && (!formData.password || !formData.confirmPassword)) {
            showNotification('Please enter password', 'error');
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }

        if (formData.password && formData.password.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            return;
        }

        if (editingId) {
            // Update existing admin
            setAdmins(prev => prev.map(admin => 
                admin.id === editingId 
                    ? { 
                        ...admin,
                        ...formData,
                        lastLogin: admin.lastLogin,
                        createdAt: admin.createdAt
                    }
                    : admin
            ));
            showNotification('Admin updated successfully!');
        } else {
            // Add new admin
            const newAdmin = {
                id: Date.now(),
                ...formData,
                lastLogin: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString().split('T')[0]
            };
            setAdmins(prev => [newAdmin, ...prev]);
            showNotification('Admin added successfully!');
        }

        resetForm();
    };

    // Handle edit
    const handleEdit = (admin) => {
        setFormData({
            name: admin.name,
            email: admin.email,
            role: admin.role,
            status: admin.status,
            password: '',
            confirmPassword: '',
            permissions: admin.permissions || []
        });
        setEditingId(admin.id);
        setShowModal(true);
    };

    // Handle delete
    const handleDelete = (id) => {
        if (admins.length <= 1) {
            showNotification('Cannot delete all admins', 'error');
            return;
        }
        
        setAdmins(prev => prev.filter(admin => admin.id !== id));
        setShowDeleteConfirm(null);
        showNotification('Admin deleted successfully!');
    };

    // Handle status toggle
    const handleStatusToggle = (id) => {
        setAdmins(prev => prev.map(admin => 
            admin.id === id 
                ? { 
                    ...admin, 
                    status: admin.status === 'Active' ? 'Inactive' : 'Active',
                    lastLogin: new Date().toISOString().split('T')[0]
                }
                : admin
        ));
        showNotification('Admin status updated!');
    };

    // Handle reset password
    const handleResetPassword = (id) => {
        // Simulate API call
        const admin = admins.find(a => a.id === id);
        if (admin) {
            // In real app, you would make an API call to send reset email
            showNotification(`Password reset email sent to ${admin.email}`);
            setShowResetConfirm(null);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: 'Library Admin',
            status: 'Active',
            password: '',
            confirmPassword: '',
            permissions: []
        });
        setEditingId(null);
        setShowModal(false);
    };

    // Export admins data
    const exportAdmins = () => {
        const dataStr = JSON.stringify(admins, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `admins-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('Admins data exported!');
    };

    // Import admins data
    const importAdmins = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                // Validate imported data
                if (Array.isArray(importedData)) {
                    setAdmins(prev => [...importedData, ...prev]);
                    showNotification('Admins imported successfully!');
                } else {
                    showNotification('Invalid import file format', 'error');
                }
            } catch (error) {
                showNotification('Error importing file', 'error');
            }
        };
        reader.readAsText(file);
    };

    // Calculate password strength
    const calculatePasswordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        return strength;
    };

    return (
        <div className="superadmin-dashboard">
            {/* Notification */}
            {notification && (
                <div className={`notification notification-${notification.type}`}>
                    <i className={`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                    {notification.message}
                    <button className="notification-close" onClick={() => setNotification(null)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}

            {/* Header */}
            <header className="superadmin-header">
                <div className="header-content">
                    <div className="header-title">
                        <i className="fas fa-shield-alt"></i>
                        <div>
                            <h1>SuperAdmin Dashboard</h1>
                            <p className="header-subtitle">Manage all administrator accounts</p>
                        </div>
                    </div>
                    <div className="header-info">
                        <div className="header-stat">
                            <i className="fas fa-users"></i>
                            <span>{admins.length} Admins</span>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={exportAdmins}>
                        <i className="fas fa-download"></i>
                        Export
                    </button>
                    <label className="btn btn-outline">
                        <i className="fas fa-upload"></i>
                        Import
                        <input 
                            type="file" 
                            accept=".json"
                            onChange={importAdmins}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <a href="index.html" className="logout-link">
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                </div>
            </header>

            <main className="superadmin-main">
                {/* Stats Overview */}
                <div className="stats-overview">
                    <div className="stat-card stat-total">
                        <div className="stat-icon">
                            <i className="fas fa-user-shield"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalAdmins}</h3>
                            <p>Total Admins</p>
                        </div>
                    </div>
                    <div className="stat-card stat-active">
                        <div className="stat-icon">
                            <i className="fas fa-user-check"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.activeAdmins}</h3>
                            <p>Active Admins</p>
                        </div>
                    </div>
                    <div className="stat-card stat-full">
                        <div className="stat-icon">
                            <i className="fas fa-crown"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.fullAdmins}</h3>
                            <p>Full Admins</p>
                        </div>
                    </div>
                    <div className="stat-card stat-inactive">
                        <div className="stat-icon">
                            <i className="fas fa-user-slash"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.inactiveAdmins}</h3>
                            <p>Inactive Admins</p>
                        </div>
                    </div>
                </div>

                {/* Admin Management Section */}
                <section className="section">
                    <div className="section-header">
                        <div className="section-header-content">
                            <h2>
                                <i className="fas fa-user-cog"></i>
                                Admin Management
                            </h2>
                            <p className="section-subtitle">Manage administrator accounts, roles, and permissions</p>
                        </div>
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                        >
                            <i className="fas fa-plus"></i>
                            Add New Admin
                        </button>
                    </div>

                    {/* Filters and Search */}
                    <div className="management-toolbar">
                        <div className="search-container">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search admins by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    className="search-clear"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                        <div className="filter-group">
                            <div className="filter-select-wrapper">
                                <i className="fas fa-user-tag filter-icon"></i>
                                <select 
                                    className="filter-select"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Full Admin">Full Admin</option>
                                    <option value="Library Admin">Library Admin</option>
                                    <option value="Student Admin">Student Admin</option>
                                    <option value="Content Admin">Content Admin</option>
                                    <option value="Report Admin">Report Admin</option>
                                </select>
                            </div>
                            <div className="filter-select-wrapper">
                                <i className="fas fa-circle filter-icon"></i>
                                <select 
                                    className="filter-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Admins Table */}
                    <div className="table-container">
                        <table className="admins-table">
                            <thead>
                                <tr>
                                    <th>Admin</th>
                                    <th>Contact</th>
                                    <th>Role & Permissions</th>
                                    <th>Status</th>
                                    <th>Activity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAdmins.length > 0 ? (
                                    filteredAdmins.map(admin => (
                                        <tr key={admin.id} className={`admin-row ${admin.status.toLowerCase()}`}>
                                            <td>
                                                <div className="admin-info">
                                                    <div className="admin-avatar">
                                                        {admin.role === 'Full Admin' ? (
                                                            <i className="fas fa-crown"></i>
                                                        ) : (
                                                            <i className="fas fa-user-shield"></i>
                                                        )}
                                                    </div>
                                                    <div className="admin-details">
                                                        <strong>{admin.name}</strong>
                                                        <small>ID: {admin.id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contact-info">
                                                    <div className="email">
                                                        <i className="fas fa-envelope"></i>
                                                        {admin.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="role-permissions">
                                                    <span className="role-badge">{admin.role}</span>
                                                    <div className="permissions-preview">
                                                        {admin.permissions?.slice(0, 2).map((perm, index) => (
                                                            <span key={index} className="permission-tag">
                                                                {perm}
                                                            </span>
                                                        ))}
                                                        {admin.permissions?.length > 2 && (
                                                            <span className="permission-more">
                                                                +{admin.permissions.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="status-container">
                                                    <span className={`status-badge status-${admin.status.toLowerCase()}`}>
                                                        <i className={`fas fa-circle${admin.status === 'Active' ? '' : '-slash'}`}></i>
                                                        {admin.status}
                                                    </span>
                                                    <button 
                                                        className="btn-status-toggle"
                                                        onClick={() => handleStatusToggle(admin.id)}
                                                        title={`Toggle ${admin.status === 'Active' ? 'Inactive' : 'Active'}`}
                                                    >
                                                        <i className={`fas fa-toggle-${admin.status === 'Active' ? 'on' : 'off'}`}></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="activity-info">
                                                    <div className="last-login">
                                                        <i className="fas fa-sign-in-alt"></i>
                                                        Last: {admin.lastLogin}
                                                    </div>
                                                    <div className="created-at">
                                                        <i className="fas fa-calendar-plus"></i>
                                                        Created: {admin.createdAt}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn-action btn-view"
                                                        onClick={() => setSelectedAdmin(admin)}
                                                        title="View Details"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button 
                                                        className="btn-action btn-edit"
                                                        onClick={() => handleEdit(admin)}
                                                        title="Edit Admin"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="btn-action btn-reset"
                                                        onClick={() => setShowResetConfirm(admin.id)}
                                                        title="Reset Password"
                                                    >
                                                        <i className="fas fa-key"></i>
                                                    </button>
                                                    <button 
                                                        className="btn-action btn-danger"
                                                        onClick={() => setShowDeleteConfirm(admin.id)}
                                                        title="Delete Admin"
                                                        disabled={admins.length <= 1}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="empty-table">
                                            <div className="empty-state">
                                                <i className="fas fa-user-shield"></i>
                                                <h3>No Admins Found</h3>
                                                <p>Try adjusting your filters or add a new admin</p>
                                                <button 
                                                    className="btn btn-primary"
                                                    onClick={() => setShowModal(true)}
                                                >
                                                    <i className="fas fa-plus"></i>
                                                    Add New Admin
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="table-summary">
                        <div className="summary-left">
                            Showing <strong>{filteredAdmins.length}</strong> of <strong>{admins.length}</strong> admins
                        </div>
                        <div className="summary-right">
                            <div className="summary-stats">
                                <span className="stat-indicator active">
                                    <i className="fas fa-circle"></i>
                                    Active: {stats.activeAdmins}
                                </span>
                                <span className="stat-indicator inactive">
                                    <i className="fas fa-circle"></i>
                                    Inactive: {stats.inactiveAdmins}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Add/Edit Admin Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <i className="fas fa-user-plus"></i>
                                {editingId ? 'Edit Admin' : 'Add New Admin'}
                            </h2>
                            <button className="close-modal" onClick={resetForm}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-section">
                                    <h3>
                                        <i className="fas fa-id-card"></i>
                                        Basic Information
                                    </h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="name">
                                                <i className="fas fa-user"></i> Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className="form-control"
                                                placeholder="Enter admin's full name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                <i className="fas fa-envelope"></i> Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="admin@university.edu"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>
                                        <i className="fas fa-user-tag"></i>
                                        Role & Status
                                    </h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="role">
                                                <i className="fas fa-user-tag"></i> Role
                                            </label>
                                            <select
                                                id="role"
                                                name="role"
                                                className="form-control"
                                                value={formData.role}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Full Admin">Full Admin (All Permissions)</option>
                                                <option value="Library Admin">Library Admin</option>
                                                <option value="Student Admin">Student Admin</option>
                                                <option value="Content Admin">Content Admin</option>
                                                <option value="Report Admin">Report Admin</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="status">
                                                <i className="fas fa-circle"></i> Status
                                            </label>
                                            <select
                                                id="status"
                                                name="status"
                                                className="form-control"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Suspended">Suspended</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>
                                        <i className="fas fa-shield-alt"></i>
                                        Permissions
                                    </h3>
                                    <div className="permissions-grid">
                                        {allPermissions.map(permission => {
                                            const isDisabled = formData.role !== 'Full Admin' && permission.id === 'all';
                                            return (
                                                <div 
                                                    key={permission.id} 
                                                    className={`permission-item ${
                                                        formData.permissions.includes(permission.id) ? 'selected' : ''
                                                    } ${isDisabled ? 'disabled' : ''}`}
                                                    onClick={() => !isDisabled && handlePermissionToggle(permission.id)}
                                                >
                                                    <div className="permission-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.permissions.includes(permission.id)}
                                                            onChange={() => {}}
                                                            disabled={isDisabled}
                                                        />
                                                    </div>
                                                    <div className="permission-content">
                                                        <strong>{permission.label}</strong>
                                                        <small>{permission.description}</small>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>
                                        <i className="fas fa-key"></i>
                                        {editingId ? 'Change Password' : 'Set Password'}
                                    </h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="password">
                                                <i className="fas fa-key"></i> 
                                                {editingId ? 'New Password (leave blank to keep current)' : 'Password *'}
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                className="form-control"
                                                placeholder={editingId ? "Enter new password if changing" : "Create a strong password"}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required={!editingId}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword">
                                                <i className="fas fa-key"></i> Confirm Password *
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                className="form-control"
                                                placeholder="Confirm the password"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                required={!editingId}
                                            />
                                        </div>
                                    </div>
                                    {formData.password && (
                                        <div className="password-strength">
                                            <div className="strength-meter">
                                                <div 
                                                    className="strength-bar"
                                                    style={{ width: `${calculatePasswordStrength(formData.password)}%` }}
                                                ></div>
                                            </div>
                                            <small>
                                                Password strength: 
                                                <span className="strength-text">
                                                    {calculatePasswordStrength(formData.password) < 50 ? ' Weak' : 
                                                     calculatePasswordStrength(formData.password) < 75 ? ' Fair' : ' Strong'}
                                                </span>
                                            </small>
                                        </div>
                                    )}
                                    <div className="password-requirements">
                                        <small>
                                            <i className="fas fa-info-circle"></i>
                                            Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={resetForm}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save"></i>
                                    {editingId ? 'Update Admin' : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Admin Details Modal */}
            {selectedAdmin && (
                <div className="modal-overlay" onClick={() => setSelectedAdmin(null)}>
                    <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <i className="fas fa-user-shield"></i>
                                Admin Details
                            </h2>
                            <button className="close-modal" onClick={() => setSelectedAdmin(null)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="admin-details">
                                <div className="admin-profile">
                                    <div className="admin-avatar large">
                                        {selectedAdmin.role === 'Full Admin' ? (
                                            <i className="fas fa-crown"></i>
                                        ) : (
                                            <i className="fas fa-user-shield"></i>
                                        )}
                                    </div>
                                    <div className="admin-info">
                                        <h3>{selectedAdmin.name}</h3>
                                        <p className="admin-email">{selectedAdmin.email}</p>
                                        <div className="admin-status">
                                            <span className={`status-badge status-${selectedAdmin.status.toLowerCase()}`}>
                                                {selectedAdmin.status}
                                            </span>
                                            <span className="role-badge">{selectedAdmin.role}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <i className="fas fa-id-card"></i>
                                        <div>
                                            <label>Admin ID</label>
                                            <p>{selectedAdmin.id}</p>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-calendar-check"></i>
                                        <div>
                                            <label>Last Login</label>
                                            <p>{selectedAdmin.lastLogin}</p>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-calendar-plus"></i>
                                        <div>
                                            <label>Account Created</label>
                                            <p>{selectedAdmin.createdAt}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="permissions-section">
                                    <h4>
                                        <i className="fas fa-shield-alt"></i>
                                        Permissions
                                    </h4>
                                    <div className="permissions-list">
                                        {selectedAdmin.permissions?.map(permission => {
                                            const perm = allPermissions.find(p => p.id === permission);
                                            return perm ? (
                                                <div key={permission} className="permission-detail">
                                                    <i className="fas fa-check-circle"></i>
                                                    <div>
                                                        <strong>{perm.label}</strong>
                                                        <small>{perm.description}</small>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-primary"
                                onClick={() => {
                                    handleEdit(selectedAdmin);
                                    setSelectedAdmin(null);
                                }}
                            >
                                <i className="fas fa-edit"></i>
                                Edit Admin
                            </button>
                            <button 
                                className="btn btn-outline"
                                onClick={() => {
                                    setShowResetConfirm(selectedAdmin.id);
                                    setSelectedAdmin(null);
                                }}
                            >
                                <i className="fas fa-key"></i>
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-icon danger">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3>Delete Admin</h3>
                        <p>Are you sure you want to delete this admin? This action cannot be undone.</p>
                        <div className="confirm-actions">
                            <button 
                                className="btn btn-outline"
                                onClick={() => setShowDeleteConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={() => handleDelete(showDeleteConfirm)}
                            >
                                <i className="fas fa-trash"></i>
                                Delete Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Confirmation Modal */}
            {showResetConfirm && (
                <div className="modal-overlay" onClick={() => setShowResetConfirm(null)}>
                    <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-icon warning">
                            <i className="fas fa-key"></i>
                        </div>
                        <h3>Reset Password</h3>
                        <p>Send password reset email to this admin?</p>
                        <div className="confirm-actions">
                            <button 
                                className="btn btn-outline"
                                onClick={() => setShowResetConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-warning"
                                onClick={() => handleResetPassword(showResetConfirm)}
                            >
                                <i className="fas fa-paper-plane"></i>
                                Send Reset Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;