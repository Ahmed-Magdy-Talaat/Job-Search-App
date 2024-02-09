// job.routes.js
import express from "express";
import * as jc from "./job.controllers.js";
import { verifyAuth, validateRole } from "../middlewares/auth.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/search", verifyAuth, jc.getJobCompanyInfo);
router.get("/filter", verifyAuth, jc.getJobMatching);
router.post("/apply", verifyAuth, upload.single("cv"), jc.ApplyForJob);
router.use(verifyAuth, validateRole("Company_HR"));
router.route("/").post(jc.addJob).delete(jc.deleteJob).put(jc.updateJob);
router.get("/applications", jc.createExcelForApplications);

export default router;
