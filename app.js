const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const helmet = require('helmet');

const { errors } = require('celebrate');

const bodyParser = require('body-parser');

const { routes } = require('./routes');

const centralizedError = require('./middlewares/centralizedError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

// добавляем переменные из файла .env в process.env
require('dotenv').config();

const { PORT = 3000, NODE_ENV, DB_CONN } = process.env;

const app = express();

// подключаем базу данных
mongoose.connect(NODE_ENV === 'production' ? DB_CONN : 'mongodb://localhost:27017/moviesdb');

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаем логгер запросов
app.use(requestLogger);

// подключаем роуты
app.use(routes);

// подключаем логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());
// Централизованная обработка ошибок
app.use(centralizedError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
