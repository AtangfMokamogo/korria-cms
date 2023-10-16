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
      createdby: req.user.email,
    });

    /** Attempt to save the new project to database */
    project.save(project).then(
      (data) => {
        res.status(201).send({
          message: 'project added succesfully!',
          name: `Project: ${data.name}`,
          createdby: data.createdby,
          date_created: data.createdon,
          project_id: data._id,
        });
      },
    ).catch(
      (error) => {
        res.send({ message: error });
        console.error('Error in newProject function', error);
      },
    );
  }

  /**
   * This Function retrieves all projects created by an associated user
   */
  static async getProjects(req, res) {
    try {
      const projects = await Project.find({ createdby: req.user.email }).sort({ createdon: -1 });
      res.status(201).json({ projects });
    } catch (error) {
      console.error('error in getProjects', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  static async deleteProject(req, res) {
    try {
      /** find a project by the specified project name and delete it */
      /** check for missing fields */
      if (!req.body.project || !req.body.id) {
        res.status(400).send({
          status: 'Failed',
          error: 'Missing parameters in request',
          message: 'id or project fields missing',
        });
      }
      const results = await Project.deleteOne({
        _id: req.body.id,
        name: req.body.project,
      });
      if (results.deletedCount !== 0) {
        res.status(201).send({
          status: 'Success',
          message: `Project ${req.body.project}: Deleted Successfully`,
          user: req.user.email,
          date: Date.now,
        });
      } else {
        res.status(200).send({
          status: 'Failed',
          error: `Project ${req.body.project} of ID: ${req.body.id}. Is not available`,
          message: 'Could not find project to delete',
        });
      }
    } catch (error) {
      console.error('Error in deleteProject', error);
    }
  }
}

module.exports = ProjectController;
