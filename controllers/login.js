const db = require('../db/db');
const passwordHash = require('password-hash');
const HttpError = require('../error/index');

module.exports.getLogin = function (req, res) {
  res.render('pages/login');
};

module.exports.signUp = function (req, res, next) {
  req.session.regenerate((err) => {
    if (err) {
      console.error(err);
      next(new HttpError('При входе на сайт произошля ошибка', 500));
    }
    const username = req.body.email;
    const password = req.body.password;
    const user = db.get('users')
      .find({name: username})
      .value();
    if (user) {
      if (passwordHash.verify(password, user.password)) {
        if (user.name === 'admin@admin') {
          req.session.isAdmin = true;
          // Можно сразу отправлять админа на страничку админки
          // res.redirect('/admin');
          res.render('pages/login',
            {msglogin: 'Вы успешно вошли на сайт!', status: 'Ok'});
        } else {
          res.render('pages/login',
            {msglogin: 'Вы успешно вошли на сайт!', status: 'Ok'});
        }
      } else {
        res.render('pages/login',
          {msglogin: 'Вы ввели неправильное имя пользователя или пароль!', status: 'Error'});
      }
    } else {
      const hashedPassword = passwordHash.generate(password);
      try {
        db.get('users')
          .push({name: username, password: hashedPassword})
          .write();
        res.render('pages/login',
          {msglogin: 'Вы успешно зарегистрировались на сайте!', status: 'Ok'});
      } catch (err) {
        console.error(err);
        next(new HttpError('При регистрации произошля ошибка', 500));
      }
    }
  });
};
