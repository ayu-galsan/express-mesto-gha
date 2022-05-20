const User = require('../models/user');
const {
  OK_CODE, CREATED_OK_CODE, BAD_REQUEST_ERROR_CODE, NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE, ServerErrorText, NotFoundIdUserErrorText,
  ValidationErrorText,
} = require('../utils/constans');

const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(OK_CODE).send(user);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({
      message: ServerErrorText,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const err = new Error(NotFoundIdUserErrorText);
      err.statusCode = NOT_FOUND_ERROR_CODE;
      throw err;
    }
    res.status(OK_CODE).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: ValidationErrorText,
      });
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: NotFoundIdUserErrorText,
      });
      return;
    }
    res.status(SERVER_ERROR_CODE).send({
      message: ServerErrorText,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    res.status(CREATED_OK_CODE).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: ValidationErrorText,
      });
    } else {
      res.status(SERVER_ERROR_CODE).send({
        message: ServerErrorText,
      });
    }
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(OK_CODE).send(updateUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.log(err.message);
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: ValidationErrorText,
      });
    } else {
      res.status(SERVER_ERROR_CODE).send({
        message: ServerErrorText,
      });
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(OK_CODE).send(updateUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.log(err.message);
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: ValidationErrorText,
      });
    } else {
      res.status(SERVER_ERROR_CODE).send({
        message: ServerErrorText,
      });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
