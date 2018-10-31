const nodemailer = require('nodemailer');
const config = require('../config');
const db = require('../db/db');
const HttpError = require('../error/index');

module.exports.getIndex = function (req, res) {
  const products = db.get('products').value();
  const skills = db.get('skills').value();
  res.render('pages/index', { products: products, skills: skills });
};

module.exports.sendMessage = function (req, res, next) {
  const products = db.get('products').value();
  const skills = db.get('skills').value();
  if (!req.body.name || !req.body.email) {
    return res.render('pages/index',
      { msgemail: 'Поля имя и email должны быть заполнены!',
        status: 'Error',
        anchor: 'form-email',
        fromName: req.body.name || '',
        fromEmail: req.body.email || '',
        messageContent: req.body.message || '',
        products: products,
        skills: skills });
  }

  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `${req.body.name} ${req.body.email}`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: req.body.message.trim().slice(0, 500) + `\n Отправлено с: <${req.body.email}>`
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error(err);
      next(new HttpError('При отправке письма произошла ошибка!', 500));
    }
    res.render('pages/index',
      { msgemail: 'Письмо успешно отправлено!',
        status: 'Ok',
        anchor: 'form-email',
        products: products,
        skills: skills });
  });
};
