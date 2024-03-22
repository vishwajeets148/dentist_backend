import mongoose, {Schema} from "mongoose";
///define schema for collection////

const homeappointSchema = new Schema(
  {
  service: {
    type: String,
    required: true,
  },
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
  name:{
    type: String,
    required: true,
    index: true, /// Searching field

  },
  time:String,
  date: String,

},{
    timestamps: true
}
);

/// creating a modal///

export const HomeAppointment = mongoose.model('HomeAppointment', homeappointSchema);