// @flow

const express = require('express');

const { isAdmin } = require('../utils').middleware;
const getClassmates = require('./get-classmates');
const banUser = require('./ban-user');

// ADMIN ONLY: All admin routes are authenticated by isAdmin
const adminRouter = express.Router();
adminRouter.use(isAdmin);

adminRouter.get('/classmates', getClassmates.handler);
adminRouter.post('/ban/:userId', banUser.handler);

module.exports = adminRouter;
