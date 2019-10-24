const chai = require('chai');

const { assert, expect } = chai;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const requests = require('./utils/coursesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks, addCourseUserMocks } = require('./utils/dbMockFactory');

chai.use(deepEqualInAnyOrder);

// Starts the app
require('../src/app.js');


describe('Get courses', () => {
  let response;
  const fakeToken = 'diego';

  before(() => cleanDb());
  afterEach(() => cleanDb());

  describe('When there are courses', () => {
    let expectedUsers;
    let courseId;

    // Set up database
    beforeEach(async () => {
      const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: fakeToken });
      courseId = coursesAndCreators.courses[0].courseId;
      const creator = coursesAndCreators.creators.filter((c) => c.courseId === courseId)[0];
      const mockUsers = await addCourseUserMocks({ courseId, usersAmount: 3, role: 'student' });
      expectedUsers = [creator];
      mockUsers.forEach((user) => expectedUsers.push(user));
      response = await requests.getCourseUsers({ token: fakeToken, courseId });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('body has the course', () => expect(response.body).to.deep.equalInAnyOrder(expectedUsers));
  });
});
