const path = require('path');
const fs = require('fs');
const ImageType = require('../models/image');
const TextType = require('../models/text');
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
    const basePath = path.join(__dirname, '..', 'uploads', 'content', `${req.project}`, 'images');
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
      title: `${req.body.title}${path.extname(req.file.originalname)}`,
      type: req.body.type,
      src: `http://localhost:8080/uploads/content/${req.project}/images/${req.body.title}${path.extname(req.file.originalname)}`,
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
      const image = ImageType.find({ title: req.body.title, project: req.project });

      /** check for the image existence in provided project */
      if (image) {
        const deleted = await ImageType.deleteOne(
          { title: req.body.title },
          { project: req.project },
        );
        if (deleted.deletedCount !== 0) {
          res.status(200).send({
            status: 'Success',
            message: `Deleted: ${deleted.deletedCount} images`,
          });
        }
        /** Remove Image from System */

        const basePath = path.join(__dirname, '..', 'uploads', 'content', `${req.project}`, 'images');
        const imageToDelete = `${req.body.title}`;
        const filePath = path.join(basePath, imageToDelete);

        if (fs.existsSync(filePath)) {
          console.log(filePath);
          fs.unlinkSync(filePath);
        }
      }

      /** No image prooceed with error in response */
      res.status(400).send({
        status: 'Failed',
        error: 'Image not found in project',
        message: 'Check images, Perhaps its been deleted',
      });
    } catch (error) {
      console.error('Error in removeImage controller', error);
      res.status(500);
    }
  }

  /** IMAGE CONTENT SERVER CONTROLLERS */

  /**
   * This function process a request to serve images
   */
  static async serveImageFile(req, res) {
    try {
      const basePath = path.join(__dirname, '..', 'uploads', 'content', `${req.project}`, 'images');
      const imageToServe = `${req.imagename}`;
      const filePath = path.join(basePath, imageToServe);

      if (fs.existsSync(filePath)) {
        res.status(200).sendFile(filePath);
      }
    } catch (error) {
      console.error('Error in serveImageFile controller', error);
    }
  }

  /** TEXT CONTENT TYPE CONTROLLERS */

  /**
   * This function adds a new text field to database and
   */
  static async addText(req, res) {
    const validTextSchema = ['fieldtype', 'content'];
    const isValidBody = await validateReqSchema(req, validTextSchema);
    const basePath = path.join(__dirname, '..', 'uploads', 'content', `${req.project}`, 'texts');

    const jsonSaveState = await jsonifyTextType(basePath, req.body, req.project, req.body.order);
    if (jsonSaveState.code === 0) {
      req.JSONIFIED = true;
    }

    if (isValidBody.code === 0) {
      const textField = new TextType({
        fieldtype: req.body.fieldtype,
        content: {
          title: req.body.content.title,
          payload: req.body.content.payload,
          tags: req.body.content.tags || [`admin-${req.body.type}`],
          createdby: req.user.email,
          project: req.project,
          order: Object.prototype.hasOwnProperty.call(req.body.content, 'order') ? req.body.content.order : `${req.project}`,
        },
      });
      textField.save(textField).then(
        (data) => {
          res.status(201).send({
            message: 'text added succesfully!',
            details: {
              fieldtype: data.fieldtype,
              content: {
                title: data.content.title,
                payload: data.content.payload,
                tags: data.content.tags,
                createdby: data.content.createdby,
                project: data.content.project,
                order: data.content.order,
                createdon: data.content.createdon,
                id: data._id,

              },
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

  /**
   * This function retrieves all texts data in a project
   */
  static async getText(req, res) {
    try {
      const files = await TextType.find({ project: req.project });
      if (files.length === 0) {
        res.send({ status: 'Success', message: 'There no files to show' });
      }
      res.status(200).send({
        status: 'Success',
        content: files,
      });
    } catch (error) {
      console.error('Error in getText controller', error);
      res.status(500);
    }
  }

  /**
   * This function deletes a text type from project by its id
   */
  static async deleteText(req, res) {
    try {
      const deleted = await TextType.deleteOne(
        { _id: req.id },
        { project: req.projectc },
      );
      if (deleted.deletedCount !== 0) {
        res.status(200).send({
          status: 'Success',
          message: `Deleted: ${deleted.deletedCount} text of ID: ${req.id} from project: ${req.project}`,
        });
      }
      res.status(400).send({
        status: 'Failed',
        error: `Text data of id: ${req.id} or Project: ${req.project} not available, check the list of available projects`,
        message: `No text types of ID: ${req.id} in project: ${req.project}. Deleted ${deleted.deletedCount} texts`,
      });
    } catch (error) {
      console.error('Error in deleteText controller', error);
      res.status(500);
    }
  }
}
module.exports = TypeController;
