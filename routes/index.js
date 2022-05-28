const express = require('express');

const routes = express.Router();

const {
  login,
  createUser,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const { createUserValidation, loginValidation } = require('../middlewares/validatons');

const { usersRouter } = require('./users');

const { moviesRouter } = require('./movies');

const NotFoundError = require('../errors/NotFoundError');

// роуты, не требующие авторизации
routes.post('/signup', express.json(), createUserValidation, createUser);
routes.post('/signin', express.json(), loginValidation, login);

// авторизация
routes.use(auth);

// роуты, которым нужна авторизация
routes.use('/users', usersRouter);
routes.use('/movies', moviesRouter);

routes.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена!'));
});

exports.routes = routes;
