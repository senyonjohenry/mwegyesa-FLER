const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { routes: authRoutes } = require('./src/routes/authRoutes')
const { routes: eventRoutes } = require('./src/routes/eventRoutes')
const { routes: reportRoutes } = require('./src/routes/reportRoutes')
const { routes: rmRoutes } = require('./src/routes/rmRoutes')
const {routes: flRoutes}=require('./src/routes/flCoordinatinStaffRoutes')
const {routes: participantRoutes}=require('./src/routes/participantRoutes')
 const app = express();

app.use(cors())
 app.use(bodyParser.json());
 
 app.use('/auth', authRoutes);
 app.use('/event', eventRoutes);
 app.use('/report', reportRoutes);
 app.use('/rm', rmRoutes);
 app.use('/fl', flRoutes);
 app.use('/participants', participantRoutes);
 app.use('/uploads', express.static('uploads'));

 app.use((err, req, res, next)=>{
     return res.status(500).send({message:err.message})
 })
 app.listen(3000, ()=> console.log('Server Started at Port 3000'));
