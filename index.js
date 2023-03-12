const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port
const ip = process.env.IP || 'localhost'; // Use environment variable or default IP address

// Connection URL and database name
const url = 'mongodb+srv://eldhopaulose0485:xyzel_025@cluster0.4sjqm.mongodb.net/NodeMcu?retryWrites=true&w=majority'; // Use environment variable or default URL

// Set up default mongoose connection
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected successfully to MongoDB");
});

// Define schema for sensor data
const SensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  soil_moisture: Number,
  ph: Number,
  timestamp: { type: Date, default: Date.now }
});

// Create model from schema
const Sensor = mongoose.model('Sensor', SensorSchema);

// Use body-parser middleware to parse request body
app.use(bodyParser.json());

// Set up a route to handle POST requests from the sensor
app.post('/api/data', async (req, res) => {
  const { temperature, humidity, soil_moisture, ph } = req.body;

  // Create a new data object with the received data
  const newData = new Sensor({
    temperature,
    humidity,
    soil_moisture,
    ph
  });
  try {
    // Find and delete the previous document
    const previousData = await Sensor.findOneAndDelete();
    console.log('Previous data deleted:', previousData);

    // Create new document from request body
    const sensorData = new Sensor(newData);

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
