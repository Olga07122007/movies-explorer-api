const usersRouter = require('express').Router();

const {
  updateUserValidation,
  userIdValidation,
} = require('../middlewares/validatons');

const {
  getMe,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/users/me', getMe);
usersRouter.patch('/users/me', updateUserValidation, updateUser);

module.exports = usersRouter;
