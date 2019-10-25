const createError = require('http-errors');
const usersClient = require('../clients/usersClient');

/**
 * Check out for authentication information
 *
 */
module.exports = async (req, res, next) => {
  const { token } = req.context;

  if (!token) {
    next(createError.BadRequest('Authorization has not been provided'));
  }

  // TODO: users service integration
  // req.context.user = { userId: token };
  const user = await usersClient.authenticate({ context: req.context });
  if (!user) {
    return Promise.reject(createError.Unauthorized());
  }
  req.context.user = user;

  return next();
};
