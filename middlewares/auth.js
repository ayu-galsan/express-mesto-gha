const {
  jwt, JWT_SECRET, NotFoundAuthorizationText,
  UNAUTHORIZED_ERROR_CODE,
} = require('../utils/constans');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: NotFoundAuthorizationText });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: NotFoundAuthorizationText });
  }

  req.user = payload;

  next();
};
