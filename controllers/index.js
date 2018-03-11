const nodemailer = require('nodemailer');
const config = require('../config.json');

module.exports.getIndex = function (req, res) {
  res.render('pages/index');
};

module.exports.sendMessage = function (req, res, next) {
  if (!req.body.name || !req.body.email) {
    return res.render('pages/index',
      { msgemail: 'Поля имя и email должны быть заполнены!',
        status: 'Error',
        anchor: 'form-email',
        fromName: req.body.name || '',
        fromEmail: req.body.email || '',
        messageContent: req.body.message || '' });
  }

  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `${req.body.name} ${req.body.email}`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: req.body.message.trim().slice(0, 500) + `\n Отправлено с: <${req.body.email}>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.render('pages/index',
        { msgemail: `При отправке письма произошла ошибка! ${error}`,
          status: 'Error',
          anchor: 'form-email',
          fromName: req.body.name || '',
          fromEmail: req.body.email || '',
          messageContent: req.body.message || '' });
    }
    res.render('pages/index',
      { msgemail: 'Письмо успешно отправлено!',
        status: 'Ok',
        anchor: 'form-email' });
  });
};
