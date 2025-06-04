const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchExchangeRate() {
  try {
    const url = 'https://www.vietcombank.com.vn/exchangerates/';
    const res = await axios.get(url);
    const html = res.data;

    // Tìm tỷ giá USD bằng regex (có thể thay bằng cheerio nếu muốn)
    const usdRegex = /<td>USD<\/td>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/i;
    const match = html.match(usdRegex);

    if (!match) throw new Error('Không tìm thấy tỷ giá USD');

    const buyRate = match[1].trim();
    const sellRate = match[2].trim();

    const data = {
      date: new Date().toISOString(),
      currency: 'USD',
      buy: buyRate,
      sell: sellRate,
    };

    // Tạo thư mục nếu chưa có
    const dirPath = path.join(__dirname, 'data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    // Ghi file theo ngày
    const dateStr = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    const filepath = path.join(dirPath, `tygia-${dateStr}.json`);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

    console.log(`✔️ Đã lưu tỷ giá USD ngày ${dateStr}`);
    return data;
  } catch (err) {
    console.error('❌ Lỗi khi lấy tỷ giá:', err.message);
  }
}

module.exports = fetchExchangeRate;
