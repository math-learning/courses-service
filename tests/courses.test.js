const { assert } = require('chai');
const requests = require('./utils/requests');
const mocks = require('./utils/mocks');
const { knex, cleanDb, sanitizeResponse } = require('./utils/db');

// Starts the app
require('../src/app.js');

describe('Integration courses tests', () => {
  let response;

  before(() => cleanDb());
  afterEach(() => cleanDb());

  describe('Get courses', () => {
    let courseName;
    let courseId;
    let courseDescription;

    beforeEach(() => {
      courseId = 'coursename';
      courseName = 'course name';
      courseDescription = 'course description';
    });

    describe('When there are courses', () => {
      let expectedCourse;

      beforeEach(async () => {
        expectedCourse = {
          courseId, name: courseName, description: courseDescription
        };

        await knex('courses').insert([
          {
            course_id: 'course id',
            name: 'course name',
            description: 'course description',
          },
        ]);
        await knex('course_users').del();
        await knex('course_users').insert([
          {
            course_id: 'course id',
            user_id: 'user id',
            role: 'role'
          },
        ]);
        await knex('guides').del();
        await knex('guides').insert([
          {
            course_id: 'course id',
            guide_id: 'guide id',
            description: 'description',
          },
        ]);
      });

      beforeEach(async () => {
        response = await requests.getCourses();
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('body has the user', () => assert.deepEqual(sanitizeResponse(response.body), expectedCourse));
    });
  });
});
