const { assert } = require('chai');
const requests = require('./utils/coursesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks } = require('./utils/dbMockFactory');

// Starts the app
require('../src/app.js');


describe('Delete course', () => {
  let response;
  const fakeToken = 'diego';

  before(() => cleanDb());
  afterEach(() => cleanDb());

  describe('When there are courses', () => {
    let courses;
    let courseToDelete;

    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 3, creatorId: 'diego' });
      courses = coursesAndCreators.courses;
      courseToDelete = courses[0]; // eslint-disable-line
      response = await requests.deleteCourse({
        token: fakeToken,
        courseId: courseToDelete.courseId
      });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('get deleted course returns 404', async () => {
      response = await requests.getCourse({ courseId: courseToDelete.courseId, token: fakeToken });
      assert.deepEqual(response.status, 404);
    });
  });
});
