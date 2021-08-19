require('newrelic');
const express = require('express');
//const morgan = require('morgan');
const compression = require('compression');
//const productQuery = require('./database/index');
const database =require('./database');
//const router = require('./routes');

const app = express();
module.exports.app = app;

const PORT = 3000;

const {loaderioKey} = require('./database/index.js');

app.set('port', PORT);

app.use(compression());
//app.use(morgan('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use('/', router);
//app.use(express.static(`${__dirname}/../client/dist`));

app.get (`/${loaderioKey}`, (req, res) => {
  res.send(loaderioKey);
});

app.get('/products', (req, res) => {
  database.getAll()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.sendStatus(404)
    });
})

productQueryFuncOpt = (req, res) => {
  var product_id = req.params.product_id;
  productObj = {};
  database.productFeatureQuery(product_id)
  .then((queryRes) => {
    //console.log("queryRes:", queryRes);
    if (queryRes.length === 0) {
      return productObj;
    }
    productObj.id = queryRes[0].productid;
    productObj.name = queryRes[0].name;
    productObj.slogan = queryRes[0].slogan;
    productObj.description = queryRes[0].description;
    productObj.category = queryRes[0].category;
    productObj.default_price = queryRes[0].default_price;
    var features = [];
    for (var i = 0; i < queryRes.length; i++) {
      var fea = {};
      fea.feature = queryRes[i].feature;
      fea.value = queryRes[i].value;
      features.push(fea);
    }
    productObj.features = features;
    res.send(productObj);
  })
};

productQueryFunc = (req, res) => {
  var productObj = {};
  Promise.all([
    database.productQuery(req.params.product_id)
      .then((results) => {
        //console.log("result", results);
        productObj.id = results[0].id;
        productObj.name = results[0].name;
        productObj.slogan = results[0].slogan;
        productObj.description = results[0].description;
        productObj.category = results[0].category;
        productObj.default_price = results[0].default_price;
    }),
    database.featuresQuery(892804)
      .then((results) => {
        //console.log(results.rows);
        productObj.features = results.rows
      })
  ])
    .then(() => {
      //console.log("productObj: ", productObj);
      res.send(productObj);
    })
    .catch((err) => {
      res.sendStatus(404)
    });

};
app.get('/products/:product_id', productQueryFunc)

myStylesFunc = (req, res) => {
  var stylesObj = {};
  database.stylesQuery(1)
  .then((results) => {
    stylesObj.product_id = 1;
    stylesObj.results = results;
    //console.log("stylesObj: ", stylesObj);
    return stylesObj;
  })
  .then((stylesObj) => {
    return Promise.all(
      stylesObj.results.map((item) => {
        return database.photosQuery(item.id)
          .then((photos) => {
            item.photos = photos;
            return item;
          })
          .then(() => {
            return database.skusQuery(item.product_id).then((skus) => {
              item.skus = {};
              skus.map((sku) => {
                  item.skus[sku.size] = sku.quantity;
              });
            return item;
            })
          })
  }))
  .then(() => {
    //console.log("stylesObj: ", stylesObj);
    res.send(stylesObj);
  })
  .catch((err) => {
    res.sendStatus(404)
  });
})}

getObjFromStyleSku = (skuRes) => {
  //console.log('skuRes:', skuRes);
  var obj = {};
  for (var i = 0; i < skuRes.length; i++) {
    var val = {};
    val.size = skuRes[i]['size'];
    val.quantity = skuRes[i]['quantity'];
    var skuid = skuRes[i]['skuid'];
    //console.log("skuid:", skuid);
    //console.log("val:", val);
    if (!obj.hasOwnProperty(skuRes[i].styleid)) {
      var skuObj = {};
      skuObj[skuid] = val;
      obj[skuRes[i].styleid] = skuObj;
    } else {
      obj[skuRes[i].styleid][skuid] = val;
    }
  }
  //console.log(obj);
  return obj;
}
getObjFromStylePhoto = (results) => {
  var obj = {};
  for(var i = 0; i < results.length; i++) {
    if (!obj.hasOwnProperty(results[i].styleid)) {
      var val = {};
      val.productName = results[i]['product_name'];
      val.styleName = results[i]['style_name'];
      val.sale_price = results[i]['sale_price'];
      val.original_price = results[i]['original_price'];
      val.default = results[i]['default_style'];
      val.urls = [];
      val.urls.push({
        'thumbnail_url': results[i]['thumbnail_url'],
        'url': results[i]['url'] });
      obj[results[i].styleid] = val;
    } else {
      obj[results[i].styleid].urls.push({
        'thumbnail_url': results[i]['thumbnail_url'],
        'url': results[i]['url'] });
    }
  }
  return obj;
}

