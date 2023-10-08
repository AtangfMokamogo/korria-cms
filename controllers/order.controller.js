const Order = require('../models/order');

/**
 * Implements controllers that create, manage and removes orders
 * @class
 */

class OrderController {
  /**
    * This function creates a new order
    */
  static async newOrder(req, res) {
    /** get order options from req and email from the req.user  */
    const order = new Order({
      name: req.body.name,
      tags: [req.body.tags || `#${req.body.name}`],
      project: req.name,
      createdby: req.user.email,
    });
    /** save the info to databse and return the details */

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
}

module.exports = OrderController;
