/** middleware that process request query and route parameters */

/**
 * This middleware processes route parameters for Order routes
 */
async function getParams(req, res, next) {
  /** extract the projectname parameter from route */
  const { projectname } = req.params;

  if (!projectname) {
    res.status(400).send({ message: 'Project name not supplied. Check URL' });
  } else {
    req.project = projectname;
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
    res.status(400).send({ message: 'Query string has no ID parameter' });
  } else {
    req.id = id;
  }
  next();
}
module.exports = {
  getParams,
  getQueryId,
};
