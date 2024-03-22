import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment} from "../models/appointment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})


const addAppointment = asyncHandler(async (req, res) => {
    const { name, email, service, mobile, doctor, date, time } = req.body;

    if (!email) {
        return res.status(400).json({ Status: false, error: "Email is required" });
    }

    const existingUser = await Appointment.findOne({email });
    if (existingUser) {
        return res.status(400).json({ error: "Already Taken Appointment with this Email Id" });
       
    }
 
  
    if (
      [name, email, service, mobile, doctor, date, time].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const profileLocalPath = req.files?.profile[0]?.path;

    // if (!profileLocalPath) {
    //     throw new ApiError(400, "Profile file is required");
    //   }
    
      const profile = await uploadOnCloudinary(profileLocalPath);
    
      if (!profile) {
        throw new ApiError(400, "Profile file is required");
      }

    const contact = await Appointment.create({
        name, email, service, mobile, doctor, date, time, profile: profile.url || "",
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
                 auth: {
                      user : process.env.NODEMAILER_USER,
                      pass : process.env.NODEMAILER_PASS
                 }
      });

      const mailOptions = {
        from: "vishwajeets148@gmail.com",
        to: [req.body.email],


        subject: "Appointment Book || Dental Clinic",
        html: `
        <h1>Welcome To Dental Clinic Portal </h1>
    <p>Dear ${req.body.name},</p>
    <p>Thank you for registration with our portal</p>
          <img src="https://img.freepik.com/free-psd/interior-modern-emergency-room-with-empty-nurses-station-generative-ai_587448-2137.jpg" alt="Hospital Image">
    <p>For any further queries or assistance, feel free to connect at vishwajeets148@gmail.com</p>
    <p>Best regards</p>
          `,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ status: false, error: "Error sending email" });
        } else {
          console.log("Mail sent, check your mail on update section");
          
        }
      });

  
    return res.status(201)
      .json(new ApiResponse(200, contact, "Appointement Schedule"));
  });

  // Get Appointment Data

  const getAppointment = asyncHandler(async (req, res) => {
     
    const result = await Appointment.find()

    return res.status(201).json(new ApiResponse(200, result, "Data Fetch"));

  })

  // Contact Data Delete

  const deleteAppointment = asyncHandler(async (req, res) => {
     
    const result = await Appointment.deleteOne({_id:req.params.id})

    return res.status(201).json(new ApiResponse(200, result, "Delete Data"));

  })


export {addAppointment, getAppointment , deleteAppointment }