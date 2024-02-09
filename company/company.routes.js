import express from "express";
import * as cc from "../company/company.controllers.js";
import { verifyAuth, validateRole } from "../middlewares/auth.js";
const router = express.Router();

router.post("/add", verifyAuth, validateRole("Company_HR"), cc.addCompany);
router.put("/", verifyAuth, validateRole("Company_HR"), cc.updateCompanyInfo);
router.delete("/", verifyAuth, validateRole("Company_HR"), cc.deleteCompany);
router.get(
  "/applications",
  verifyAuth,
  validateRole("Company_HR"),
  cc.getAppForJobs
);
router.get("/", verifyAuth, cc.getCompanyData);
router.get("/search", verifyAuth, cc.searchForCompanyName);
export default router;
