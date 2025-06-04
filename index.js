const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Render! by language Node');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
