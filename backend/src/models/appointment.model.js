import mongoose, {Schema} from "mongoose";
///define schema for collection////

const appointmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true, /// Searching field
    },
    service: {
      type: String,
      required: true,
    },
    mobile: Number,
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    doctor: {
      type: String,
      required: true,
    },
    date: String,
    time: String,
    profile: {
      type: String, // cloudinary url
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/// creating a modal///

export const Appointment = mongoose.model("Appointment", appointmentSchema);
