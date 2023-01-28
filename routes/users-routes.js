const routerUser = require('express').Router();
const {
  getUserInfo, updateUserInfo,
} = require('../controllers/users-controllers');
const { validateUpdateProfile } = require('../middlewares/validation');

routerUser.get('/me', getUserInfo);

routerUser.patch('/me', validateUpdateProfile, updateUserInfo);

module.exports = routerUser;
