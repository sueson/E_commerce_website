const express = require("express");
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder } = require("../controllers/orderController");
const {isAuthenticatedUser, authorizedRoles} = require("../middlewares/authenticate");

const Router = express.Router();

Router.route('/order/new').post(isAuthenticatedUser, newOrder);
Router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
Router.route('/myorders').get(isAuthenticatedUser, myOrders);

//Admin Routes..
Router.route('/admin/orders').get(isAuthenticatedUser,authorizedRoles('admin'), orders)  //only admin can access(authorizedRoles)...
Router.route('/admin/order/:id').put(isAuthenticatedUser,authorizedRoles('admin'), updateOrder)
                          .delete(isAuthenticatedUser,authorizedRoles('admin'), deleteOrder);

module.exports = Router;