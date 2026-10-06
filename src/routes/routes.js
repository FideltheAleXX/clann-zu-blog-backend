import express from 'express';
import { postController } from '../controllers/post.controller.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { checkRole } from '../middleware/checkRole.js';
import { ROLES } from '../constants/roles.js';
import { uploadSingle } from '../middleware/upload.js';

export const postRouter = express.Router();

// 1. GET all posts
postRouter.get('/', postController.getAllPosts);

// 2. POST
postRouter.post('/', checkAuth, uploadSingle, postController.createOnePost);

// 3. GET one post
postRouter.get('/:id', postController.getOnePost);

// 4. PATCH
postRouter.patch(
  '/:id',
  checkAuth,
  checkRole(ROLES.ADMIN, ROLES.EDITOR),
  postController.updateOnePost,
);

// 5. DELETE
postRouter.delete(
  '/:id',
  checkAuth,
  checkRole(ROLES.ADMIN),
  postController.deleteOnePost,
);
