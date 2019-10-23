const createError = require('http-errors');

const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../../configs');
const knex = require('knex')(configs.db); // eslint-disable-line
const GUIDES_TABLE = 'guides';

const getGuides = async ({
  courseId,
  limit,
  offset,
}) => knex.select()
  .from(GUIDES_TABLE)
  .where(snakelize(courseId))
  .offset(offset || configs.dbDefault.offset)
  .limit(limit || configs.dbDefault.limit)
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound('Courses not found');
    }
    return response;
  });


const addGuide = async ({ guide }) => knex.insert(guide)
  .into(GUIDES_TABLE);

const deleteGuide = async ({
  courseId,
  guideId,
}) => knex.delete()
  .from(GUIDES_TABLE)
  .where(snakelize({ courseId, guideId }));

const updateGuide = async ({
  courseId,
  guideId,
  name,
  description
}) => knex.update({ name, description })
  .from(GUIDES_TABLE)
  .where(snakelize({ courseId, guideId }));

module.exports = {
  getGuides,
  addGuide,
  deleteGuide,
  updateGuide,
};
