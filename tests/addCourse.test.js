const { assert, expect } = require('chai');
const requests = require('./utils/coursesRequests');
const { cleanDb } = require('./utils/db');

// Starts the app
require('../src/app.js');

describe('Add course', () => {
  let response;
  const fakeToken = 'diego';

  before(() => cleanDb());
  afterEach(() => cleanDb());

  let courseToBeAdded;

  describe('When is successfully added', () => {
    beforeEach(async () => {
      courseToBeAdded = {
        name: 'curso',
        description: 'un curso mas',
        courseId: 'curso',
      };
      response = await requests.addCourse({
        name: courseToBeAdded.name,
        description: courseToBeAdded.description,
        token: fakeToken
      });
    });

    it('status is OK', () => assert.equal(response.status, 201));

    it('get course should return the course added', async () => {
      response = await requests.getCourses({ token: fakeToken });
      const courses = response.body;
      expect(courses).to.deep.include(courseToBeAdded);
    });
  });
});
