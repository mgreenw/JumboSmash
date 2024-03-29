// @flow

const express = require('express');

const { isAdmin } = require('../utils').middleware;
const getClassmates = require('./get-classmates');
const terminateUser = require('./terminate-user');
const reviewProfile = require('./review-profile');

// ADMIN ONLY: All admin routes are authenticated by isAdmin
const adminRouter = express.Router();
adminRouter.use(isAdmin);

adminRouter.get('/classmates', getClassmates.handler);
adminRouter.post('/classmates/:userId/terminate', terminateUser.handler);
adminRouter.post('/classmates/:userId/review', reviewProfile.handler);

module.exports = adminRouter;
