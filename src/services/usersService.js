const users = require('../databases/usersDb');

const getUsers = async ({ courseId, limit, offset }) => users.getUsers({ courseId, limit, offset });

let addUser;
let updateUser;
let deleteUser;

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};
