const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

//DEFINE SCHEMA AND MODEL
const armySchema = new mongoose.Schema({
  title: String,
  units: Array,
});

const Army = mongoose.model('Army', armySchema);

//Connect to Database
mongoose.connect('mongodb://localhost:27017/Aoe2Armies', {
  useNewUrlParser: true
});

app.post('/api/armies', async (req, res) => {
  const army = new Army({
    title: req.body.title,
    units: req.body.units,
  });
  try {
    await army.save();
    res.send(army);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/armies', async (req,res) =>{
  try {
    let armyList = await Army.find();
    res.send(armyList);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/armies/:id', async (req, res) =>{
  try {
    var army = await Army.findOne({
      _id: req.params.id
    });
    army.title = req.body.title;
    army.units = req.body.units;
    army.save();
    res.sendStatus(200);
  } catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/armies/:id', async (req, res) =>{
  try {
    await Army.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error){
    console.log(error);
    res.sendStatus(500);
  }
});
//EVERYTHING GOES BEFORE THIS
app.listen(3002, () => console.log('Server listening on port 3002!'));
