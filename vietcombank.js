const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchExchangeRates() {
  try {
    const url = 'https://www.vietcombank.com.vn/exchangerates/';
    const res = await axios.get(url);
    const html = res.data;

    const currencies = ['USD', 'EUR'];
    const data = {
      date: new Date().toISOString(),
      rates: {}
    };

    for (const currency of currencies) {
      const regex = new RegExp(
        `<td>${currency}<\\/td>\\s*<td[^>]*>(.*?)<\\/td>\\s*<td[^>]*>(.*?)<\\/td>`,
        'i'
      );
      const match = html.match(regex);

      if (match) {
        const buy = match[1].trim();
        const sell = match[2].trim();
        data.rates[currency] = { buy, sell };
      } else {
        console.warn(`⚠️ Không tìm thấy tỷ giá cho ${currency}`);
      }
    }

    // Tạo thư mục nếu chưa có
    const dirPath = path.join(__dirname, 'data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    // Ghi file JSON theo ngày
    const dateStr = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    const filepath = path.join(dirPath, `tygia-${dateStr}.json`);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

    console.log(`✔️ Đã lưu tỷ giá USD và EUR ngày ${dateStr}`);
    return data;
  } catch (err) {
    console.error('❌ Lỗi khi lấy tỷ giá:', err.message);
  }
}

module.exports = fetchExchangeRates;
