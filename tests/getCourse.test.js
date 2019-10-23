const { assert } = require('chai');
const requests = require('./utils/coursesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks } = require('./utils/dbMockFactory');

// Starts the app
require('../src/app.js');


describe('Get courses', () => {
  let response;
  const fakeToken = 'diego';

  before(() => cleanDb());
  afterEach(() => cleanDb());

  describe('When there are courses', () => {
    let expectedCourse;

    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: fakeToken });
      expectedCourse = coursesAndCreators.courses[0]; // eslint-disable-line
      response = await requests.getCourse({ token: fakeToken, courseId: expectedCourse.courseId });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('body has the course', () => assert.deepEqual(response.body, expectedCourse));
  });
});
