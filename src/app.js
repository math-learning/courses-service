const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const configs = require('../configs');
const errorMiddleware = require('./middlewares/errorMiddleware');
const initialMiddleware = require('./middlewares/initialMiddleware');
const requestLoggerMiddleware = require('./middlewares/requestLoggerMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');

const statusController = require('./controllers/statusController');
const coursesController = require('./controllers/coursesController');
const usersController = require('./controllers/usersController');
// const guidesController = require('./controllers/coursesController');

const app = express();
const { port } = configs.app;

//  Body parser middleware
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);

// Routes
router.get('/ping', (req, res) => statusController.ping(req, res));

router.use(initialMiddleware);
router.use(authMiddleware);

// Courses
router.get('/courses', coursesController.getCourses);
router.post('/courses', coursesController.addCourse);
router.get('/courses/:courseId', coursesController.getCourse);
router.put('/courses/:courseId', coursesController.updateCourse);
router.delete('/courses/:courseId', coursesController.deleteCourse);

// Users
router.get('/courses/:courseId/users', usersController.getCourseUsers);
// router.post('/courses/:courseId/users', usersController.addUserToCourse);
// router.delete('/courses/:courseId/users/:userId', usersController.deleteUserFromCourse);
// router.patch('/courses/:courseId/users/:userId', usersController.updateUserFromCourse);
//
// // Guides
// router.get('/courses/:courseId/guides', guidesController.getGuidesFromCourse);
// router.post('/courses/:courseId/guides', guidesController.addGuideToCourse);
// router.get('/courses/:courseId/guides/:guideId', guidesController.getCourseGuide);
// router.patch('/courses/:courseId/guides/:guideId', guidesController.updateCourseGuide);
// router.delete('/courses/:courseId/guides/:guideId', guidesController.deleteGuideFromCourse);


app.use(router);

app.use(errorMiddleware);

//  Setting the invalid enpoint message for any other route
app.get('*', (req, res) => {
  res.status(400).json({ message: 'Invalid endpoint' });
});

//  Start server on port
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
