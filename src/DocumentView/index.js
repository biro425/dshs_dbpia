import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './DocumentView.css';

function DocumentView() {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getDocument = async () => {
            try {
                const docRef = doc(db, "documents", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setDocument(docSnap.data());
                } else {
                    setError("문서를 찾을 수 없습니다.");
                }
            } catch (err) {
                setError("문서를 불러오는 중 오류가 발생했습니다.");
                console.error(err);
            }
            setLoading(false);
        };

        getDocument();
    }, [id]);

    if (loading) {
        return <div className="loading-container">문서 정보를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="document-view-container">
            {document && (
                <>
                    <h1>{document.title}</h1>
                    <div className="document-meta">
                        <p><strong>작성자:</strong> {document.authorName}</p>
                        <p><strong>작성일:</strong> {document.createdAt?.toDate().toLocaleDateString()}</p>
                    </div>
                    <p className="document-description">{document.description}</p>
                    
                    <div className="file-viewer">
                        {document.fileURL.toLowerCase().includes('pdf') ? (
                            <iframe src={document.fileURL} title={document.title} width="100%" height="800px"></iframe>
                        ) : (
                            <a href={document.fileURL} target="_blank" rel="noopener noreferrer">
                                파일 다운로드: {document.fileName}
                            </a>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default DocumentView; 