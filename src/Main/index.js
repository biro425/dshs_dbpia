import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { db } from '../firebase';
// import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './Main.css';

function Main() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await fetch('http://localhost:3001/documents');
                if (!response.ok) {
                    throw new Error('데이터를 불러오는데 실패했습니다.');
                }
                const data = await response.json();
                setDocuments(data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    if (loading) {
        return <div>문서 목록을 불러오는 중...</div>
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="main-container">
            <h2>문서 목록</h2>
            <div className="document-list">
                {documents.length > 0 ? (
                    documents.map(doc => (
                        <Link to={`/document/${doc.id}`} key={doc.id} className="document-item">
                            <h3>{doc.title}</h3>
                            <p>작성자: {doc.authorName}</p>
                        </Link>
                    ))
                ) : (
                    <p>작성된 문서가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default Main; 