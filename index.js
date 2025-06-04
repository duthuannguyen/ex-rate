const express = require('express');
const cron = require('node-cron');
const fetchExchangeRate = require('./vietcombank');

const app = express();
const PORT = process.env.PORT || 3000;

// Route test
app.get('/', (req, res) => {
  res.send('Tỷ giá Vietcombank đang chạy...');
});

// Cron job: chạy lúc 9h sáng mỗi ngày
cron.schedule('0 9 * * *', () => {
  console.log('⏰ Đang lấy tỷ giá...');
  fetchExchangeRate();
});

// (Tùy chọn) test cron chạy mỗi 1 phút — DÙNG TẠM khi DEV, đừng để PROD
// cron.schedule('* * * * *', () => {
//   console.log('⏰ Test cron mỗi phút...');
//   fetchExchangeRate();
// });

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
