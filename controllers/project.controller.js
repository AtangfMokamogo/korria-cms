const Project = require('../models/project');

/**
 * Implements controllers that define project creation, management and deletion.
 * @class
 */
class ProjectController {
  /**
    * This function creates a new project in database
    */
  static async newProject(req, res) {
    /** create a new project object by obtaining credentials from request */
    const project = new Project({
      name: req.body.name,
      createdby: req.user.firstname,
    });

    console.log(req.user.firstname);
    /** Attempt to save the new project to database */
    project.save(project).then(
      (data) => {
        res.status(201).send({ message: 'project added succesfully!', details: { name: `Project: ${data.name}`, createdby: data.createdby, date: data.createdon } });
      },
    ).catch(
      (error) => {
        res.send({ message: error });
        console.error('Error in newProject function', error);
      },
    );
  }
}

module.exports = ProjectController;
