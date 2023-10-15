const Parcel = require('../models/parcel');
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
    console.log(isValidBody, isValidParcelSchema);

    if (isValidBody.code === 0 && isValidParcelSchema.code === 0) {
      /** Proceed with the request */
      const parcel = new Parcel({
        name: req.body.type,
        project: req.project,
        schema: req.body.schema,
        tags: req.body.tags || [`${req.body.type}`],
        createdby: req.user.email,
      });
      parcel.save(parcel).then(
        (data) => {
          res.status(201).send({
            message: 'Parcel Type added succesfully!',
            details: {
              name: `${data.name}`,
              project: data.project,
              createdby: data.createdby,
              date: data.createdon,
              id: data._id,
            },
          });
        },
      ).catch(
        (error) => {
          res.send({ message: error });
          console.error('Error in newType function', error);
        },
      );
    } else {
      res.status(400).send({
        status: 'Failed',
        message: 'Missing Fields in Request',
        missing: [[(isValidBody.lenth !== 0) ? isValidBody.message : ['']], [(isValidParcelSchema.length !== 0) ? isValidParcelSchema.message : ['']]],
      });
    }
  }

  /**
   * This function retrieves all the parcel types in the project
   */
  static async getParcels(req, res) {
    /** Return all projects */
    try {
      const parcels = await Parcel.find({ project: req.project });
      if (parcels.length === 0) {
        res.send({ status: 'Success', message: 'There no parcels to show' });
      }
      res.status(200).send(parcels);
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
      const deleted = await Parcel.deleteOne({ _id: req.id });
      if (deleted.deletedCount !== 0) {
        res.status(200).send({ status: 'Success', message: `Deleted: ${deleted.deletedCount} parcel types` });
      }
      res.send({ status: 'Success', message: `No parcel types of ID: ${req.id}. Deleted ${deleted.deletedCount} parcels` });
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
      const parcel = await Parcel.findByIdAndUpdate(
        req.id,
        { $push: { 'schema.fields': { $each: req.body } } },
        { new: true }, // To return the updated document
      );
      res.send(parcel);
    } catch (error) {
      console.error('Error in addTypeField', error);
    }
  }
}

module.exports = ParcelController;
