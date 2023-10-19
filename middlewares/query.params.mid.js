/** middleware that process request query and route parameters */
const Project = require('../models/project');
/**
 * This middleware processes route parameters for Order routes
 */
async function getParams(req, res, next) {
  /** extract the projectname parameter from route */
  const { projectname, imagename } = req.params;
  console.log(projectname);
  if (projectname) {
    await Project.findOne({ name: projectname, createdby: req.user.email }).then((doc) => {
      console.log(doc);
      if (doc === null) {
        res.status(400).send({
          status: 'Failed',
          error: 'Project not found',
          message: `The requested resource cannot be found in project ${projectname}. Spelling issues? Or create a new one with name ${projectname}`,
        });
      } else {
        req.project = projectname;
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  if (imagename !== null || imagename !== undefined) {
    req.imagename = imagename;
  }
  next();
}

/**
 * This middleware processes query parameters for the getOrderByID route
 * @todo: this will block the request if id is not passed as query param
 */
async function getQueryId(req, res, next) {
  const { id } = req.query;
  if (!id) {
    res.status(400).send({
      status: 'Failed',
      error: 'Query String has no ID parameter',
      message: 'check the query parameters for a missing ID',
    });
  } else {
    req.id = id;
  }
  next();
}
module.exports = {
  getParams,
  getQueryId,
};
