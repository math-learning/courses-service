const { assert } = require('chai');
const requests = require('./utils/coursesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks } = require('./utils/dbMockFactory');

// Starts the app
require('../src/app.js');

describe('Add course', () => {
  let response;
  const fakeToken = 'diego';

  before(() => cleanDb());
  afterEach(() => cleanDb());

  let finalCourse;

  describe('When is successfully added', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: fakeToken
      });
      const [firstCourse] = coursesAndCreators.courses;

      const name = 'curso';
      const description = 'un curso mas';
      finalCourse = { courseId: firstCourse.courseId, name, description };

      response = await requests.updateCourse({
        courseId: finalCourse.courseId,
        name: finalCourse.name,
        description: finalCourse.description,
        token: fakeToken
      });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('get course should return the course updated', async () => {
      response = await requests.getCourse({ courseId: finalCourse.courseId, token: fakeToken });
      assert.deepEqual(response.body, finalCourse);
    });
  });
});
