require('dotenv').config();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');

const BadRequestError = require('../errors/BadRequestError');

const ConflictError = require('../errors/ConflictError');

const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

// получение информации о текущем пользователе
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch((err) => {
      next(err);
    });
};

// обновить профиль
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  if ((!email) || (!name)) {
    throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

// создать пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  if ((!email) || (!password)) {
    throw new BadRequestError('Поля "email" и "password" должны быть обязательно заполнены');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(200).send({
            user: {
              name: user.name,
              email: user.email,
              _id: user.id,
            },
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          }
          if (err.code === 11000) {
            next(new ConflictError('Данный email уже существует'));
          }
          next(err);
        });
    })
    .catch(next);
};

// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret1',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильные почта или пароль'));
    });
};
