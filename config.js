const config = {
  mail: {
    subject: 'Сообщение с сайта',
    smtp: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'webinar.loftschool@gmail.com',
        pass: ''
      }
    }
  },
  session: {
    secret: 'keyboard cat',
    name: 'key',
    cookie: {
      path: '/',
      secure: false,
      httpOnly: true,
      maxAge: null
    },
    saveUninitialized: false,
    resave: false
  },
  server: {
    port: process.env.PORT || 3001
  }
};

module.exports = config;
