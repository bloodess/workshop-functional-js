let chalk = require('chalk');
var _ = require("lodash");

let checkpointsService = require('./staticCheckpoints');


let calculateDistanceWithRssi = rssi => {
  var txPower = -59; // hard coded power value. Usually ranges between -59 to -65

  if (rssi == 0) {
  
    return -1.0;
  }
  

  var ratio = rssi * 1.0 / txPower;
  
  if (ratio < 1.0) {
  
    return Math.pow(ratio,10);
  
  } else {
  
    var distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    return distance;
  }
};

let transformCheckpoint = (checkpoint) => {
  if (checkpoint) {
    var exo2 = checkpoint;
    // Get back essential properties
    exo2.serviceData = exo2.advertisement.serviceData;
    exo2.serviceUuids = exo2.advertisement.serviceUuids;
    // Transform data about distance
    exo2.distance = calculateDistanceWithRssi(exo2.rssi);
    // Clean uninteresting properties
    delete exo2.id;
    delete exo2.address;
    delete exo2.addressType;
    delete exo2.advertisement;
    delete exo2.rssi;
    delete exo2.services;
    // Everything is ok
    return true;
  } else {
    return false;
  }
};

let showCheckpoint = (checkpoint, index) => {
  console.log(chalk.green('CHECKPOINT'), chalk.yellow(index + 1));
  
  _.map(checkpoint, function(value, property){
    if(checkpoint.distance >= 1){
      checkpoint.distance += 'm';
    }
  })
  _.sortBy(checkpoint, ['distance']).reverse();
  _.forEach(checkpoint, function(value, property){
    if (checkpoint.hasOwnProperty(property)) {
      console.log(chalk.cyan(property.toUpperCase()), checkpoint[property]);
    }})
  console.log('\n');
};


let run = () => {
  let checkpoints = checkpointsService.getCheckpoints();
  for (var i = 0; i < checkpoints.length; i++) {
    let checkpoint = checkpoints[i];
    transformCheckpoint(checkpoint);
    showCheckpoint(checkpoint, i);
  }
};

module.exports = {
  transformCheckpoint: transformCheckpoint,
  showCheckpoint: showCheckpoint,
  run: run
};