const Order = require('../models/order');
const Project = require('../models/project');

/**
 * Implements controllers that create, manage and removes orders
 * @class
 */

class OrderController {
  /**
    * This function creates a new order
    */
  static async newOrder(req, res) {
    /** Ensure project name supplied is in existence */
    const getProject = await Project.find({ name: req.project });
    if (getProject.length === 0) {
      res.status(400).send({
        status: 'Failed',
        error: 'Project does not exists',
        message: `cannot create order ${req.body.name} in an unavailable project`,
      });
    }

    const order = new Order({
      name: req.body.name,
      tags: [...req.body.tags || `#${req.body.name}`],
      project: req.project,
      createdby: req.user.email,
    });
    /** save the info to database and return the details */

    order.save(order).then(
      (data) => {
        res.status(201).send({
          message: 'collection added succesfully!',

          name: data.name,
          project: data.project,
          createdby: data.createdby,
          date: data.createdon,
          id: data._id,

        });
      },
    ).catch(
      (error) => {
        res.send({ message: error });
        console.error('Error in newOrder function', error);
      },
    );
  }

  /**
   * This function retrievs a collection of orders based on a tag
   */
  static async getOrderByTags(req, res) {
    try {
      const query = req.body.tags;
      if (query) {
        const orders = await Order.find({ tags: { $in: [...query] } });

        if (orders.length !== 0) {
          res.status(200).json({
            status: 'Success',
            orders,
          });
        } else {
          res.status(201).send({
            status: 'Failed',
            error: 'Order does not exist',
            message: `No Orders Associated With Tags: ${req.body.tags}`,
          });
        }
      }
    } catch (error) {
      console.error('Error in getOrderByTags: ', error);
      res.status(500);
    }
  }

  /**
   * This function retrives an Order by its ID
   */
  static async getOrderById(req, res) {
    try {
      const orders = await Order.findById(req.id);

      if (orders) {
        res.status(200).send({
          status: 'Success',
          orders: [orders],
        });
      } else {
        res.status(200).send({
          status: 'Failed',
          message: `No Order of ${req.id}`,
        });
      }
    } catch (error) {
      console.error('Error in getOrderById', error);
      res.status(500);
    }
  }

  /**
   * This function deletes an order by its id
   */
  static async removeOrderById(req, res) {
    try {
      const deleted = await Order.deleteOne({ _id: req.id });
      if (deleted.deletedCount > 0) {
        res.status(200).send({
          status: 'Success',
          message: `Deleted: ${deleted.deletedCount} Orders of ID: ${req.id}`,
        });
      }
      res.status(200).send({
        status: 'Failed',
        error: 'Order associated with id does not exists',
        message: `Deleted: ${deleted.deletedCount} Orders of ID: ${req.id}`,
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        res.status(400).send({
          status: 'Failed',
          message: 'Check your ID',
        });
      }
      console.error('error in deleteOrderById controller', error);
      res.status(400);
    }
  }
}

module.exports = OrderController;
