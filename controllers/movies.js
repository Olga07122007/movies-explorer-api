const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');

const BadRequestError = require('../errors/BadRequestError');

const ForbiddenError = require('../errors/ForbiddenError');

// все фильмы
module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

// создание фильма
module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId } = req.body;
  Movie.create({ country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner: req.user._id })
    .then((movie) => {
      if (movie) {
        res.status(200).send(movie);
      } else {
        throw new NotFoundError('Что-то пошло не так');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      next(err);
    });
};

// удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie) {
        if (!movie.owner.equals(ownerId)) {
          throw new ForbiddenError('Чужой фильм не может быть удален!');
        }
        return Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.status(200).send(movie);
          });
      }
      throw new NotFoundError('Передан несуществующий _id фильма');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id фильма'));
      }
      next(err);
    });
};

/*
// поставить лайк
module.exports.likeCard = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки'));
      }
      next(err);
    });
};

// убрать лайк
module.exports.dislikeCard = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки'));
      }
      next(err);
    });
};
*/
