const { Pool } = require('pg');

const pool = new Pool({
  user: 'smile.ran',
  host: 'localhost',
  database: 'sdc',
  password: '',
  port: 5432,
})

pool.connect()
    .then(() => { console.log('connected to postgres') })
    .catch(err => console.log('error connecting to postgres'));

var getAll = () => {
      return pool.query(
          `SELECT * FROM products limit 5`)
          .then((results) => {
              return results.rows;
            })
          .catch((err) => {
            throw new Error('Error get data from server');
          });
};

var productFeatureQuery = (product_id) => {
  var query = `SELECT products.*, features.id as featureid, features.product_id as productid, features.feature, features.value FROM products LEFT JOIN features ON products.id = features.product_id WHERE products.id = ${product_id}`;
  return pool.query(
    query)
    .then((results) => {
        //console.log("db:", results);
        return results.rows;
      })
    .catch((err) => {
      throw new Error('Error productFeatureQuery');
    });

}
var productQuery = (product_id) => {
  //console.log("query db!")
  return pool.query(
      `SELECT * FROM products WHERE id=${product_id}`)
      .then((results) => {
          //console.log("db:", results);
          return results.rows;
        })
      .catch((err) => {
        throw new Error('Error get data from server');
      });
};

var featuresQuery = (product_id) => {
  return pool.query(
    `SELECT * FROM features WHERE product_id=${product_id}`)
    .then((results) => {
        //console.log("db:", results);
        return results;
      })
    .catch((err) => {
      throw new Error('Error get data from server');
    });
}

var stylesQueryOpt = (product_id) => {
  // var buildObj = 'json_agg(json_build_object("thumbnail_url", photos.thumbnail_url, "url", photos.url)) AS photos';

  var myQuery = `SELECT styles.id as styleid, styles.name as style_name, styles.sale_price, styles.original_price, styles.default_style, photos.url as url, photos.thumbnail_url as thumbnail_url FROM styles LEFT JOIN photos ON styles.id = photos.style_id WHERE styles.product_id = ${product_id}`;

  var skuQuery = 'SELECT * from skus WHERE style_id = 1';
  return pool.query(
    myQuery
  ).then((results) => {
    //console.log("stylesQueryQpt: result:", results.rows);
    return results.rows;
  }).catch((err) => {
    throw new Error('Error in stylesQueryOpt: err:', err);
  })
}

var stylesSkuQuery = (product_id) => {

  var myQuery = `SELECT styles.id as styleid, skus.id as skuId, skus.size, skus.quantity FROM styles LEFT JOIN skus ON styles.id = skus.style_id WHERE styles.product_id = ${product_id}`;

  //console.log("stylesSkuQuery: myQuery:", myQuery);
  return pool.query(
    myQuery
  ).then((results) => {
    //console.log("stylesQueryQpt: result:", results.rows);
    return results.rows;
  }).catch((err) => {
    throw new Error('Error in stylesSkuQuery: err:', err);
  })
}

var stylesQuery = (product_id) => {
  return pool.query(
    `SELECT * FROM styles WHERE product_id=${product_id}`)
    .then((results) => {
        //console.log("db:", results);
        return results.rows;
      })
    .catch((err) => {
      throw new Error('Error get data from server');
    });
}

var photosQuery = (style_id) => {
  return pool.query(
    `SELECT * FROM photos WHERE style_id=${style_id}`)
    .then((results) => {
        //console.log("db:", results.rows);
        return results.rows;
      })
    .catch((err) => {
      throw new Error('Error get data from server');
    });
}

var skusQuery = (style_id) => {
  return pool.query(
    `SELECT * FROM skus WHERE style_id=${style_id}`)
    .then((results) => {
        //console.log("db:", results);
        return results.rows;
      })
    .catch((err) => {
      throw new Error('Error get data from server');
    });
}

var relatedQuery = (product_id) => {
  return pool.query(
    `SELECT * FROM related WHERE product_id=${product_id}`)
    .then((results) => {
        //console.log("db:", results);
        return results.rows;
      })
    .catch((err) => {
      throw new Error('Error get data from server');
  });
}

module.exports = {
  getAll: getAll,
  productQuery: productQuery,
  featuresQuery: featuresQuery,
  stylesQuery: stylesQuery,
  photosQuery: photosQuery,
  skusQuery: skusQuery,
  relatedQuery: relatedQuery,
  stylesQueryOpt: stylesQueryOpt,
  stylesSkuQuery: stylesSkuQuery,
  productFeatureQuery: productFeatureQuery,
}
