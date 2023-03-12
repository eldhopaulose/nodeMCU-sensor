const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Use environment variables provided by Render.com
const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';

// Connection URL and database name
const url = process.env.MONGODB_URI;

// Set up default mongoose connection
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected successfully to MongoDB Atlas");
});

// Define schema for sensor data
const SensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  soil_moisture: Number,
  ph: Number,  
});

// Create model from schema
const Sensor = mongoose.model('Sensor', SensorSchema);

// Use body-parser middleware to parse request body
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB Atlas');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB Atlas:', err);
  });

// Define a route that fetches the sensor data
app.get('/api/data', async (req, res) => {
    try {
      // Find all documents in the collection
      const sensorData = await Sensor.find().exec();
  
      console.log('Found the following documents:');
      console.log(sensorData);
  
      res.json(sensorData);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
});

// Set up a route to handle POST requests from the sensor
app.post('/api/data', async (req, res) => {
    try {
      // Find and delete the previous document
      const previousData = await Sensor.findOneAndDelete();
      console.log('Previous data deleted:', previousData);
  
      // Create new document from request body
      const sensorData = new Sensor(req.body);
  
      // Save document to database
      const savedData = await sensorData.save();
  
      console.log('New data inserted:', savedData);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
});

// Start server on specific IP address and port
app.listen(port, ip, () => {
  console.log(`Server listening at http://${ip}:${port}`);
});
