import express from "express";
import * as uc from "../user/user.controller.js";
import { verifyAuth } from "../middlewares/auth.js";
const router = express.Router();

router.post("/sign-up", uc.signUp);
router.post("/sign-In", uc.signIn);
router.put("/update-user", verifyAuth, uc.updateUser);
router.delete("/delete-user", verifyAuth, uc.deleteUser);
router.get("/me", verifyAuth, uc.getData);
router.get("/user-data", verifyAuth, uc.getProfileData);
router.put("/update-password", verifyAuth, uc.updatePassword);
router.get("/recovery", verifyAuth, uc.getAllAccounts);
router.post("/forget", verifyAuth, uc.forgetPass);
router.post("/reset", verifyAuth, uc.resetPass);
export default router;
