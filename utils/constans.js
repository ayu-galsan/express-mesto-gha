const OK_CODE = 200;
const CREATED_OK_CODE = 201;
const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;
const ServerErrorText = 'Произошла ошибка в работе сервера';
const NotFoundIdUserErrorText = 'Пользователь с таким id не найден в базе';
const ValidationErrorText = 'Переданы некорректные данные';
const NotFoundIdCardErrorText = 'Карточка с указанным _id не найдена';
const NotFoundPageText = 'Страница не найдена';
module.exports = {
  OK_CODE,
  CREATED_OK_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
  ServerErrorText,
  NotFoundIdUserErrorText,
  ValidationErrorText,
  NotFoundIdCardErrorText,
  NotFoundPageText,
};
