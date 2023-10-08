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
          details: {
            name: `Project: ${data.name}`,
            createdby: data.createdby,
            date: data.createdon,
            id: data._id,
          },
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
    /** First extract */
    try {
      const projects = await Project.find({ createdby: req.user.email }).sort({ createdon: -1 });
      res.status(201).json(projects);
    } catch (error) {
      console.error('error in getProjects', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  static async deleteProject(req, res) {
    try {
      /** find a project by the specified project name and delete it */
      const results = await Project.deleteOne({ _id: req.body._id, name: req.body.name });
      if (results !== 0) {
        res.status(201).send({
          message: `Project ${req.body.name}: Deleted Successfully`,
          user: req.user.email,
          date: Date.now,
        });
      } else {
        res.status(200).send({
          error: `Project ${req.body.name} of ID: ${req.body._id}. Is not available`,
          message: 'Could not find project to delete',
        });
      }
    } catch (error) {
      console.error('Error in deleteProject', error);
    }
  }
}

module.exports = ProjectController;
