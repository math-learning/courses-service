const courses = require('../databases/coursesDb');

const getCourse = async ({ courseId }) => courses.getCourse({ courseId });

const getCourses = async ({ page, limit, userToken }) => {
  // TODO: users service integration for the moment we use the token
  const userId = userToken;
  const coursesByUser = await courses.getCoursesByUser({ page, limit, userId });
  const result = coursesByUser.map((c) => getCourse({ courseId: c.courseId }));
  return Promise.all(result);
};

const addCourse = async ({ description, name, creatorId }) => {
  // TODO: hacer esto mejor
  const courseId = name.toLowerCase().replace(' ', '');
  await courses.addCourse({
    name,
    description,
    creatorId,
    courseId,
  });
};

const addUserToCourse = async ({
  userId,
  courseId,
  role
}) => courses.addUserToCourse({ userId, courseId, role });

const deleteCourse = async ({ courseId }) => courses.deleteCourse({ courseId });

const updateCourse = async ({ courseId, description, name }) => courses.updateCourse({
  name,
  description,
  courseId,
});

const getCourseUsers = async ({ courseId }) => courses.getCourseUsers({ courseId });

module.exports = {
  getCourses,
  addCourse,
  getCourse,
  addUserToCourse,
  deleteCourse,
  updateCourse,
  getCourseUsers,
};
