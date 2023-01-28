const mongoose = require('mongoose');
const { formLink } = require('./forms');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => formLink.test(v),
      message: 'Неверно указан формат адреса',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => formLink.test(v),
      message: 'Неверно указан формат адреса',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => formLink.test(v),
      message: 'Неверно указан формат адреса',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
