import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { uploadStream } from "../utils/uploadCloudinary.js";
import asyncHandler from "express-async-handler";
import ExcelJs from "exceljs";
//

export const addJob = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const jobData = data;
  jobData.addedBy = req.user._id;
  const job = new Job(data);
  await job.save();
  res.status(200).json({
    success: true,
    job,
  });
});

export const updateJob = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const id = req.query.id;
  const job = await Job.findByIdAndUpdate(id, data, { new: true });
  if (!job) return next(new Error("Job is not found", { cause: 404 }));
  res.status(200).json({
    success: true,
    job,
  });
});

export const deleteJob = asyncHandler(async (req, res, next) => {
  const id = req.query.id;
  const job = await Job.findByIdAndDelete(id);
  if (!job) return next(new Error("Job is not found", { cause: 404 }));
  res.status(200).json({
    success: true,
    message: "job deleted successfully",
  });
});

export const getJobCompanyInfo = asyncHandler(async (req, res, next) => {
  const id = req.query.id;
  console.log(id);
  let job = await Job.findById(id);
  const companyInfo = await Company.findOne({ companyHR: job.addedBy });
  if (companyInfo) {
    job = { ...job.toObject(), companyInfo: companyInfo.toObject() };
  }

  console.log(job);
  if (!job) return next(new Error("job is not found", { cause: 400 }));
  res.status(200).json({
    success: true,
    job,
  });
});

export const getJobMatching = asyncHandler(async (req, res, next) => {
  const data = req.body;
  let filter = data;
  if (data.techSkills && data.techSkills.length > 0) {
    filter.techSkills = { $in: data.techSkills };
  }
  if (data.softSkills && data.softSkills.length > 0) {
    filter.softSkills = { $in: data.softSkills };
  }
  const job = await Job.find(data);
  res.status(200).json({ success: true, job });
});

export const ApplyForJob = asyncHandler(async (req, res, next) => {
  console.log("hello");
  let data = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  const buffer = req.file.buffer;
  const pdf = await uploadStream(req.file.buffer);
  data.userResume = pdf;
  data.userId = req.user._id;
  const application = new Application(data);
  if (!application) return next(new Error("Application not valid"));
  await application.save();
  res.status(200).json({
    success: true,
    application: data,
  });
});

export const createExcelForApplications = asyncHandler(
  async (req, res, next) => {
    const userId = req.user._id;
    let jobs = await Job.find({ addedBy: userId });
    let applications = [];
    await Promise.all(
      jobs.map(async (job) => {
        let application = await Application.find({ jobId: job._id })
          .populate("jobId")
          .populate("userId");
        applications.push(application);
      })
    );
    applications = applications.flat();

    const workbook = new ExcelJs.Workbook();
    workbook.creator = req.user.username;
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet("Applications");

    worksheet.addRow([
      "Job Title",
      "Applicant",
      "Technical Skills",
      "Soft Skills",
      "Resume URL",
    ]);
    applications.forEach((app) => {
      worksheet.addRow([
        app.jobId.title,
        app.userId.username,
        app.userTechSkills.join(", "),
        app.userSoftSkills.join(", "),
        app.userResume.resumeUrl,
      ]);
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Applications.xlsx"
    );
    return workbook.xlsx.write(res).then(() => res.end());
  }
);
