const express = require('express');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config');
const HttpError = require('./error/');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(logger('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: config.session.secret,
  name: config.session.name,
  cookie: config.session.cookie,
  saveUninitialized: config.session.saveUninitialized,
  resave: config.session.resave
}));
app.use(express.static(path.join(__dirname, 'public')));

app.all('/', function (req, res, next) {
  console.log(req.session.id);
  next();
});

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new HttpError('Not Found', 404);
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  if (err instanceof HttpError) {
    res.render('pages/error', {error: err});
  } else {
    console.log(err);
    res.status(err.status || 500).json({status: err.status, message: err.message});
  }
});

app.listen(config.server.port, () => console.log(`listening on port ${config.server.port}`));

module.exports = app;
