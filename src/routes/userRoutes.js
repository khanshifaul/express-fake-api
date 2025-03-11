import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser
} from '../controllers/userController.js';

const router = Router();

router.route("/")
  .get(getUsers)
  .post(createUser);

router.route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;