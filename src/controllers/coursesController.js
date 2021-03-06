const createError = require('http-errors');
const expressify = require('expressify')();
const coursesService = require('../services/coursesService');

/**
 * Search published courses
 *
 */
const searchCourses = async (req, res) => {
  const { context } = req;
  const { page, limit, search } = req.query;
  const { userId } = context.user;

  const courses = await coursesService.searchCourses({
    context, page, limit, search, userId
  });

  return res.status(200).json(courses);
};

/**
 * Get an specific course
 *
 */
const getCourse = async (req, res) => {
  const { context } = req;
  const { courseId } = req.params;
  const { userId } = context.user;

  const course = await coursesService.getCourse({ context, courseId, userId });

  return res.status(200).json(course);
};

/**
 * Create a course
 *
 */
const addCourse = async (req, res) => {
  const { context } = req;
  const { userId } = context.user;
  const { name, description, password } = req.body;

  if (!name || !description) {
    return Promise.reject(createError.BadRequest('name or description have not been provided'));
  }

  const creatorId = userId;
  const createdCourse = await coursesService.addCourse({
    context,
    name,
    password,
    description,
    creatorId,
  });

  return res.status(201).json(createdCourse);
};

/**
 * Copy course
 *
 */
const copyCourse = async (req, res) => {
  const { context } = req;
  const { userId } = context.user;
  const { courseId } = req.params;
  const { name, description, password } = req.body;

  if (!name || !description) {
    return Promise.reject(createError.BadRequest('name or description have not been provided'));
  }

  const creatorId = userId;
  const createdCourse = await coursesService.copyCourse({
    context,
    name,
    password,
    description,
    creatorId,
    sourceCourseId: courseId
  });

  return res.status(201).json(createdCourse);
};

/**
 * Delete an specific course
 *
 */
const deleteCourse = async (req, res) => {
  const { userId } = req.context.user;
  const { courseId } = req.params;

  await coursesService.deleteCourse({ courseId, userId });

  return res.status(204).json({});
};

/**
 * Updates an specific course
 *
 */
const updateCourse = async (req, res) => {
  const { userId } = req.context.user;
  const { courseId } = req.params;
  const { name, description } = req.body; // TODO: handlear si mandan uno y otro no

  if (!name && !description) {
    return Promise.reject(createError.BadRequest('name or description not provided'));
  }
  const metadata = { name, description };

  const updatedCourse = await coursesService.updateCourse({
    courseId, userId, metadata
  });

  return res.status(200).json(updatedCourse[0]);
};

/**
 * Publish an specific course
 *
 */
const publishCourse = async (req, res) => {
  const { userId } = req.context.user;
  const { courseId } = req.params;

  // TODO: podríamos agregar chequeos de si se puede publicar el curso
  const updatedCourse = await coursesService.publishCourse({ courseId, userId });

  return res.status(200).json(updatedCourse);
};

/**
 * Get courses by user
 *
 */
const getUserCourses = async (req, res) => {
  const { context } = req;
  const { userId } = context.user;
  const { page, limit } = req.query;
  const userCourses = await coursesService.getUserCourses({
    context, page, limit, userId
  });

  return res.status(200).json(userCourses);
};


module.exports = expressify({
  addCourse,
  copyCourse,
  getCourse,
  publishCourse,
  searchCourses,
  updateCourse,
  deleteCourse,
  getUserCourses
});
