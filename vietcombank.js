const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchExchangeRates() {
  try {
    const url = 'https://api.tygia.com/vcb?currency=usd,eur&format=json';
    const res = await axios.get(url);

    const data = {
      date: new Date().toISOString(),
      rates: {}
    };

    res.data.forEach((entry) => {
      const code = entry.currency.toUpperCase();
      data.rates[code] = {
        buy: entry.buy,
        sell: entry.transfer // hoặc entry.sell tuỳ nhu cầu
      };
    });

    // Tạo thư mục nếu chưa có
    const dirPath = path.join(__dirname, 'data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    // Lưu file theo ngày
    const dateStr = new Date().toISOString().slice(0, 10);
    const filePath = path.join(dirPath, `tygia-${dateStr}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`✔️ Đã lưu tỷ giá USD & EUR từ API (tygia.com)`);
    return data;
  } catch (err) {
    console.error('❌ Lỗi khi lấy dữ liệu từ API:', err.message);
  }
}

module.exports = fetchExchangeRates;
