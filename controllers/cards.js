const Card = require('../models/card');
const {
  OK_CODE, CREATED_OK_CODE, NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE, ServerErrorText, NotFoundIdCardErrorText,
  ValidationErrorText, BAD_REQUEST_ERROR_CODE,
} = require('../utils/constans');

const getCards = async (req, res) => {
  try {
    const card = await Card.find({});
    res.status(OK_CODE).send(card);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({
      message: ServerErrorText,
    });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = new Card({ name, link, owner });
    res.status(CREATED_OK_CODE).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: `${ValidationErrorText} при создании карточки`,
      });
    } else {
      res.status(SERVER_ERROR_CODE).send({
        message: ServerErrorText,
      });
    }
  }
};

const deleteCardById = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      const err = new Error(NotFoundIdCardErrorText);
      err.statusCode = NOT_FOUND_ERROR_CODE;
      throw err;
    }
    res.status(OK_CODE).send(await card.deleteOne());
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: `${ValidationErrorText} при удалении карточки`,
      });
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: NotFoundIdCardErrorText,
      });
      return;
    }
    res.status(SERVER_ERROR_CODE).send({
      message: ServerErrorText,
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      const err = new Error(NotFoundIdCardErrorText);
      err.statusCode = NOT_FOUND_ERROR_CODE;
      throw err;
    }
    res.status(OK_CODE).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: `${ValidationErrorText} при постановке лайка`,
      });
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: NotFoundIdCardErrorText,
      });
      return;
    }
    res.status(SERVER_ERROR_CODE).send({
      message: ServerErrorText,
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      const err = new Error(NotFoundIdCardErrorText);
      err.statusCode = NOT_FOUND_ERROR_CODE;
      throw err;
    }
    res.status(OK_CODE).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: `${ValidationErrorText} при снятии лайка`,
      });
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: NotFoundIdCardErrorText,
      });
      return;
    }
    res.status(SERVER_ERROR_CODE).send({
      message: ServerErrorText,
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
