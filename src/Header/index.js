import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Header.css';

function Header({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate('/login');
        });
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">DSHS DBPIA</Link>
                <div className="header-nav">
                    <Link to="/write" className="write-button">작성</Link>
                    <div className="user-profile">
                        <span className="user-name">{user.displayName}</span>
                        <button onClick={handleLogout} className="logout-button">로그아웃</button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header; 