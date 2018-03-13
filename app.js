const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
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
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  console.log(1111);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  err.status = err.status || 500;
  // render the error page
  res.status(err.status);
  res.render('pages/error');
});

app.listen(config.server.port, () => console.log(`listening on port ${config.server.port}`));

module.exports = app;
