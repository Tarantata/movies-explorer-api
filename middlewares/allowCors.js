const allowedCorsDomains = [
  'https://vvv-diploma.backend.nomoredomainsclub.ru',
  'http://vvv-diploma.backend.nomoredomainsclub.ru',
  'http://localhost:3000',
];

const allowedCors = {
  origin: allowedCorsDomains,
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = {
  allowedCors,
};
