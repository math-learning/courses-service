const _ = require('lodash');
const configs = require('../../configs/test');

const knex = require('knex')(configs.db); // eslint-disable-line

const sanitizeResponse = (response) => {
  if (_.isArray(response)) {
    return response.map((obj) => sanitizeResponse(obj));
  }
  delete response.id;
  delete response.createdAt;
  return response;
};

const cleanDb = async () => {
  await knex('courses').del();
  await knex('guides').del();
  await knex('course_users').del();
  await knex('users_activity').del();
};

module.exports = {
  knex,
  cleanDb,
  sanitizeResponse,
};
