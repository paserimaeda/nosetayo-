const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const db_config = {
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'b8e2f3babf966d',
  password: '45533c06',
  database: 'heroku_0efb65615c7048a'
};

const connection = mysql.createConnection(db_config);

connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected');
});


app.get('/', (req, res) => {
  res.render('top.ejs');
  connection.release();
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results, fields) => {
      res.render('index.ejs', {items: results});
      connection.release();
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO items (name, reply) VALUES (?, ?)',
    [req.body.itemName, req.body.itemReply],
    (error, results, fields) => {
      res.redirect('/index');
      console.log(req.body.itemName);
      console.log(req.body.itemReply);
      connection.release();
    }
  );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM items WHERE id = ?',
    [req.params.id],
    (error, results,fields) => {
      res.redirect('/index');
      connection.release();
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
      connection.release();
    }
  );
});

app.post('/update/:id', (req, res) => {
  // 選択されたメモを更新する処理を書いてください
  connection.query(
    "UPDATE items SET name=?, reply=? WHERE id = ?",
    [req.body.itemName, req.body.itemReply, req.params.id],
    (error, results) => {
      res.redirect('/index');
      console.log(req.body.itemName);
      console.log(req.body.itemReply);
      connection.release();
    });
  // 以下の一覧画面へリダイレクトする処理を削除してください

});


app.listen(PORT);
