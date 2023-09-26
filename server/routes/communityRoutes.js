import express from 'express';
const Router = express.Router();
import { authorizeRoles, authorizedSubscribers, isLoggedIn } from '../middlewares/authMiddleware.js';
import { exitCommunity, getAllCommunities, joinCommunity, createCommunity, updateCommunity, deleteCommunity } from '../controllers/communityController.js';
import upload from '../middlewares/multerMiddleware.js';

Router
    .route('/')
    .get(getAllCommunities)
    .post(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        upload.single('thumbnail'),
        createCommunity
    )

Router
    .route('/:communityId')
    .post(isLoggedIn, authorizedSubscribers, joinCommunity)
    .put(isLoggedIn, authorizeRoles('ADMIN'), updateCommunity)
    .delete(isLoggedIn, authorizeRoles('ADMIN'), deleteCommunity)
    .delete(isLoggedIn, exitCommunity)



export default Router;