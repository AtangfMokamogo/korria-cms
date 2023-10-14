const path = require('path');
const fs = require('fs');
const ImageType = require('../models/types');

class TypeController {
  /**
   * This function adds a new image content
   */
  static async addImage(req, res) {
    const basePath = path.join(__dirname, '..', 'uploads', `${req.project}`, 'images', Object.prototype.hasOwnProperty.call(req.body, 'order') ? req.body.order : 'project-images');
    fs.mkdirSync(basePath, { recursive: true });
    const tempPath = req.file.path;
    const targetPath = path.join(basePath, req.file.originalname);
    fs.chmod(targetPath, 0o770, () => console.log('permit copy'));
    fs.chmod(tempPath, 0o770, () => console.log('permit paste'));

    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(200).send({
          status: 'Failed',
          message: err,
        });
      }
    });
    const imagetype = new ImageType({
      title: req.body.title,
      data_type: req.body.data_type,
      src: `localhost:8080/uploads/${req.project}/images/${req.body.order}/${req.file.filename}`,
      alt: req.body.alt,
      order: req.body.order,
    });
    imagetype.save(imagetype).then(
      (data) => {
        res.status(201).send({
          message: 'Parcel Type added succesfully!',
          details: {
            name: `${data.title}`,
            type: data.data_type,
            src: data.src,
            alt: data.alt,
            order: data.order,
            date: data.createdon,
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
}
module.exports = TypeController;
