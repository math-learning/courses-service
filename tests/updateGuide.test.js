const { assert } = require('chai');
const requests = require('./utils/guidesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks, addGuideMocks } = require('./utils/dbMockFactory');

require('../src/app.js');

describe('Update guide', () => {
  let response;
  const token = 'fakeToken';

  beforeEach(cleanDb);

  describe('When the new guide data is correct and existed before', () => {
    let guides;
    let finalGuide;
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
      [finalGuide] = guides;
      finalGuide = {
        ...finalGuide,
        name: 'new name',
        description: 'new description'
      };
      response = await requests.updateGuide({
        courseId,
        token,
        guideId: finalGuide.guideId,
        name: finalGuide.name,
        description: finalGuide.description,
      });
    });

    it('status should be OK', () => assert.equal(response.status, 200));
    it('should return the existing guides', () => {
      assert.deepEqual(response.body, finalGuide);
    });
  });
});
