import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Contact } from "../models/contact.model.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})



const addContact = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!email) {
        return res.status(400).json({ Status: false, error: "Email is required" });
    }

    const existingUser = await Contact.findOne({email });
    if (existingUser) {
        return res.status(400).json({ error: "Email is already registered" });
       
    }
  
    if (
      [name, email, subject, message].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
    
  
    const contact = await Contact.create({
        name,
        email,
        subject,
        message
    });
    const transporter = nodemailer.createTransport({
        service: "gmail",
                 auth: {
                      user : process.env.NODEMAILER_USER,
                      pass : process.env.NODEMAILER_PASS
                 }
      });

      const mailOptions = {
        from: '',
        to: ['vishwajeets148@gmail.com'],
        subject: 'Incoming mail from Dentist',
        html: `<p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ status: false, error: 'Error sending email' });
        } else {
          console.log('Mail sent, check your mail on update section');
          return res.status(200).json({ status: true, msg: 'Registered successfully', contact });
        }
      });
  
    return res.status(201)
      .json(new ApiResponse(200, contact, "Thanks for Contact us"));
  });

  // get contact Data

  const getContact = asyncHandler(async (req, res) => {
     
    const result = await Contact.find()

    return res.status(201).json(new ApiResponse(200, result, "Data Fetch"));

  })

  // Contact Data Delete

  const deleteContact = asyncHandler(async (req, res) => {
     
    const result = await Contact.deleteOne({_id:req.params.id})

    return res.status(201).json(new ApiResponse(200, result, "Delete Data"));

  })


export {addContact, getContact, deleteContact }