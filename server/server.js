const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// In-memory database (임시 데이터베이스)
let documents = [];
let nextId = 1;

// CORS 설정
app.use(cors());
app.use(express.json());

// 업로드 폴더 확인 및 생성
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// 업로드된 파일에 접근할 수 있도록 static 폴더로 설정
app.use('/uploads', express.static(uploadsDir));


// Multer 저장소 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 파일이 저장될 경로
    },
    filename: function (req, file, cb) {
        // 파일 이름 중복을 피하기 위해 타임스탬프를 추가
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// 파일 업로드 API 엔드포인트
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('파일이 업로드되지 않았습니다.');
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // 새 문서 객체 생성
    const newDocument = {
        id: nextId++,
        title: req.body.title,
        description: req.body.description,
        fileURL: fileUrl,
        fileName: req.file.originalname,
        authorUid: req.body.authorUid,
        authorName: req.body.authorName || '익명',
        authorEmail: req.body.authorEmail,
        createdAt: new Date(),
    };

    documents.push(newDocument);
    console.log('새 문서가 추가되었습니다:', newDocument);

    // 지금은 간단히 성공 메시지와 파일 정보를 반환합니다.
    res.status(200).json({
        message: '파일이 성공적으로 업로드되었습니다.',
        fileInfo: newDocument
    });
});

// 문서 목록을 가져오는 API 엔드포인트
app.get('/documents', (req, res) => {
    // 최신 순으로 정렬하여 반환
    const sortedDocuments = [...documents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(sortedDocuments);
});

// 특정 문서를 가져오는 API 엔드포인트
app.get('/documents/:id', (req, res) => {
    const documentId = parseInt(req.params.id, 10);
    const document = documents.find(doc => doc.id === documentId);

    if (document) {
        res.status(200).json(document);
    } else {
        res.status(404).send('문서를 찾을 수 없습니다.');
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
}); 