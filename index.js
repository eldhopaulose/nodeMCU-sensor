const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Connection URL and database name
const url = 'mongodb+srv://eldhopaulose0485:xyzel_025@cluster0.4sjqm.mongodb.net/NodeMcu?retryWrites=true&w=majority';

// Set up default mongoose connection
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected successfully to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
