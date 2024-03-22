import {registerAdmin, loginAdmin, logoutAdmin, refreshAccessToken } from '../controllers/admin.controller.js'
import  {verifyJWT}  from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

import { Router } from 'express'

const router = Router()


router.route("/register").post( 
    upload.fields([
        {
     name: "avatar",
     maxCount: 1

}
]), registerAdmin)


router.route("/login").post(loginAdmin)

// Secured routes

router.route("/logout").post(verifyJWT, logoutAdmin)

// Secured routes

router.route("/refresh-token").post(refreshAccessToken)



export default router