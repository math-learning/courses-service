const { doRequest, errorWrapper, baseUrl } = require('./requests');

const getUsers = async ({ courseId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/users`,
  token,
});

const getUser = async ({ courseId, userId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/users/${userId}`,
  token,
});

const addUser = async ({
  courseId, userId, role, token
}) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/users`,
  params: {
    method: 'POST',
    body: JSON.stringify({ userId, role }),
  },
  token,
});

const updateUser = async ({
  courseId, userId, role, token
}) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/users/${userId}`,
  params: {
    method: 'PUT',
    body: JSON.stringify({ role }),
  },
  token,
});

const deleteUser = async ({ courseId, userId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/users/${userId}`,
  params: {
    method: 'DELETE',
  },
  token,
});


module.exports = {
  getUsers: errorWrapper(getUsers),
  getUser: errorWrapper(getUser),
  addUser: errorWrapper(addUser),
  deleteUser: errorWrapper(deleteUser),
  updateUser: errorWrapper(updateUser),
};
