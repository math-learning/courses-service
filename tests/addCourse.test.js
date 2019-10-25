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

  beforeEach(async () => {
    courseToBeAdded = {
      name: 'curso',
      description: 'un curso mas',
      courseId: 'curso',
    };
  });

  describe('When is successfully added', () => {
    beforeEach(async () => {
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

  describe('When already exists', () => {
    beforeEach(async () => {
      response = await requests.addCourse({
        name: courseToBeAdded.name,
        description: courseToBeAdded.description,
        token: fakeToken
      });
      response = await requests.addCourse({
        name: courseToBeAdded.name,
        description: courseToBeAdded.description,
        token: fakeToken
      });
    });

    it('should return code 409', () => assert.equal(response.status, 409));
  });

  describe('When there are missing fields', () => {
    it('should return BAD REQUEST', async () => {
      // Missing name
      response = await requests.addCourse({
        description: courseToBeAdded.description,
        token: fakeToken
      });
      assert.equal(response.status, 400);
      // Missing description
      response = await requests.addCourse({
        name: courseToBeAdded.name,
        token: fakeToken
      });
      assert.equal(response.status, 400);
    });
  });
});
