import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from "firebase/auth";
import './Login.css';

function Login() {
    const [error, setError] = useState('');

    const handleLogin = () => {
        setError('');
        signInWithPopup(auth, provider)
            .catch((err) => {
                // App.js에서 도메인 체크 후 자동 로그아웃 되므로,
                // 여기서는 팝업창을 닫거나 네트워크 에러 등 일반적인 로그인 실패만 처리합니다.
                if (err.code !== 'auth/popup-closed-by-user') {
                    setError(`로그인 중 오류가 발생했습니다: ${err.message}`);
                    console.error(err);
                }
            });
    };

    return (
        <div className="login-container">
            <h1>DSHS DBPIA</h1>
            <button id="login-button" onClick={handleLogin}>Google 계정으로 로그인</button>
            {error && <p id="error-message" className="error-message">{error}</p>}
        </div>
    );
}

export default Login; 