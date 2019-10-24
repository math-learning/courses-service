const url = require('url');
const configs = require('../../configs');
const { doRequest } = require('./requests');

const baseUrl = url.format(configs.app);

const addGuide = async ({ token, courseId, guide }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/guides`,
  params: {
    method: 'POST',
    body: JSON.stringify(guide),
  },
  token,
});

function errorWrapper(funct) {
  return function inner(...args) {
    try {
      return funct(...args);
    } catch (err) {
      return err;
    }
  };
}

const getGuides = async ({ courseId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/guides`,
  token,
});

const updateGuide = async ({
  courseId, guideId, token, name, description
}) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/guides/${guideId}`,
  params: {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
  },
  token,
});


const deleteGuide = async ({ courseId, guideId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/guides/${guideId}`,
  params: {
    method: 'DELETE',
  },
  token,
});

const getGuide = async ({ courseId, guideId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/guides/${guideId}`,
  token,
});

module.exports = {
  addGuide: errorWrapper(addGuide),
  getGuides: errorWrapper(getGuides),
  updateGuide: errorWrapper(updateGuide),
  deleteGuide: errorWrapper(deleteGuide),
  getGuide: errorWrapper(getGuide),
};
