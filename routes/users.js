const express = require('express');

const usersRoutes = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);
usersRoutes.get('/:id', getUserById);
usersRoutes.post('/', express.json(), createUser);
usersRoutes.patch('/me', express.json(), updateProfile);
usersRoutes.patch('/me/avatar', express.json(), updateAvatar);

module.exports = usersRoutes;
