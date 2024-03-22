import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()


/// generateAccessandRefreshTokens METHOD


const generateAccessandRefreshTokens = async (userId) => {        
    try {
      const user = await Admin.findById(userId);
  
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
  
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating access and refresh tokens"
      );
    }
  };



// Admin Register

const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    if (
      [name, email, password].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
    const existedUser = await Admin.findOne({email});

    if (existedUser) {
      throw new ApiError(409, "Admin email already exists");
    }
  
    const avatarLocalPath = req.files?.avatar[0]?.path;
  
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }
  
    const avatar = await uploadOnCloudinary(avatarLocalPath);
  
    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }
  
    const user = await Admin.create({
      name,
      avatar: avatar.url,
      email,
      password,
    });
  
    const createdUser = await Admin.findById(user._id).select(
      "-password -refreshToken"
    );
  
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the Admin");
    }
  
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "Admin registered Successfully"));
  });


  /// Admin Login 

  const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
  
 
    if (!email) {
      throw new ApiError(400, "email is required");
    }
  
    const admin = await Admin.findOne({email});
  
    if (!admin) {
      throw new ApiError(404, "Admin does not exist");
    }
  
    const isPasswordValid = await admin.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
      admin._id
    );
  
    const loggedInAdmin = await Admin.findById(admin._id).select(
      "-password -refreshToken"
    );
  
  /// Creating security method to show data in client side but only modification in Server Side
    
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { admin: loggedInAdmin, accessToken, refreshToken },
          "Admin logged in successfully"
        )
      );
  });
  
  
// Admin Logout


  const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
      req.admin._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        }
      },
      {
        new: true,
      }
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "Admin logged Out"));
  });

/// refresh Access Token

  const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
  
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }
  
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
  
      const user = await Admin.findById(decodedToken?._id);
  
      if (!user) {
        throw new ApiError(401, "Invalid Refresh Token");
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired or Used");
      }
  
      const options = {
        history: true,
        secure: true,
      };
  
      const { accessToken, newRefreshToken } =
        await generateAccessandRefreshTokens(user._id);
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed"
          )
        );
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  });


  export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
  };