import {addAppointment} from '../controllers/appointment.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import {getAppointment} from '../controllers/appointment.controller.js'
import {deleteAppointment} from '../controllers/appointment.controller.js'

import { Router } from 'express'


const router = Router()

/// Contact Us Routes

router.route("/addAppointment").post(
    upload.fields([
        {
     name: "profile",
     maxCount: 1

}

]),addAppointment)

router.route("/getAppointment").get(getAppointment)

router.route("/deleteAppointment/:id").delete(deleteAppointment)


export default router
