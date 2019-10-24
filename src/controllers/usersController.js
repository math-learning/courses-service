const expressify = require('expressify')();
const usersService = require('../services/usersService');


const getCourseUsers = async (req, res) => {
  const { courseId } = req.params;
  // TODO: return just user ids? or get the info from users service
  const users = await usersService.getUsers({ courseId });

  return res.status(200).json(users);
};

const addUser = async (req, res) => {
  const { courseId } = req.params;
  const { userId, role } = req.body;
  await usersService.addUser({ courseId, userId, role });
  return res.status(201).json({ courseId, userId, role });
};

const updateUser = async (req, res) => {
  const { courseId, userId } = req.params;
  const { role } = req.body;
  await usersService.updateUser({ courseId, userId, role });
  return res.status(200).json({ courseId, userId, role });
};

const deleteUser = async (req, res) => {
  const { courseId, userId } = req.params;
  await usersService.deleteUser({ courseId, userId });
  return res.status(200).json();
};

module.exports = expressify({
  getCourseUsers,
  addUser,
  updateUser,
  deleteUser,
});
