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
    req.name = projectname;
  }
  next();
}

module.exports = {
  getParams,
};
