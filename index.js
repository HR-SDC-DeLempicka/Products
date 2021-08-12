const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const axios = require('axios');

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());

app.get('/products', (req, res) => {
  res.send('hi')
})

app.listen(port,() => {
  console.log(`Listening to Port ${port}`)

});
