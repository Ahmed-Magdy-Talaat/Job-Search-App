import mongoose from "mongoose";

/*Company Collection
companyName ⇒ ( unique )
description (Like what are the actual activities and services provided by the company ? )
industry ( Like Mental Health care )
address
numberOfEmployees ( must be range such as 11-20 employee)
companyEmail ⇒ ( unique )
companyHR ( userId ) */

const isInteger = (val) => {
  return Number.isInteger(val);
};
const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
    },
    description: String,
    industry: {
      type: String,
      required: true,
    },
    address: String,
    noOfEmployees: {
      type: Number,
      validate: { validator: isInteger, message: "{VALUE} must be an integer" },
      default: 0,
    },
    companyEmail: {
      type: String,
      unique: true,
      required: true,
    },
    companyHR: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("company", companySchema);
export default Company;
