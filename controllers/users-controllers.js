const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const SALT_ROUNDS = 10;

const createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name, email, password: hash,
    });

    const token = await jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    return res
      .status(201).json({
        token,
      });
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new ConflictError('Данный email уже используется'));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Введены некорректные данные при создании пользователя'));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = await jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    return res.status(200).json({ token });
  } catch (err) {
    return next(err);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Введены некорректные данные'));
    }
    return next(err);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(owner, { name, email }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).json({user, message: "Профиль успешно изменен!"});
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    if (err.message.indexOf('duplicate key error') !== -1) {
      return next(new ConflictError('Произошла ошибка, пользователь с таким email уже существует'));
    }

    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  getUserInfo,
  updateUserInfo,
};
