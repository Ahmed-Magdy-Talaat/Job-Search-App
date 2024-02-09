import asyncHandler from "express-async-handler";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
export const addCompany = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    description,
    industry,
    noOfEmployees,
    companyEmail,
    address,
  } = req.body;
  const id = req.user._id;
  const company = new Company({
    companyName,
    description,
    industry,
    noOfEmployees,
    companyHR: id,
    companyEmail,
    address,
  });
  await company.save();
  res.status(200).json({
    success: true,
    company,
  });
});

export const updateCompanyInfo = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const company_id = req.query.id;
  const data = req.body;
  const company = await Company.findById(company_id);
  if (!company) return next(new Error("Company not found", { cause: 404 }));
  if (company.companyHR != id)
    return next(
      new Error("this resource can only be accessed by the owner", {
        cause: 400,
      })
    );
  if (data.companyEmail) {
    const isMatch = await Company.findOne({ companyEmail: data.companyEmail });
    if (isMatch)
      return next(new Error("company Email is already exist", { cause: 400 }));
  }

  if (data.companyName) {
    const isMatch = await Company.findOne({ companyName: data.companyName });
    if (isMatch)
      return next(new Error("company Email is already exist", { cause: 400 }));
  }
  const updated = await Company.findByIdAndUpdate(company_id, data, {
    new: true,
  });
  res.status(200).json({
    success: true,
    company: updated,
  });
});

export const deleteCompany = asyncHandler(async (req, res, next) => {
  const id = req.query.id;
  const hrId = req.user._id;
  const company = await Company.findByIdAndDelete(id);
  if (company.companyHR != hrId)
    return next(
      new Error("this resource can only be accessed by the owner", {
        cause: 400,
      })
    );
  if (!company) return next(new Error("company is not found", { cause: 400 }));
  res.status(200).json({
    success: true,
    message: "Company deleted successfully",
  });
});

export const getCompanyData = asyncHandler(async (req, res, next) => {
  const id = req.query.id;
  console.log(id);
  const company = await Company.findById(id);
  if (!company) return next(new Error("Company is not found", { cause: 404 }));
  res.status(200).json({
    success: true,
    company,
  });
});

export const searchForCompanyName = asyncHandler(async (req, res, next) => {
  const { companyNamePart } = req.body;
  const companies = await Company.find({
    companyName: { $regex: new RegExp(companyNamePart, "i") },
  });
  if (!companies.length)
    res.status(200).json({ message: "company is not found" });
  else {
    res.status(200).json({
      success: true,
      companies,
    });
  }
});

export const getAppForJobs = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  let result = await Job.find({ addedBy: id });
  const applicationsPromises = result.map(async (job) => {
    const applications = await Application.find({ jobId: job._id }).populate(
      "userId"
    );
    return { job, applications };
  });

  const results = await Promise.all(applicationsPromises);
  res.json({ success: true, results });
});
