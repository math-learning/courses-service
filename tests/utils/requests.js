const url = require('url');
const fetch = require('node-fetch');
const configs = require('../../configs');

const baseUrl = url.format(configs.app);

const status = () => {
  const statusUrl = `${baseUrl}/ping`;

  return fetch(statusUrl);
};

const getCourses = async ({ token }) => {
  const coursesUrl = `${baseUrl}/courses`;
  const response = await fetch(coursesUrl, {
    headers: {
      authorization: token
    }
  });
  return { status: response.status, body: await response.json() };
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

module.exports = {
  status: errorWrapper(status),
  getCourses: errorWrapper(getCourses),
};
