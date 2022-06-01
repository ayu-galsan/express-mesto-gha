const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestError = require('../errors/BadRequestError');
const User = require('../models/user');
const {
  OK_CODE, CREATED_OK_CODE, NOT_FOUND_ERROR_CODE,
  NotFoundIdUserErrorText,
  ValidationErrorText,
  jwt,
  JWT_SECRET,
  SALT_ROUNDS,
  NotFoundLoginPasswordText,
  DUBLICATE_MONGOOSE_ERROR_CODE,
  UserExistErrorText,
} = require('../utils/constans');
const ConflictError = require('../errors/ConflictError');

const getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    res.status(OK_CODE).send(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError(NotFoundLoginPasswordText));
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      next(new UnauthorizedError(NotFoundLoginPasswordText));
      return;
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(OK_CODE).send({ token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new UnauthorizedError(ValidationErrorText));
      return;
    }
    next(err);
  }
};

const getMyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      next(new NotFoundError(NotFoundIdUserErrorText));
      return;
    }
    res.status(OK_CODE).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(ValidationErrorText));
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError(NotFoundIdUserErrorText));
      return;
    }
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      next(new NotFoundError(NotFoundIdUserErrorText));
      return;
    }
    res.status(OK_CODE).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(ValidationErrorText));
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError(NotFoundIdUserErrorText));
      return;
    }
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError(NotFoundLoginPasswordText));
    return;
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      name, about, avatar, email, password: hash,
    });
    const savedUser = await user.save();
    const { password: removedPassword, ...result } = savedUser.toObject();
    res.status(CREATED_OK_CODE).send(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(ValidationErrorText));
      return;
    }
    if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
      next(new ConflictError(UserExistErrorText));
      return;
    }
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(OK_CODE).send(updateUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(ValidationErrorText));
      return;
    }
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(OK_CODE).send(updateUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(ValidationErrorText));
      return;
    }
    next(err);
  }
};

module.exports = {
  getUsers,
  getMyUser,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
