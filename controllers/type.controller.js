const path = require('path');
const fs = require('fs');
const ImageType = require('../models/image');
const TextField = require('../models/text');
const jsonifyTextType = require('../utils/json.utils');
const { validateReqSchema } = require('../utils/schema.utils');

class TypeController {
  /**
   * This function adds a new image content field to a type
   */
  static async addImage(req, res) {
    /** Verify Supported Image File Types */
    const imageTypes = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.apng', '.avif'];
    if (!imageTypes.includes(path.extname(req.file.originalname))) {
      res.status(400).send({
        status: 'Failed',
        error: `Files of type: '${path.extname(req.file.originalname)}' are not supported.`,
        message: `Please upload images of type ${imageTypes} only`,
      });
    }

    /** Upload Directory Setup */
    const basePath = path.join(__dirname, '..', 'uploads', `${req.project}`, 'images', Object.prototype.hasOwnProperty.call(req.body, 'order') ? req.body.order : `${req.project}-default-images`);
    fs.mkdirSync(basePath, { recursive: true });
    const tempPath = req.file.path;
    const newFileName = `${req.body.title}${path.extname(req.file.originalname)}`;
    const targetPath = path.join(basePath, newFileName);
    fs.chmod(targetPath, 0o770, () => console.log('permit copy'));
    fs.chmod(tempPath, 0o770, () => console.log('permit paste'));

    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          status: 'Failed',
          message: err,
        });
      }
    });

    /** Save Image Info To Database */
    const imagetype = new ImageType({
      title: req.body.title,
      type: req.body.type,
      src: `localhost:8080/uploads/${req.project}/images/${req.body.order !== undefined ? req.body.order : `${req.project}-default-images`}/${req.body.title}${path.extname(req.file.originalname)}`,
      alt: req.body.alt,
      order: req.body.order,
      project: req.project,
    });
    imagetype.save(imagetype).then(
      (data) => {
        res.status(201).send({
          status: 'Success',
          message: 'Parcel image added succesfully!',
          details: {
            name: `${data.title}`,
            type: data.type,
            src: data.src,
            alt: data.alt,
            order: data.order,
            project: data.project,
            createdon: data.createdon,
            _id: data.id,
          },
        });
        console.log(data);
      },
    ).catch(
      (error) => {
        res.send({ message: error });
        console.error('Error in addImage controller', error);
      },
    );
  }

  /**
   * This function retrieves all images in the project
   */
  static async getImages(req, res) {
    try {
      const files = await ImageType.find({ project: req.project });
      if (files.length === 0) {
        res.send({ status: 'Success', message: 'There no files to show' });
      }
      res.status(200).send({
        status: 'Success',
        content: files,
      });
    } catch (error) {
      console.error('Error in getImages controller', error);
      res.status(500);
    }
  }

  /**
   * This Function removes an image content from system
   */
  static async removeImage(req, res) {
    try {
      console.log(req.body.title);
      const deleted = await ImageType.deleteOne({ title: req.body.title });
      if (deleted.deletedCount !== 0) {
        res.status(200).send({ status: 'Success', message: `Deleted: ${deleted.deletedCount} textField types` });
      }
      res.send({ status: 'Success', message: `No textField types of ID: ${req.id}. Deleted ${deleted.deletedCount} files` });

      /** Remove Image from System */

      const basePath = path.join(__dirname, '..', 'uploads', `${req.project}`, 'images', Object.prototype.hasOwnProperty.call(req.body, 'order') ? req.body.order : 'project-images');
      const imageToDelete = `${req.body.title}`;
      const filePath = path.join(basePath, imageToDelete);

      if (fs.existsSync(filePath)) {
        console.log(filePath);
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error in removeImage controller', error);
      res.status(500);
    }
  }

  /** TEXT CONTENT TYPE CONTROLLERS */

  /**
   * This function adds a new text field to database and
   */
  static async addText(req, res) {
    const validTextSchema = ['title', 'data_type', 'payload'];
    const isValidBody = await validateReqSchema(req, validTextSchema);
    const basePath = path.join(__dirname, '..', 'uploads', `${req.project}`, 'texts', Object.prototype.hasOwnProperty.call(req.body, 'order') ? req.body.order : 'project-texts');

    const jsonSaveState = await jsonifyTextType(basePath, req.body, req.project, req.body.order);
    if (jsonSaveState.code === 0) {
      req.JSONIFIED = true;
    }

    if (isValidBody.code === 0) {
      const textField = new TextField({
        title: req.body.title,
        data_type: req.body.type,
        payload: req.body.payload,
        tags: req.body.tags || [`admin-${req.body.type}`],
        createdby: req.user.email,
        project: req.project,
        order: Object.prototype.hasOwnProperty.call(req.body, 'order') ? req.body.order : 'project-texts',
      });
      textField.save(textField).then(
        (data) => {
          res.status(201).send({
            message: 'text added succesfully!',
            details: {
              id: data._id,
              title: `${data.title}`,
              data_type: data.data_type,
              payload: data.payload,
              tags: data.tags,
              createdby: data.createdby,
              createdon: data.createdon,
              project: data.project,
              order: data.order,
              JSONIFIED: req.JSONIFIED,
              json_key: data.order,
            },
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
}
module.exports = TypeController;
