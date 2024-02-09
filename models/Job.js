/*1. jobTitle ( Like **NodeJs back-end developer** )
2. jobLocation ( **onsite, remotely, hybrid** )
3. workingTime ( **part-time , full-time** )
4. seniorityLevel ( enum of **Junior, Mid-Level, Senior,Team-Lead, CTO** )
5. jobDescription ( identify what is the job and what i will do i accepted )
6. technicalSkills ( array of skills, like  **nodejs  , typescript** ,…)*/
import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: ["onsite", "hybrid", "remote"],
    },
    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      default: "part-time",
    },
    jobDescription: {
      type: String,
      required: true,
    },
    techSkills: {
      type: [
        {
          type: String,
        },
      ],
    },
    softSkills: {
      type: [
        {
          type: String,
        },
      ],
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("job", jobSchema);
export default Job;
