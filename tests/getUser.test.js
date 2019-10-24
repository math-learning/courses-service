const { assert } = require('chai');
const requests = require('./utils/usersRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks } = require('./utils/dbMockFactory');
const configs = require('../configs');
const knex = require('knex')(configs.db); // eslint-disable-line

describe('Get User', () => {
  let response;
  const token = 'fakeToken';

  beforeEach(cleanDb);

  describe('When the user exists', () => {
    let user;
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: token });
      const { courseId } = coursesAndCreators.courses[0];
      [user] = coursesAndCreators.creators.filter((c) => c.courseId === courseId);
      response = await requests.getUser({ courseId, userId: token, token });
    });

    it('should return status 200', () => assert.equal(response.status, 200));
    it('response body should be the user', () => assert.deepEqual(response.body, user));
  });
});
