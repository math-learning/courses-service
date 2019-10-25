const { assert } = require('chai');
const requests = require('./utils/usersRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks } = require('./utils/dbMockFactory');

require('../src/app.js');

describe('Update User', () => {
  let response;
  const token = 'fakeToken';

  beforeEach(cleanDb);

  describe('When the user exists', () => {
    let user;
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: token });
      const { courseId } = coursesAndCreators.courses[0];
      [user] = coursesAndCreators.creators.filter((c) => c.courseId === courseId);
      user.role = 'professor';
      response = await requests.updateUser({
        courseId, userId: token, role: 'professor', token
      });
    });

    it('should return status 200', () => assert.equal(response.status, 200));
    it('get user should return the updated user', async () => {
      response = await requests.getUser({ courseId: user.courseId, userId: user.userId, token });
      assert.deepEqual(response.body, user);
    });
  });

  // TODO: analyze this issue. Should the admin be the only one capable of updating an user role?
});
