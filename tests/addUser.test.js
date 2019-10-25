const { assert } = require('chai');
const requests = require('./utils/usersRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks } = require('./utils/dbMockFactory');

require('../src/app.js');

describe('Add User', () => {
  let response;
  const token = 'fakeToken';
  let userToAdd;
  let courseId;
  beforeEach(cleanDb);

  describe('When the user is correct and doesnt exist', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: 'creator' });
      courseId = coursesAndCreators.courses[0].courseId;
      userToAdd = {
        role: 'student',
        courseId,
        userId: token,
      };
      response = await requests.addUser({
        courseId, userId: token, role: userToAdd.role, token
      });
    });

    it('should return status CREATED', () => assert.equal(response.status, 201));
    it('the user should exist in the db after adding it', async () => {
      response = await requests.getUser({
        userId: userToAdd.userId, courseId: userToAdd.courseId
      });
      assert.deepEqual(response.body, userToAdd);
    });
  });

  describe('When the user already exists', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: 'creator' });
      courseId = coursesAndCreators.courses[0].courseId;
      userToAdd = {
        role: 'student',
        courseId,
        userId: token,
      };
      response = await requests.addUser({
        courseId, userId: token, role: userToAdd.role, token
      });
      response = await requests.addUser({
        courseId, userId: token, role: userToAdd.role, token
      });
    });

    it('should return status CONFLICT', () => assert.equal(response.status, 409));
  });

  describe('When there are missing fields', () => {
    it('should return BAD REQUEST', async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: 'creator' });
      courseId = coursesAndCreators.courses[0].courseId;
      userToAdd = {
        role: 'student',
        courseId,
        userId: token,
      };
      response = await requests.addUser({
        courseId, userId: token, token
      });
      assert.equal(response.status, 400);
    });
  });

  // TODO: who can add users to a course?
});
