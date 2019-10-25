const { assert } = require('chai');
const requests = require('./utils/guidesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks, addGuideMocks } = require('./utils/dbMockFactory');

require('../src/app.js');

describe('Get guides', () => {
  let response;
  const token = 'fakeToken';

  beforeEach(cleanDb);

  describe('When there are guides', () => {
    let guides;
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: token,
      });
      const { courseId } = coursesAndCreators.courses[0];
      guides = await addGuideMocks({
        courseId,
        guidesAmount: 1,
      });
      response = await requests.getGuides({ courseId, token });
    });

    it('status should be OK', () => assert.equal(response.status, 200));
    it('should return the existing guides', () => {
      assert.deepEqual(response.body, guides);
    });
  });

  describe('When there are zero guides', () => {
    beforeEach(async () => {
      response = await requests.getGuides({ courseId: 'id', token });
    });

    it('should return NOT FOUND', () => assert.equal(response.status, 404));
  });
});
