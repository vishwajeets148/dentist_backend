import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import dotenv from 'dotenv'
dotenv.config()


export const verifyJWT = asyncHandler(async(req, res, next)=>{
 
    try{
      const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "" )

      if(!token){
          throw new ApiError(401, "Unauthorized request")
      }

    const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
     
    const user= await Admin.findById(decodedToken?._id).select("-password -refreshToken")
    
    if(!user){
        throw new ApiError(401, "Invalid Access Token")
    }
    req.admin = user
    next()


}catch(error){
      throw new ApiError(401, error?.message  || "Invalid Access Token" )
}

})