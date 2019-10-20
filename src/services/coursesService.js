const courses = require('../databases/coursesDb');

const getCourse = async ({ id }) => courses.getCourse({ id });

const getCourses = async ({ page, limit, userToken }) => {
  // TODO: users service integration for the moment we use the token
  const userId = userToken;
  const coursesByUser = await courses.getCoursesByUser({ page, limit, userId });
  const result = coursesByUser.map((c) => getCourse({ id: c.courseId }));
  return Promise.all(result);
};

const addCourse = ({ description, name }) => {
  const id = name.toLowerCase().replace(' ', '');
  courses.addCourse({
    name,
    description,
    id,
  });
};

module.exports = {
  getCourses,
  addCourse,
};
