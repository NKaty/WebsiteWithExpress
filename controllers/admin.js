const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

module.exports.isAdmin = function (req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/');
};

module.exports.getAdmin = function (req, res) {
  res.render('pages/admin');
};

module.exports.uploadImage = function (db) {
  return function (req, res, next) {
    let form = new formidable.IncomingForm();
    let upload = path.join(process.cwd(), 'public', 'upload');
    let fileName;
    if (!fs.existsSync(upload)) {
      fs.mkdirSync(upload);
    }
    form.uploadDir = upload;
    form.parse(req, function (err, fields, files) {
      if (err) {
        return next(err);
      }
      if (files.photo.name === '' || files.photo.size === 0) {
        return res.render('pages/admin',
          {msgfile: 'Вы не указали файл для загрузки!', status: 'Error'});
      }
      if (!fields.name) {
        fs.unlink(files.photo.path);
        return res.render('pages/admin',
          {msgfile: 'Вы не указали описание товара!', status: 'Error'});
      }

      if (!fields.price) {
        fs.unlink(files.photo.path);
        return res.render('pages/admin',
          {msgfile: 'Вы не указали цену товара!', status: 'Error'});
      }

      fileName = path.join(upload, files.photo.name);

      fs.rename(files.photo.path, fileName, function (err) {
        console.log(files.photo.path);
        console.log(fileName);
        if (err) {
          console.error(err);
          fs.unlink(fileName);
          fs.rename(files.photo.path, fileName);
        }
        // let dir = fileName.substr(fileName.indexOf('\\'));
        // db.set(fields.name, dir);
        // db.save();
        // res.redirect('/?msg=Картинка успешно загружена');
      });
    });
  };
};
