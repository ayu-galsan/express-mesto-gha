const express = require('express');
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const { NotFoundPageText } = require('../utils/constans');

const routes = express.Router();

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);
routes.use((req, res, next) => {
  next(new NotFoundError(NotFoundPageText));
});

module.exports = {
  routes,
};
