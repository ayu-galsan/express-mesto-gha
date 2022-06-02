const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  jwt, JWT_SECRET, NotFoundAuthorizationText,
} = require('../utils/constans');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(NotFoundAuthorizationText));
    return;
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(NotFoundAuthorizationText));
    return;
  }

  req.user = payload;

  next();
};
