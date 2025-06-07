import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Write.css';

function Write() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !file) {
            setError('제목과 파일은 필수 항목입니다.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            // 1. 파일을 Storage에 업로드
            const fileRef = ref(storage, `documents/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);

            // 2. 업로드된 파일의 URL 가져오기
            const fileURL = await getDownloadURL(fileRef);

            // 3. Firestore에 문서 데이터 저장
            await addDoc(collection(db, 'documents'), {
                title: title,
                description: description,
                fileURL: fileURL,
                fileName: file.name,
                authorUid: auth.currentUser.uid,
                authorName: auth.currentUser.displayName,
                authorEmail: auth.currentUser.email,
                createdAt: serverTimestamp()
            });

            setLoading(false);
            navigate('/'); // 메인 페이지로 이동

        } catch (err) {
            setError('문서 작성 중 오류가 발생했습니다.');
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="write-container">
            <h2>새 문서 작성</h2>
            <form onSubmit={handleSubmit} className="write-form">
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">설명</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="file">파일 첨부</label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? '작성 중...' : '작성 완료'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default Write; 