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
    let expectedCourses;
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 3, creatorId: fakeToken });
      expectedCourses = coursesAndCreators.courses;
      response = await requests.getCourses({ token: fakeToken });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('body has the course', () => assert.deepEqual(response.body, expectedCourses));
  });
});
