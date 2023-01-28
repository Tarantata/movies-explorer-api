require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const routerUser = require('./routes/users-routes');
const routerMovie = require('./routes/movies-routes');
const { createUser, login } = require('./controllers/users-controllers');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');
const { errorHandler } = require('./middlewares/errorsHandler');
const NotFoundError = require('./errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { allowedCors } = require('./middlewares/allowCors');

const app = express();
const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(cors(allowedCors));

app.use(express.json());
app.use(requestLogger);

app.use('/signup', validateCreateUser, createUser);
app.use('/signin', validateLogin, login);

app.use(auth);

app.use('/users', routerUser);
app.use('/movies', routerMovie);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://127.0.0.1:27017/diplomadb', {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} / Приложение запущено, используется порт ${PORT}.`);
  });
});
