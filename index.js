const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const url = 'mongodb+srv://eldhopaulose0485:xyzel_025@cluster0.4sjqm.mongodb.net/NodeMcu?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log("Connected successfully to MongoDB Atlas");
});

const SensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  soil_moisture: Number,
  ph: Number,
});

const Sensor = mongoose.model('Sensor', SensorSchema);

app.use(bodyParser.json());

app.post('/api/data', async (req, res) => {
  try {
    const previousData = await Sensor.findOneAndDelete();
    console.log('Previous data deleted:', previousData);

    const temperature = req.query.temperature;
    const humidity = req.query.humidity;
    const soil_moisture = req.query.soil_moisture;
    const ph = req.query.ph;

    console.log(temperature, humidity, soil_moisture, ph);

    const sensorData = new Sensor({temperature, humidity, soil_moisture, ph});

    const savedData = await sensorData.save();

    console.log('New data inserted:', savedData);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
