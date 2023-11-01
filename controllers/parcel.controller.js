const Parcel = require('../models/parcel');
const Project = require('../models/project');
const { validateReqSchema, validateParcelTypeSchema } = require('../utils/schema.utils');

const validReqBodyKeys = ['type', 'schema'];

/**
 * Defines the controllers that create, modify and delete parcel types
 */
class ParcelController {
  /**
     * This function creates a new parcel type
     */
  static async newType(req, res) {
    /** Validate the request body */
    const isValidBody = await validateReqSchema(req, validReqBodyKeys);
    const isValidParcelSchema = await validateParcelTypeSchema(req);
    console.log(isValidBody, isValidParcelSchema, req.project);

    if (isValidBody.code === -1) {
      res.status(400).send({
        status: 'Failed',
        message: 'Missing Fields in Request',
        missing: [[(isValidBody.length !== 0) ? isValidBody.message : ['']], [(isValidParcelSchema.length !== 0) ? isValidParcelSchema.message : ['']]],
      });
    }
    if (isValidParcelSchema.code === -1) {
      res.status(400).send({
        status: 'Failed',
        error: 'Invalid schema body',
        message: 'Check fields property in schema. At least one content data has to be present',
      });
    }

    if (isValidBody.code === 0 && isValidParcelSchema.code === 0) {
      /** Proceed with the request */
      const parcel = new Parcel({
        name: req.body.type,
        project: req.project,
        order: req.body.order,
        schema: req.body.schema,
        tags: req.body.tags || [`${req.body.type}`],
        createdby: req.user.email,
      });
      parcel.save(parcel).then(
        (data) => {
          res.status(201).send({
            id: data._id,
            status: 'Success',
            message: 'Parcel Type added succesfully!',
            name: `${data.name}`,
            project: data.project,
            order: data.order,
            tags: data.tags,
            createdby: data.createdby,
            date: data.createdon,
          });
        },
      ).catch(
        (error) => {
          res.send({ message: error });
          console.error('Error in newType function', error);
        },
      );
    }
  }

  /**
   * This function retrieves all the parcel types in the project
   */
  static async getParcels(req, res) {
    /** Return all projects */
    try {
      const parcels = await Parcel.find({ project: req.project }).sort({ createdon: -1 });
      if (parcels.length === 0) {
        res.send({ status: 'Success', message: 'There no parcels to show' });
      }
      res.status(200).send({
        status: 'Success',
        parcels,
      });
    } catch (error) {
      console.error('Error in getParcels controller', error);
      res.status(500);
    }
  }

  /**
   * This function deletes a type from project
   */
  static async deleteParcel(req, res) {
    try {
      const deleted = await Parcel.deleteOne({ project: req.project, _id: req.id });
      if (deleted.deletedCount !== 0) {
        res.status(200).send({
          status: 'Success',
          message: `Deleted: ${deleted.deletedCount} parcel of ID: ${req.id} from project: ${req.project}`,
        });
      }
      res.status(400).send({
        status: 'Failed',
        error: `Parcel of id: ${req.id} or Project: ${req.project} not available, check the list of available projects`,
        message: `No parcel types of ID: ${req.id} in project: ${req.project}. Deleted ${deleted.deletedCount} parcels`,
      });
    } catch (error) {
      console.error('Error in deleteParcels controller', error);
      res.status(500);
    }
  }

  /**
   * This function adds new content field to parcel types
   */
  static async addTypeField(req, res) {
    /** find the type by passed id */
    /** add the new fields into the type defination schema>>fields array */
    try {
      const project = await Project.find({ project: req.project });
      if (!project) {
        res.status(400).send({
          status: 'Failed',
          error: `Could not find project: ${req.project}`,
          message: 'Check the name of the project passed in the path',
        });
      }
      if (req.body.length === 0) {
        res.status(400).send({
          status: 'Failed',
          error: 'Array of fields provided is empty',
          message: `Could not update parcel: ${req.id} with empty array provided`,
        });
      }
      const parcel = await Parcel.findByIdAndUpdate(
        req.id,
        { $push: { 'schema.fields': { $each: req.body } } },
        { new: true }, // To return the updated document
      );
      res.send({
        status: 'Success',
        parcel,
      });
    } catch (error) {
      console.error('Error in addTypeField', error);
    }
  }
}

module.exports = ParcelController;
