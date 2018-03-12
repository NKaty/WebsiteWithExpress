const db = require('db');
const passwordHash = require('password-hash');

module.exports.getLogin = function (req, res) {
  res.render('pages/login');
};

module.exports.signUp = function (db) {
  return function (req, res) {
    const regenerateSessionPromise = () => {
      return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) reject(err);
          resolve();
        });
      });
    };

    regenerateSessionPromise()
      .then(() => {
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
              res.redirect('/admin');
              // res.render('pages/login',
              //   {msglogin: 'Вы успешно вошли на сайт!', status: 'Ok'});
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
          db.get('users')
            .push({name: username, password: hashedPassword})
            .write()
            .then(() => res.render('pages/login',
              {msglogin: 'Вы успешно зарегистрировались на сайте!', status: 'Ok'}))
            .catch((err) => res.render('pages/login',
              {msglogin: `При регистрации произошля ошибка. ${err}`, status: 'Error'}));
        }
      })
      .catch((err) => res.render('pages/login',
        {msglogin: `При регистрации произошля ошибка. ${err}`, status: 'Error'}));
  };
};
