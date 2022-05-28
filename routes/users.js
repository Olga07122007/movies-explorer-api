const express = require('express');

const usersRouter = express.Router();

const { updateUserValidation } = require('../middlewares/validatons');

const {
  getMe,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/me', getMe);
usersRouter.patch('/me', updateUserValidation, updateUser);

exports.usersRouter = usersRouter;
