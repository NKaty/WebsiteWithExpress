const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../db/db');
const HttpError = require('../error/index');

module.exports.isAdmin = function (req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/');
};

module.exports.getAdmin = function (req, res) {
  res.render('pages/admin');
};

module.exports.updateSkills = function (req, res, next) {
  const age = +req.body.age;
  const concerts = +req.body.concerts;
  const cities = +req.body.cities;
  const years = +req.body.years;
  if (!req.body.age || !req.body.concerts || !req.body.cities || !req.body.years ||
    age < 0 || concerts < 0 || cities < 0 || years < 0) {
    return res.render('pages/admin',
      { msgskill: 'Все поля должны быть заполнены и неотрицательны!',
        status: 'Error',
        ageField: age || '',
        concertsField: concerts || '',
        citiesField: cities || '',
        yearsField: years });
  }
  const numbers = [age, concerts, cities, years];
  try {
    const skills = db.get('skills');
    numbers.forEach((item, index) => {
      skills.find({ id: index })
        .assign({ number: item })
        .write();
    });
  } catch (err) {
    throw new HttpError('Произошла ошибка при записи в базу данных!', 500);
  }
  res.render('pages/admin', { msgskill: 'Счетчики обновлены!', status: 'Ok' });
};

module.exports.uploadProduct = function (req, res, next) {
  const form = new formidable.IncomingForm();
  const upload = path.join(process.cwd(), 'public', 'images', 'products');
  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }
  form.uploadDir = upload;
  form.parse(req, function (err, fields, files) {
    if (err) {
      throw new HttpError('При чтении данных из формы произошла ошибка!', 500);
    }
    if (files.photo.name === '') {
      return res.render('pages/admin',
        { msgfile: 'Вы не указали файл для загрузки!',
          status: 'Error',
          productName: fields.name || '',
          productPrice: fields.price || '' });
    }

    if (files.photo.size === 0) {
      fs.unlink(files.photo.path);
      return res.render('pages/admin',
        { msgfile: 'Файл для загрузки пуст!',
          status: 'Error',
          productName: fields.name || '',
          productPrice: fields.price || '' });
    }

    if (!fields.name) {
      fs.unlink(files.photo.path);
      return res.render('pages/admin',
        { msgfile: 'Вы не указали описание товара!',
          status: 'Error',
          productPrice: fields.price });
    }

    if (!fields.price) {
      fs.unlink(files.photo.path);
      return res.render('pages/admin',
        { msgfile: 'Вы не указали цену товара!',
          status: 'Error',
          productName: fields.name });
    }

    const fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        fs.unlink(fileName);
        throw new HttpError('Произошла ошибка при переименовании фотографии продукта!', 500);
      }
      const dir = path.join('/images', 'products', files.photo.name);
      try {
        db.get('products')
          .push({ src: dir, name: fields.name, price: fields.price })
          .write();
      } catch (err) {
        throw new HttpError('Произошла ошибка при записи в базу данных!', 500);
      }
      res.render('pages/admin', { msgfile: 'Товар добавлен в каталог!', status: 'Ok' });
    });
  });
};
