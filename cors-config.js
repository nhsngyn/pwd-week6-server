// cors-config.js
const getCorsConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // 개발 환경: 로컬 도메인 허용
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  // 프로덕션 환경: 배포 도메인 자동 감지
  if (!isDevelopment) {
    if (process.env.VERCEL_URL) {
      allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
    }
    if (process.env.CLIENT_URL) {
      allowedOrigins.push(process.env.CLIENT_URL);
    }
  }
  
if (process.env.CLIENT_URL) {
      const clientUrl = process.env.CLIENT_URL.replace(/\/$/, ''); // /를 제거
 allowedOrigins.push(clientUrl); }
}
 
 return {
origin: (origin, callback) => {
if (!origin || allowedOrigins.includes(origin)) {
callback(null, true);
} else {
        // [디버깅용] 어떤 주소가 거부되었는지 로그를 남깁니다.
        console.error('CORS 거부됨:');
        console.error('Request Origin:', origin);
        console.error('Allowed Origins:', allowedOrigins);
callback(new Error('Not allowed by CORS'));
}
},
credentials: true,
 };

module.exports = { getCorsConfig };