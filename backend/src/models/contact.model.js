import mongoose, {Schema} from "mongoose";
///define schema for collection////

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true, /// Searching field
  },
  email: {
    type: String,
    required: true,
    lowecase: true,
    trim: true,
  },

  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
  
},
  {
    timestamps: true
}
);

/// creating a modal///


export const Contact = mongoose.model("Contact", contactSchema)