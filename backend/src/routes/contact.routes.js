import {addContact} from '../controllers/contact.controller.js'
import {getContact} from '../controllers/contact.controller.js'
import {deleteContact} from '../controllers/contact.controller.js'

import { Router } from 'express'


const router = Router()

/// Contact Us Routes

router.route("/addContact").post(addContact)
router.route("/getContact").get(getContact)
router.route("/deleteContact/:id").delete(deleteContact)


export default router
