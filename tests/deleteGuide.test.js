const { assert } = require('chai');
const requests = require('./utils/guidesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks, addGuideMocks } = require('./utils/dbMockFactory');

require('../src/app.js');

describe('Delete guide', () => {
  let response;
  const token = 'fakeToken';

  beforeEach(cleanDb);

  describe('When the guide exists', () => {
    let guide;

    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: token,
      });
      const { courseId } = coursesAndCreators.courses[0];
      [guide] = await addGuideMocks({
        courseId,
        guidesAmount: 1,
      });
      response = await requests.deleteGuide({
        courseId,
        token,
        guideId: guide.guideId,
      });
    });

    it('status should be OK', () => assert.equal(response.status, 200));
    it('get guide should return not found', async () => {
      response = await requests.getGuide({
        courseId: guide.courseId,
        guideId: guide.guideId,
        token
      });
      assert.equal(response.status, 404);
    });
  });
});
