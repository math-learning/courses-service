const usersService = require('../services/usersService');

const getCourseUsers = async (req, res) => {
  const { courseId } = req.params;
  // TODO: return just user ids? or get the info from users service
  const users = await usersService.getUsers({ courseId });

  return res.status(200).json(users);
};

module.exports = {
  getCourseUsers,
};
