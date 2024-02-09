import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import moment from "moment";
/*
2. lastName
3. username ( firstName + lastName) 
4. email ⇒ ( unique )
5. password
6. recoveryEmail ⇒ (not unique)
7. DOB (date of birth, must be date format 2023-12-4)
8. mobileNumber ⇒ (unique)
9. role ⇒ (User, Company_HR )
10. status (online, offline)
*/
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      default: function () {
        return this.firstName + " " + this.lastName;
      },
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    recoveryEmail: {
      type: String,
    },
    DOB: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Check if the date is in "YYYY-MM-DD" format
          const regex = /^\d{4}-\d{2}-\d{1,2}$/;
          if (!regex.test(value)) {
            return false;
          }

          // Check if the date is a valid date using moment.js
          const isValidDate = moment(value, "YYYY-MM-DD", true).isValid();

          // Check if the user's age is between 18 and 80
          if (isValidDate) {
            const age = moment().diff(moment(value, "YYYY-MM-DD"), "years");
            return age >= 18 && age <= 80;
          }

          return false;
        },
        message:
          "Invalid date or age. Please provide a valid date and ensure the age is between 18 and 80.",
      },
    },
    mobileNumber: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["User", "Company_HR"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["Offline", "Online"],
    },
  },
  {
    timestamps: true,
  }
);
// //hashing the password before saving the userSchema
// userSchema.pre("save", async function (req, res, next) {
//   const rounds = +process.env.ROUNDS;
//   if (isModified(this.password)) {
//     this.password = bcryptjs.hashSync(this.password || "", rounds);
//   }
//   next();
// });

const User = mongoose.model("user", userSchema);
export default User;
