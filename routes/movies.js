const moviesRouter = require('express').Router();

const { createMovieValidation, movieIdValidate } = require('../middlewares/validatons');

const {
  createMovie,
  getMovie,
  deleteMovie,
  /*
  likeCard,
  dislikeCard,
  */
} = require('../controllers/movies');

moviesRouter.post('/movies', createMovieValidation, createMovie);
moviesRouter.get('/movies', getMovie);
moviesRouter.delete('/movies/:movieId', movieIdValidate, deleteMovie);
/*
cardsRouter.put('/cards/:cardId/likes', cardIdValidate, likeCard);
cardsRouter.delete('/cards/:cardId/likes', cardIdValidate, dislikeCard);
*/

module.exports = moviesRouter;
