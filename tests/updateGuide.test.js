const { assert } = require('chai');
const requests = require('./utils/guidesRequests');
const userRequests = require('./utils/usersRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks, addGuideMocks } = require('./utils/dbMockFactory');

require('../src/app.js');

describe('Update guide', () => {
  let response;
  const token = 'fakeToken';
  let guides;
  let finalGuide;

  beforeEach(cleanDb);

  describe('When the new guide data is correct and existed before', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: token,
      });
      const { courseId } = coursesAndCreators.courses[0];
      guides = await addGuideMocks({
        courseId,
        guidesAmount: 1,
      });
      [finalGuide] = guides;
      finalGuide = {
        ...finalGuide,
        name: 'new name',
        description: 'new description'
      };
      response = await requests.updateGuide({
        courseId,
        token,
        guideId: finalGuide.guideId,
        name: finalGuide.name,
        description: finalGuide.description,
      });
    });

    it('status should be OK', () => assert.equal(response.status, 200));
    it('should return the existing guides', () => {
      assert.deepEqual(response.body, finalGuide);
    });
  });

  describe('When the guide does not exist', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: token,
      });
      const { courseId } = coursesAndCreators.courses[0];
      response = await requests.updateGuide({
        courseId,
        token,
        guideId: 'inexistent',
        name: 'new name',
        description: 'new description',
      });
    });

    it('should return NOT FOUND', () => assert.equal(response.status, 404));
  });

  describe('When the user does not have permission', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: 'otherCreator',
      });
      const { courseId } = coursesAndCreators.courses[0];
      guides = await addGuideMocks({
        courseId,
        guidesAmount: 1,
      });
      [finalGuide] = guides;
      finalGuide = {
        ...finalGuide,
        name: 'new name',
        description: 'new description'
      };
      response = await requests.updateGuide({
        courseId,
        token,
        guideId: finalGuide.guideId,
        name: finalGuide.name,
        description: finalGuide.description,
      });
    });

    it('should return Forbidden', () => assert.equal(response.status, 403));
  });

  describe('When a professor of the course tries to update', () => {
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1,
        creatorId: 'otherCreator',
      });
      const { courseId } = coursesAndCreators.courses[0];
      guides = await addGuideMocks({
        courseId,
        guidesAmount: 1,
      });
      [finalGuide] = guides;
      finalGuide = {
        ...finalGuide,
        name: 'new name',
        description: 'new description'
      };
      userRequests.addUser({
        courseId, userId: token, role: 'professor', token
      });
      response = await requests.updateGuide({
        courseId,
        token,
        guideId: finalGuide.guideId,
        name: finalGuide.name,
        description: finalGuide.description,
      });
    });

    it('status should be OK', () => assert.equal(response.status, 200));
    it('should return the existing guides', () => {
      assert.deepEqual(response.body, finalGuide);
    });
  });
});
