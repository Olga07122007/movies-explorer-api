const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const { errors } = require('celebrate');

const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');

const moviesRouter = require('./routes/movies');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const NotFoundError = require('./errors/NotFoundError');

const centralizedError = require('./middlewares/centralizedError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { createUserValidation, loginValidation } = require('./middlewares/validatons');

const { PORT = 3000 } = process.env;
const app = express();

// добавляем переменные из файла .env в process.env
require('dotenv').config();

// подключаем базу данных
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаем логгер запросов
app.use(requestLogger);

// роуты, не требующие авторизации
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

// авторизация
app.use(auth);

// роуты, которым нужна авторизация
app.use(moviesRouter);
app.use(usersRouter);

app.use('/*', () => {
  throw new NotFoundError('Страница по указанному маршруту не найдена');
});

// подключаем логгер ошибок
app.use(errorLogger);
// обработчик ошибок celebrate
app.use(errors());
// Централизованная обработка ошибок
app.use(centralizedError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('123');
});
