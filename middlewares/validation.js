const { celebrate, Joi } = require('celebrate');

const { formLink } = require('../models/forms');

const validateCreateUser = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
});

const validateLogin = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      email: Joi.string()
        .required()
        .email(),
    }),
});

const validateCreateMovie = celebrate({
  body: Joi.object()
    .keys({
      country: Joi.string()
        .required(),
      director: Joi.string()
        .required(),
      duration: Joi.number()
        .required(),
      year: Joi.string()
        .required(),
      description: Joi.string()
        .required(),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!formLink.test(value)) {
            return helpers.error('Некорректный формат ссылки');
          }
          return value;
        }),
      trailerLink: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!formLink.test(value)) {
            return helpers.error('Некорректный формат ссылки');
          }
          return value;
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!formLink.test(value)) {
            return helpers.error('Некорректный формат ссылки');
          }
          return value;
        }),
      movieId: Joi.number()
        .integer()
        .positive()
        .required(),
      nameRU: Joi.string()
        .required(),
      nameEN: Joi.string()
        .required(),
    }),
});

const validateMovieId = celebrate({
  params: Joi.object()
    .keys({
      _id: Joi.string()
        .required()
        .length(24)
        .hex(),
    }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateProfile,
  validateCreateMovie,
  validateMovieId,
};
