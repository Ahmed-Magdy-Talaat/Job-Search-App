import mongoose from "mongoose";
/*
## A**pplication** Collection

1. jobId ( the Job Id )
2. userId ( the applier Id )
3. userTechSkills ( array of the applier technical Skills )
4. userSoftSkills ( array of the applier soft Skills )
5. userResume ( must be pdf , upload this pdf on cloudinary )*/
const appSchema = mongoose.Schema(
  {
    jobId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "job",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    userTechSkills: {
      type: [
        {
          type: String,
        },
      ],
    },
    userSoftSkills: {
      type: [
        {
          type: String,
        },
      ],
    },
    userResume: {
      resumeId: String,
      resumeUrl: String,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("application", appSchema);
export default Application;
