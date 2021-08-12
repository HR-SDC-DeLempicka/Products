const { Pool } = require('pg');

const pool = new Pool()

var productQuery = (id) => {
  return pool.query(
      `SELECT * FROM products WHERE product_id = 1`, (err, results) {
        
      }
    )
    .then(({ rows }) => {
      console.log(id, );
    })
    .catch((err) => {
      throw new Error('Error get data from server');
    });
};