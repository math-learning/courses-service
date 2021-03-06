const { doRequest, errorWrapper, baseUrl } = require('./requests');

const getUsers = async ({ courseId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/users`,
  token,
});

const getUser = async ({ user, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${user.courseId}/users/${user.userId}`,
  token,
});

const addUser = async ({ user, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${user.courseId}/users`,
  params: {
    method: 'POST',
    body: JSON.stringify({
      userId: user.userId,
      role: user.role,
      password: user.password
    }),
  },
  token,
});

const updateUser = async ({ user, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${user.courseId}/users/${user.userId}`,
  params: {
    method: 'PUT',
    body: JSON.stringify({ role: user.role }),
  },
  token,
});

const deleteUser = async ({ user, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${user.courseId}/users/${user.userId}`,
  params: {
    method: 'DELETE',
  },
  token,
});

const getUsersActivity = async ({ token, courseId }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/users/statistics/activity`,
  params: {
    method: 'GET',
  },
  token
});


module.exports = {
  getUsers: errorWrapper(getUsers),
  getUsersActivity: errorWrapper(getUsersActivity),
  getUser: errorWrapper(getUser),
  addUser: errorWrapper(addUser),
  deleteUser: errorWrapper(deleteUser),
  updateUser: errorWrapper(updateUser),
};
