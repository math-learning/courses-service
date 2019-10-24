const guides = require('../databases/guidesDb');

const getGuides = async ({
  courseId,
  limit,
  offset,
}) => guides.getGuides({ courseId, limit, offset });

const addGuide = async ({
  courseId,
  name,
  description,
}) => {
  const guideId = name.toLowerCase().replace(' ', '');
  const guide = {
    guideId,
    courseId,
    name,
    description,
  };
  await guides.addGuide({ guide });
  return guide;
};

const deleteGuide = async ({
  courseId,
  guideId,
}) => guides.deleteGuide({ courseId, guideId });

const updateGuide = async ({
  courseId,
  guideId,
  name,
  description,
}) => guides.updateGuide({
  courseId,
  guideId,
  name,
  description
});


module.exports = {
  getGuides,
  addGuide,
  deleteGuide,
  updateGuide,
};
