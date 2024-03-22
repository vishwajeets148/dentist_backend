import express from "express"
import cookieParser from "cookie-parser";
// import cors from "cors";
const app = express()

app.use(cookieParser());
// app.use(express.json({limit: '16kb'}))

// app.use(cors(corsOptions));
app.use(express.static('public'))
app.use(express.json());

app.get('/',(req, res) =>{
  res.send('Hello World')
})


// var corsOptions = {
//     origin: process.env.CORS_ORIGIN,
//     optionsSuccessStatus: 200,
//     credentials: true
//   }


import contactRouter from './routes/contact.routes.js'
import appointmentRouter from './routes/appointment.routes.js'
import homeAppointmentRouter from './routes/homeappointment.routes.js'
import adminRouter  from './routes/admin.routes.js'


app.use('/api/user', contactRouter)
app.use('/api/user', appointmentRouter)
app.use('/api/user', homeAppointmentRouter)
app.use('/api/admin', adminRouter)



export { app }