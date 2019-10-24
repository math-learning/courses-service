const { assert } = require('chai');
const requests = require('./utils/usersRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks } = require('./utils/dbMockFactory');
const { snakelize, camilize } = require('../src/utils/dbUtils');
const configs = require('../configs');
const knex = require('knex')(configs.db); // eslint-disable-line

require('../src/app.js');

describe('Add User', () => {
  let response;
  const token = 'fakeToken';

  beforeEach(cleanDb);

  describe('When the user is correct and doesnt exist', () => {
    let userToAdd;
    let courseId;
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
      const user = camilize(await knex.select()
        .from('course_users')
        .where(snakelize({
          courseId: userToAdd.courseId,
          userId: userToAdd.userId,
        })).first());
      assert.deepEqual(response.body, user);
    });
  });
});
