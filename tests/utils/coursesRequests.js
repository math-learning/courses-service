const url = require('url');
const fetch = require('node-fetch');
const configs = require('../../configs');
const { doRequest } = require('./requests');

const baseUrl = url.format(configs.app);

const status = () => {
  const statusUrl = `${baseUrl}/ping`;
  return fetch(statusUrl);
};

const getCourses = async ({ token }) => doRequest({
  requestUrl: `${baseUrl}/courses`,
  token,
});

const deleteCourse = async ({ token, courseId }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}`,
  params: {
    method: 'DELETE'
  },
  token,
});

const getCourse = async ({ token, courseId }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}`,
  token,
});

const addCourse = async ({ token, name, description }) => {
  const data = { name, description };
  return doRequest({
    requestUrl: `${baseUrl}/courses`,
    params: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token,
  });
};

function errorWrapper(funct) {
  return function inner(...args) {
    try {
      return funct(...args);
    } catch (err) {
      return err;
    }
  };
}

const updateCourse = async ({
  courseId,
  name,
  description,
  token,
}) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}`,
  params: {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
  },
  token
});

const getCourseUsers = async ({ courseId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/users`,
  token
});

module.exports = {
  status: errorWrapper(status),
  getCourses: errorWrapper(getCourses),
  addCourse: errorWrapper(addCourse),
  getCourse: errorWrapper(getCourse),
  deleteCourse: errorWrapper(deleteCourse),
  updateCourse: errorWrapper(updateCourse),
  getCourseUsers: errorWrapper(getCourseUsers),
};
