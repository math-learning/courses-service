const createError = require('http-errors');
const expressify = require('expressify')();
const guidesService = require('../services/guidesService');

const getGuides = async (req, res) => {
  const { courseId } = req.params;
  const { limit, offset } = req.query;
  const guides = await guidesService.getGuides({ courseId, limit, offset });
  return res.status(200).json(guides);
};

const addGuide = async (req, res) => {
  const { courseId } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return Promise.reject(createError.BadRequest('name or description has not been provided'));
  }
  const guide = await guidesService.addGuide({ courseId, name, description });
  return res.status(201).json(guide);
};

const deleteGuide = async (req, res) => {
  const { courseId, guideId } = req.params;
  await guidesService.deleteGuide({ guideId, courseId });
  return res.status(200).json({});
};

const updateGuide = async (req, res) => {
  const { courseId, guideId } = req.params;
  const { name, description } = req.body;
  await guidesService.updateGuide({
    courseId, guideId, name, description
  });
  const guide = {
    courseId,
    guideId,
    name,
    description,
  };
  return res.status(200).json(guide);
};

const getGuide = async (req, res) => {
  const { courseId, guideId } = req.params;
  const guide = await guidesService.getGuide({ guideId, courseId });
  return res.status(200).json(guide);
};

module.exports = expressify({
  getGuides,
  getGuide,
  addGuide,
  deleteGuide,
  updateGuide,
});
