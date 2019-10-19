const courses = require('../databases/coursesDb');

const getCourses = ({ page, limit }) => courses.getCourses({ page, limit });

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
  addCourse
};