getArrayFromStylePhoto = (photoObj) => {
  var myRes = [];
  for (var key in photoObj) {
    var stylesObj = {};
    stylesObj['style_id'] = key;
    stylesObj['name'] = photoObj[key].styleName;
    stylesObj['original_price'] = photoObj[key].original_price;
    stylesObj['sale_price'] = photoObj[key].sale_price;
    stylesObj['default?'] = Boolean(photoObj[key].default);
    stylesObj['photos'] = photoObj[key].urls;

    //stylesObj['sku'] = getSku(key);
    myRes.push(stylesObj);
  }
  return myRes;
}

getArrayFromStylePhotoAndSku = (photoObj, skuObj) => {
  var res = [];
  for (var key in photoObj) {
    var stylesObj = {};
    stylesObj['style_id'] = key;
    stylesObj['name'] = photoObj[key].styleName;
    stylesObj['original_price'] = photoObj[key].original_price;
    stylesObj['sale_price'] = photoObj[key].sale_price;
    stylesObj['default?'] = Boolean(photoObj[key].default);
    stylesObj['photos'] = photoObj[key].urls;
    stylesObj['sku'] = skuObj[key];
    res.push(stylesObj);
  }
  return res;
}
myStylesFuncOpt = (req, res) => {

  database.stylesQueryOpt(req.params.product_id)
  .then((results) => {
    //console.log("myStylesFuncOpt: results:", results)
    var obj = getObjFromStylePhoto(results);
    //console.log("obj: ", obj);
    var myRes = getArrayFromStylePhoto(obj);
    //res.send(myRes);
    return myRes;
  }).then((myRes)=> {
    return Promise.all(
      myRes.map((item) => {
        return database.skusQuery(item['style_id']).then((skus) => {
          item.skus = {};
          skus.map((sku) => {
              item.skus[sku.size] = sku.quantity;
          });

        })
      })
    ).then(()=>{
      res.send(myRes);
    })
  })
  .catch((err) => {
    res.sendStatus(404)
  })
}

myStylesFuncOpt2 = (req, res) => {
  var product_id = req.params.product_id;
  database.stylesQueryOpt(product_id)
  .then((results) => {
    //console.log("myStylesFuncOpt2: results:", results)
    var photoObj = getObjFromStylePhoto(results);
    //console.log("obj: ", obj);
    return photoObj;
  }).then((photoObj)=> {
    //console.log("photoObj:", photoObj);
    return database.stylesSkuQuery(product_id).then(
      (skuRes) => {
        var skuObj = getObjFromStyleSku(skuRes);
        arrRes = getArrayFromStylePhotoAndSku(photoObj, skuObj);
        res.send(arrRes);
      }
    )

  })
  .catch((err) => {
    console.log("myStylesFuncOpt2 failed: err:", err);
    res.sendStatus(404)
  })
}

app.get('/products/:product_id/styles', myStylesFuncOpt2)

app.get('/products/:product_id/related', (req, res) => {
  database.relatedQuery(1)
    .then((results) => {
      //console.log("related: ", results);
      var relatedProdId = results.map((relatedProduct) => {
        return relatedProduct.related_product_id;
    });
      res.send(relatedProdId);
    })
    .catch((error) => {
      res.status(404);
    });
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${PORT}`);
});