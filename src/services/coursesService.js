const createError = require('http-errors');
const coursesDb = require('../databases/coursesDb');
const usersService = require('./usersService');

/**
 * Get an specific course for the user
 *
 */
const getCourse = async ({ courseId, userId }) => {
  if (await usersService.getUser({ courseId, userId }) === null) {
    return Promise.reject(createError.Forbidden(
      `The user with id ${userId} dont belong to the course with id ${courseId}`
    ));
  }
  return coursesDb.getCourse({ courseId }); // TODO: Estaria bueno que la query incluya las guias
};

/**
 * Get courses by user
 *
 */
const getUserCourses = async ({
  page,
  limit,
  userId
}) => {
  const courses = await coursesDb.getUserCourses({ page, limit, userId });

  if (!courses.length) {
    return courses;
  }
  return coursesDb.includeProfessorsToCourses({ courses });
};

/**
 * Add course
 *
 */
const addCourse = async ({ description, name, creatorId }) => {
  // TODO: refactor and think if every user can create courses
  const courseId = name.toLowerCase().replace(' ', '');
  await coursesDb.addCourse({
    name,
    description,
    creatorId,
    courseId,
  });
};

/**
 * Delete course
 *
 */
const deleteCourse = async ({ userId, courseId }) => {
  const isAdmin = await usersService.isAdmin({ userId, courseId });
  if (!isAdmin) {
    return Promise.reject(createError.Forbidden());
  }
  return coursesDb.deleteCourse({ courseId });
};

/**
 * Update course
 *
 */
const updateCourse = async ({
  courseId, userId, description, name
}) => {
  if (!await doesCourseExists({ courseId })) {
    return Promise.reject(createError.NotFound(`Course with id ${courseId} not found`));
  }

  const isAdmin = await usersService.isAdmin({ userId, courseId });
  if (!isAdmin) {
    return Promise.reject(createError.Forbidden());
  }
  return coursesDb.updateCourse({
    name,
    description,
    courseId,
  });
};

/**
 * Search published courses
 *
 */
const searchCourses = async ({ page, limit, userId }) => {
  const courses = await coursesDb.searchCourses({ offset: page * limit, limit, userId });

  if (!courses.length) {
    return courses;
  }
  return coursesDb.includeProfessorsToCourses({ courses });
};


const doesCourseExists = async ({ courseId }) => coursesDb.getCourse({ courseId })
  .then(() => true)
  .catch(() => false);


module.exports = {
  addCourse,
  doesCourseExists,
  getCourse,
  getUserCourses,
  deleteCourse,
  searchCourses,
  updateCourse
};
