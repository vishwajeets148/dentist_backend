import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from 'dotenv'
dotenv.config()
///define schema for collection////

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true, /// Searching field
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
  },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String
  }
  },

  {
    timestamps: true,
  }
);

/// creating a modal///

// Password encryption

adminSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Password encryption compare for login authentication

adminSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          name: this.name
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}

adminSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}


export const Admin = mongoose.model("Admin", adminSchema);
