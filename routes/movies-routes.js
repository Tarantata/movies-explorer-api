const routerMovie = require('express').Router();
const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies-controllers');
const { validateCreateMovie, validateMovieId } = require('../middlewares/validation');

routerMovie.get('/', getMovies);

routerMovie.post('/', validateCreateMovie, createMovie);

routerMovie.delete('/:_id', validateMovieId, deleteMovieById);

module.exports = routerMovie;
