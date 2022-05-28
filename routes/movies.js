const express = require('express');

const moviesRouter = express.Router();

const { createMovieValidation, movieIdValidate } = require('../middlewares/validatons');

const {
  createMovie,
  getMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.post('/', createMovieValidation, createMovie);
moviesRouter.get('/', getMovie);
moviesRouter.delete('/:movieId', movieIdValidate, deleteMovie);

exports.moviesRouter = moviesRouter;
