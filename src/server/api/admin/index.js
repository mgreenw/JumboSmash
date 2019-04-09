// @flow

const express = require('express');

const { isAdmin } = require('../utils').middleware;
const getClassmates = require('./get-classmates');

// ADMIN ONLY: All admin routes are authenticated by isAdmin
const adminRouter = express.Router();
adminRouter.use(isAdmin);

adminRouter.get('/classmates', getClassmates.handler);

module.exports = adminRouter;
