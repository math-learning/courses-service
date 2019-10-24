const { assert } = require('chai');
const requests = require('./utils/guidesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks } = require('./utils/dbMockFactory');

// Starts the app
require('../src/app.js');

describe('Add guide', () => {
  let response;
  const token = 'diego';

  before(cleanDb);
  afterEach(cleanDb);

  describe('When is successfully added', () => {
    let guide;
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: token,
      });
      const { courseId } = coursesAndCreators.courses[0];
      guide = {
        courseId,
        guideId: 'guia1',
        name: 'guia 1',
        description: 'primera guia de la materia'
      };
      response = await requests.addGuide({ courseId, token, guide });
    });

    it('status is CREATED', () => assert.equal(response.status, 201));
    it('body contains the course', () => assert.deepEqual(response.body, guide));
  });
});
