const Movie = require('../models/movie-model');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const getMovies = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const movies = await Movie.find({ owner: _id });
    return res.status(200).send(movies);
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const {
      country, director, duration, year, description,
      image, trailerLink, thumbnail, movieId, nameRU, nameEN,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner,
    });
    return res.status(201).json(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Введены некорректные данные при создании фильма'));
    }
    return next(err);
  }
};

const deleteMovieById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const movie = await Movie.findById(_id);
    if (movie === null) {
      throw new NotFoundError('Фильм с указанным _id не найден');
    }
    const ownerId = movie.owner._id.toString();
    if (ownerId !== req.user._id) {
      throw new ForbiddenError('Вы не можете удалять чужие фильмы!');
    }
    await movie.remove();
    return res.status(200).json({ message: 'Фильм удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при удалении фильма.'));
    }
    return next(err);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
