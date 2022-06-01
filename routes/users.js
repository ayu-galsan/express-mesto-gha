const express = require('express');
const { celebrate, Joi } = require('celebrate');

const usersRoutes = express.Router();
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  getMyUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { urlRegExp } = require('../utils/constans');

usersRoutes.get('/', auth, getUsers);

usersRoutes.get('/me', auth, getMyUser);

usersRoutes.get('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }).unknown(true),
}), getUserById);

usersRoutes.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateProfile);

usersRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegExp),
  }).unknown(true),
}), auth, updateAvatar);

module.exports = usersRoutes;
