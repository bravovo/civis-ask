import { Router } from "express";
import {
  getUser,
  patchUser,
  putPassword,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/me", getUser);

router.patch("/update", patchUser);

router.put("/password", putPassword);

router.delete("/", deleteUser);

export default router;
