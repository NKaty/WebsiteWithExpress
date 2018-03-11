module.exports.getLogin = function (req, res) {
  res.render('pages/login');
};

module.exports.signUp = function (req, res) {
  const username = req.body.email;
  const password = req.body.password;

};
