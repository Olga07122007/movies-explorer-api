const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const helmet = require('helmet');

const { errors } = require('celebrate');

const bodyParser = require('body-parser');

const { routes } = require('./routes');

const { limiter } = require('./middlewares/limiter');

const centralizedError = require('./middlewares/centralizedError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

// добавляем переменные из файла .env в process.env
require('dotenv').config();

// подключаем базу данных
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаем логгер запросов
app.use(requestLogger);

// подключаем  rate limiter для всех запросов к API
app.use(limiter);

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
