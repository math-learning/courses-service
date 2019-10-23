const createError = require('http-errors');

const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../../configs');
const knex = require('knex')(configs.db); // eslint-disable-line


const COURSES_TABLE = 'courses';
const COURSE_USERS_TABLE = 'course_users';
/**
 * Get courses.
 *
 */

const getCoursesByUser = async ({
  userId,
  page,
  limit
}) => knex(COURSE_USERS_TABLE)
  .select()
  .where(snakelize({ userId }))
  .returning('*')
  .offset(page || configs.dbDefault.offset)
  .limit(limit || configs.dbDefault.limit)
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound('Courses not found');
    }
    if (!response.length) {
      return [response];
    }
    return response;
  });

const getCourses = async ({
  page,
  limit
}) => {
  const { pageSize } = configs.coursesConfig.pageSize;
  return knex(COURSES_TABLE)
    .select()
    .returning('*')
    .offset(page)
    .limit(limit || pageSize)
    .then(processDbResponse)
    .then((response) => {
      console.log(response);
      if (!response) {
        throw new createError.NotFound('Courses not found');
      }
      return response;
    });
};

const getCourse = async ({ courseId }) => knex(COURSES_TABLE)
  .select()
  .where(snakelize({ courseId }))
  .returning('*')
  .first()
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound(`Course with id: ${courseId} not found`);
    }
    return response;
  });

const newCourse = ({
  trx,
  name,
  description,
  courseId,
}) => trx.insert(snakelize({
  courseId,
  name,
  description,
}))
  .into(COURSES_TABLE);


const createCourseCreator = ({
  trx,
  courseId,
  creatorId,
}) => trx
  .insert(snakelize({
    userId: creatorId,
    courseId,
    role: 'admin'
  })).into('course_users');


const addCourse = async ({
  courseId,
  name,
  description,
  creatorId,
}) => {
  const trx = await knex.transaction();
  await newCourse({
    trx,
    name,
    description,
    courseId,
  });
  await createCourseCreator({
    trx,
    courseId,
    creatorId,
  });
  await trx.commit();
};

const addUserToCourse = async ({ userId, courseId, role }) => knex(COURSE_USERS_TABLE)
  .insert(snakelize({
    userId,
    courseId,
    role,
  }));

const deleteCourse = async ({ courseId }) => {
  const trx = await knex.transaction();
  // TODO: delete on cascade?
  await trx.delete()
    .from(COURSES_TABLE)
    .where(snakelize({ courseId }));

  await trx.delete()
    .from(COURSE_USERS_TABLE)
    .where(snakelize({ courseId }));

  await trx.commit();
};

const updateCourse = async ({ courseId, name, description }) => knex(COURSES_TABLE)
  .update({ name, description })
  .where(snakelize({ courseId }));

// TODO analyze the need for pagination
const getCourseUsers = async ({ courseId }) => knex(COURSE_USERS_TABLE)
  .select('user_id', 'role')
  .where(snakelize({ courseId }))
  .then(processDbResponse);

module.exports = {
  getCourses,
  addCourse,
  getCoursesByUser,
  getCourse,
  addUserToCourse,
  deleteCourse,
  updateCourse,
  getCourseUsers,
};
