const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
//const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config.json');

const login = require('./controllers/login');
const admin = require('./controllers/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
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

async function connectDb () {
  const db = await low(adapter);
  // admin@admin - для того, чтоб попасть на страницу админки (и никто другой под этим именем не зарегистрировался)
  db.defaults({ users:
      [{name: 'admin@admin', password: 'sha1$8f53e4db$1$55f19543380d2775c86c51f6cd1a7e98e3cbc31d'}] }).write();

  app.post('/login', login.signUp(db));

  app.post('/admin/upload', admin.uploadImage(db));

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
  });
}

connectDb().then(() => {
  app.listen(3001, () => console.log('listening on port 3001'));
});

// app.listen(3001);

module.exports = app;
