const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { formEmail } = require('./forms');
const UnauthorizedError = require('../errors/unathorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => formEmail.test(v),
      message: 'Неверно указан формат адреса',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Передан некорректный email или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Передан некорректный email или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
