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

  describe('When the course exists', () => {
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

    it('should return status OK', () => assert.equal(response.status, 200));

    it('get course should return the course updated', async () => {
      response = await requests.getCourse({ courseId: finalCourse.courseId, token: fakeToken });
      assert.deepEqual(response.body, finalCourse);
    });
  });

  describe('When the user does not have permission', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: 'anotherCreator',
      });
      const [firstCourse] = coursesAndCreators.courses;

      response = await requests.updateCourse({
        courseId: firstCourse.courseId,
        name: 'new name',
        description: 'new description',
        token: fakeToken
      });
    });

    it('should return Forbidden', () => assert.equal(response.status, 403));
  });

  describe('When the course does not exist', () => {
    beforeEach(async () => {
      response = await requests.updateCourse({
        courseId: 'inexistent',
        name: 'new name',
        description: 'new description',
        token: fakeToken
      });
    });

    it('should return NOT FOUND', () => assert.equal(response.status, 404));
  });
});
