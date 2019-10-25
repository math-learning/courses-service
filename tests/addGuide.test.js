const { assert } = require('chai');
const requests = require('./utils/guidesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks } = require('./utils/dbMockFactory');

// Starts the app
require('../src/app.js');

describe('Add guide', () => {
  let response;
  const token = 'diego';
  let guide;

  beforeEach(cleanDb);

  describe('When is successfully added', () => {
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

  describe('When the course does not exist', () => {
    beforeEach(async () => {
      guide = {
        courseId: 'nonexistent',
        guideId: 'guia1',
        name: 'guia 1',
        description: 'primera guia de la materia'
      };
      response = await requests.addGuide({ courseId: guide.courseId, token, guide });
    });

    it('should return BAD REQUEST', () => assert.equal(response.status, 400));
  });

  // TODO: do this cases
  describe('When the user do not have permissions over the course', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: 'anId' });
      const { courseId } = coursesAndCreators.courses[0];
      guide = {
        courseId,
        guideId: 'guia1',
        name: 'guia 1',
        description: 'primera guia de la materia'
      };
      response = await requests.addGuide({ courseId, token, guide });
    });

    it('should return Unauthorized', () => assert.equal(response.status, 401));
  });

  describe('When there are missing fields', () => {
    it('it should return BAD REQUEST', async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: token,
      });
      const { courseId } = coursesAndCreators.courses[0];

      guide = {
        description: 'primera guia de la materia'
      };
      // Missing name
      response = await requests.addGuide({ courseId, token, guide });
      assert.equal(response.status, 400);

      guide = {
        name: 'guia 1',
      };
      // Missing description
      response = await requests.addGuide({ courseId, token, guide });
      assert.equal(response.status, 400);
    });
  });

  describe('When the guide already exist', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: token });
      const { courseId } = coursesAndCreators.courses[0];
      guide = {
        courseId,
        guideId: 'guia1',
        name: 'guia 1',
        description: 'primera guia de la materia'
      };
      response = await requests.addGuide({ courseId, token, guide });
      response = await requests.addGuide({ courseId, token, guide });
    });

    it('should return status CONFLICT', () => assert.equal(response.status, 409));
  });
});
