import {addHomeAppointment} from '../controllers/homeappointment.controller.js'

import { Router } from 'express'


const router = Router()

/// Contact Us Routes

router.route("/addHomeAppointment").post(addHomeAppointment)


export default router
