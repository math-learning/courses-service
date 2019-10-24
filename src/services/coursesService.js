const createError = require('http-errors');
const courses = require('../databases/coursesDb');
const usersService = require('./usersService');

const getCourse = async ({ courseId, userId }) => {
  if (await usersService.getUser({ courseId, userId }) === null) {
    return Promise.reject(createError.Unauthorized(
      `The user with id ${userId} dont belong to the course with id ${courseId}`
    ));
  }
  return courses.getCourse({ courseId });
};

const getCoursesByUser = async ({
  page,
  limit,
  userId
}) => courses.getCoursesByUser({ page, limit, userId });

const addCourse = async ({ description, name, creatorId }) => {
  // TODO: refactor and think if every user can create courses
  const courseId = name.toLowerCase().replace(' ', '');
  await courses.addCourse({
    name,
    description,
    creatorId,
    courseId,
  });
};

const deleteCourse = async ({ userId, courseId }) => {
  if (!await usersService.isAdmin({ userId, courseId })) {
    return Promise.reject(createError.Unauthorized());
  }
  return courses.deleteCourse({ courseId });
};

const updateCourse = async ({
  courseId, userId, description, name
}) => {
  if (!await usersService.isAdmin({ userId, courseId })) {
    return Promise.reject(createError.Unauthorized());
  }
  return courses.updateCourse({
    name,
    description,
    courseId,
  });
};

const getCourses = async ({ page, limit }) => courses.getCourses({ offset: page * limit, limit });

module.exports = {
  getCourses,
  getCoursesByUser,
  addCourse,
  getCourse,
  deleteCourse,
  updateCourse,
};
