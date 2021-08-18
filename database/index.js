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

// var stylesQueryOpt2 = (product_id) => {
//   SELECT
// // my main table that has product id & result
//   styles.product_id,
//     json_agg(
//       json_build_object(
//         'style_id', styles.id,
//         'name', styles.name,
//         'original_price', styles.original_price,
//         'sale_price', styles.sale_price,
//         'default?', styles.default_style,
// // Here, I used my pre-made photosId.photos and skusId.skus so I can avoid using json_agg inside of json_agg
//     'photos', photosId.photos,
//     'skus', skusId.skus
//       )
//     ) AS results
//   FROM styles
// // Here, I created my first pre-made objects in Array
//   INNER JOIN(
// // There are two lines in select which is style_id and photos. I'm going going to call photos to the main table. style_id only exist because I am going to need to group this by style_id & call only style_id that I need after ON.
//     SELECT photos.style_id,
// // creating my photos (obj in arr)
//       json_agg(
//         json_build_object(
//           'thumbnail_url', photos.thumbnail_id,
//           'url', photos.url
//         )
//       ) AS photos
//     FROM photos
// // group it by style_id
//     GROUP BY photos.style_id
// // only find rows that matches my style_id with styles.id and name my whole table photosId so I can call it in main table
//     ) AS photosId ON photosId.style_id = styles.id
//   INNER JOIN(
// // creating my obj in obj table. I am also going to write two elements which is style_id and obj in obj called skus
//     SELECT skus.style_id,
//       json_object_agg(
//         skus.id,
//         json_build_object(
//           'quantity', skus.quantity,
//           'size', skus.size
//         )
//       ) AS skus
//       FROM skus
// // group it by style_id
//       GROUP BY skus.style_id
// // name whole table as skusId and only allow rows that matchs style_id with styles.id
//   ) AS skusId ON skusId.style_id = styles.id
// // only find rows that matches product_id
//   WHERE styles.product_id = ${product_id}
// // Group whole table by styles.product_id so I only have 1 table with all the matching product_id
//   GROUP BY styles.product_id
// }

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
