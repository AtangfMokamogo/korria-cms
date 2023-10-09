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
    const getProject = await Project.find({ name: req.name });
    if (getProject.length === 0) {
      res.status(400).send({ message: `cannot create order ${req.body.name} in project ${req.name}`, error: 'Project doesnt exists' });
    }

    const order = new Order({
      name: req.body.name,
      tags: [...req.body.tags || `#${req.body.name}`],
      project: req.name,
      createdby: req.user.email,
    });
    /** save the info to database and return the details */

    order.save(order).then(
      (data) => {
        res.status(201).send({
          message: 'collection added succesfully!',
          details: {
            name: `Order: ${data.name}`,
            createdby: data.createdby,
            date: data.createdon,
            id: data._id,
          },
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
          res.status(201).json(orders);
        } else {
          res.status(205).send({ message: `No Orders Associated With Tags: ${req.body.tags}` });
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
      const order = await Order.findById(req.id);

      if (order) {
        res.status(201).send(order);
      } else {
        res.status(205).send({ message: `No Order of ${req.id}` });
      }
    } catch (error) {
      console.error('Error in getOrderById', error);
      res.status(500);
    }
  }

  /**
   * This function deletes and order by its id
   */
  static async removeOrderById(req, res) {
    try {
      const deleted = await Order.deleteOne({ _id: req.body.id });
      if (deleted) {
        res.status(201).send({ status: 'Success', message: `Deleted: ${deleted.deletedCount} Orders of ID: ${req.body.id}` });
      }
    } catch (error) {
      console.error('error in deleteOrderById', error);
      res.status(500);
    }
  }
}

module.exports = OrderController;
