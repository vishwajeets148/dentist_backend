import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HomeAppointment} from "../models/homeappointment.model.js";


const addHomeAppointment = asyncHandler(async (req, res) => {
    const { service, email, doctor, name, time, date } = req.body;

  
    const existingUser = await HomeAppointment.findOne({email });
    if (existingUser) {
        return res.status(400).json({ error: "Already Taken Appointment with this Email Id" });
       
    }
 
  
    if (
      [service, email, doctor, name, time, date].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }


    const contact = await HomeAppointment.create({
        service, email, doctor, name, time, date
    });

    
  
    return res.status(201)
      .json(new ApiResponse(200, contact, "Appointement Schedule"));
  });


  export {addHomeAppointment}