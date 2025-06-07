import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Login from './Login/index';
import Main from './Main/index';
import Write from './Write/index';
import DocumentView from './DocumentView/index';
import Header from './Header/index';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email.endsWith('@dshs.kr')) {
        setUser(currentUser);
      } else {
        if (currentUser) {
          // dshs.kr 계정이 아니면 자동 로그아웃
          signOut(auth);
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-container">로딩 중...</div>;
  }

  return (
    <Router>
      {user && <Header user={user} />}
      <div className="App">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={user ? <Main /> : <Navigate to="/login" />} />
          <Route path="/write" element={user ? <Write /> : <Navigate to="/login" />} />
          <Route path="/document/:id" element={user ? <DocumentView /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
