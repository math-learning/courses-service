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
  const guide = await guidesService.addGuide({ courseId, name, description });
  return res.status(201).json(guide);
};

const deleteGuide = async (req, res) => {
  const { courseId, guideId } = req.params;
  await guidesService.deleteGuide({ guideId, courseId });
  return res.status(200);
};
const updateGuide = async (req, res) => {
  const { courseId, guideId } = req.params;
  const { name, description } = req.body;
  await guidesService.updateGuide({
    courseId, guideId, name, description
  });
  return res.status(200).json();
};

module.exports = {
  getGuides,
  addGuide,
  deleteGuide,
  updateGuide,
};
