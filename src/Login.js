import React, { useState, useEffect } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import './Login.css';

function Login() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                if (currentUser.email.endsWith('@dshs.kr')) {
                    setUser(currentUser);
                    setError('');
                } else {
                    setError('dshs.kr 계정으로만 로그인할 수 있습니다.');
                    signOut(auth); // 자동 로그아웃
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = () => {
        setError('');
        signInWithPopup(auth, provider)
            .catch((err) => {
                setError(`로그인 중 오류가 발생했습니다: ${err.message}`);
                console.error(err);
            });
    };

    const handleLogout = () => {
        signOut(auth);
    };

    return (
        <div className="login-container">
            <h1>DSHS DBPIA</h1>
            {user ? (
                <div id="user-info">
                    <p><span id="user-name">{user.displayName}</span>님, 환영합니다.</p>
                    <p>이메일: <span id="user-email">{user.email}</span></p>
                    <button id="logout-button" onClick={handleLogout}>로그아웃</button>
                </div>
            ) : (
                <button id="login-button" onClick={handleLogin}>Google 계정으로 로그인</button>
            )}
            {error && <p id="error-message" className="error-message">{error}</p>}
        </div>
    );
}

export default Login; 