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

  describe('When the course exists', () => {
    let expectedCourse;

    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: fakeToken });
      expectedCourse = coursesAndCreators.courses[0]; // eslint-disable-line
      response = await requests.getCourse({ token: fakeToken, courseId: expectedCourse.courseId });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('body is the course', () => assert.deepEqual(response.body, expectedCourse));
  });

  describe('When the course does not exist', () => {
    beforeEach(async () => {
      response = await requests.getCourse({ token: fakeToken, courseId: 'inexistent' });
    });

    it('should return NOT FOUND', () => assert.equal(response.status, 404));
  });
});
