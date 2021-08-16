-- brew install postgresql
-- brew services start postgresql
-- psql postgres
-- show all users: \du
-- quit current session: \q
-- rejoin an instance: psql postgres -U smile.ran
-- create database: CREATE DATABASE db;
-- list db: \l
-- sudo -u postgres psql < schema.sql
-- select a database: \c testdb;
-- show tables: \dt+;
-- DROP TABLE table_name;
-- Show data in table: TABLE mytable;

CREATE TABLE products (
  id INT PRIMARY KEY NOT NULL,
  name VARCHAR(50) NOT NULL,
  slogan VARCHAR(200),
  description VARCHAR(1000),
  category VARCHAR(50),
  default_price INT
);

CREATE TABLE styles(
  id INT PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(100),
  sale_price VARCHAR (10),
  original_price INT NOT NULL,
  default_style INT
);

CREATE TABLE features(
  id INT PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  feature VARCHAR(50),
  value VARCHAR(50)
);

CREATE TABLE photos(
  id INT,
  style_id INT,
  url VARCHAR(2000),
  thumbnail_url VARCHAR
);

CREATE TABLE skus(
  id INT PRIMARY KEY NOT NULL,
  style_id INT NOT NULL,
  size VARCHAR(20),
  quantity INT
);

CREATE TABLE related(
  id INT PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  related_product_id INT
);


-- COPY products(id, name, slogan, description, category, default_price) FROM '/Users/smile.ran/HackReactor/Week8/products_api_data/product.csv' DELIMITER ',' CSV HEADER;
-- COPY features FROM '/Users/smile.ran/HackReactor/Week8/products_api_data/features.csv' DELIMITER ',' CSV HEADER;
-- COPY styles FROM '/Users/smile.ran/HackReactor/Week8/products_api_data/styles.csv' DELIMITER ',' CSV HEADER;
-- COPY photos FROM '/Users/smile.ran/HackReactor/Week8/products_api_data/photos.csv' DELIMITER ',' CSV HEADER;
-- COPY skus FROM '/Users/smile.ran/HackReactor/Week8/products_api_data/skus.csv' DELIMITER ',' CSV HEADER;
-- COPY related FROM '/Users/smile.ran/HackReactor/Week8/products_api_data/related.csv' DELIMITER ',' CSV HEADER;
-- CREATE INDEX on skus (style_id);
-- CREATE INDEX on photos (style_id);
-- CREATE INDEX on styles (product_id);
-- CREATE INDEX on styles (id);
-- CREATE INDEX on products (id);
-- CREATE INDEX on features (product_id);