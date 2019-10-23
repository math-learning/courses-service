const createError = require('http-errors');

const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../../configs');
const knex = require('knex')(configs.db); // eslint-disable-line

const USERS_TABLE = 'course_users';

const getUsers = async ({ courseId, limit, offset }) => knex
  .select()
  .from(USERS_TABLE)
  .where(snakelize({ courseId }))
  .limit(limit || configs.dbDefault.limit)
  .offset(offset || configs.dbDefault.offset)
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound(`Users not found for course ${courseId}`);
    }
    return response;
  });

let addUser;
let deleteUser;
let updateUser;

module.exports = {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
};
