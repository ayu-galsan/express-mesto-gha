const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');
const {
  OK_CODE, CREATED_OK_CODE, NOT_FOUND_ERROR_CODE,
  NotFoundIdCardErrorText, ValidationErrorText, NotDeleteCardErrorText, FORBIDDEN_ERROR_CODE,
} = require('../utils/constans');

const getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    res.status(OK_CODE).send(card);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const owner = req.user.id;
    const { name, link } = req.body;
    const card = new Card({ name, link, owner });
    res.status(CREATED_OK_CODE).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`${ValidationErrorText} при создании карточки`));
      return;
    }
    next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      next(new NotFoundError(NotFoundIdCardErrorText));
      return;
    }
    if (!card.owner.equals(req.user.id)) {
      next(new ForbiddenError(NotDeleteCardErrorText));
      return;
    }
    res.status(OK_CODE).send(await card.deleteOne());
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(`${ValidationErrorText} при удалении карточки`));
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError(NotFoundIdCardErrorText));
      return;
    }
    if (err.statusCode === FORBIDDEN_ERROR_CODE) {
      next(new ForbiddenError(NotDeleteCardErrorText));
      return;
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user.id } },
      { new: true },
    );
    if (!card) {
      next(new NotFoundError(NotFoundIdCardErrorText));
      return;
    }
    res.status(OK_CODE).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError(`${ValidationErrorText} при постановке лайка`));
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError(NotFoundIdCardErrorText));
      return;
    }
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user.id } },
      { new: true },
    );
    if (!card) {
      next(new NotFoundError(NotFoundIdCardErrorText));
      return;
    }
    res.status(OK_CODE).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError(`${ValidationErrorText} при снятии лайка`));
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError(NotFoundIdCardErrorText));
      return;
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
