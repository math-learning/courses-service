const users = require('../databases/usersDb');

const getUsers = async ({
  courseId,
  limit,
  offset
}) => users.getUsers({ courseId, limit, offset });

const addUser = async ({
  courseId,
  userId,
  role
}) => users.addUser({ courseId, userId, role });

const updateUser = async ({
  courseId,
  userId,
  role
}) => users.updateUser({ courseId, userId, role });

const deleteUser = async ({
  courseId,
  userId
}) => users.deleteUser({ userId, courseId });

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};
