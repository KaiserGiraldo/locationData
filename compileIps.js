#!/usr/bin/env node

'use strict';

var MAX_LINES = Infinity;
var readLines = 0;
var finished = false;

var fs = require('fs');
var readLine = require('readline');
var destination = './compiledIps';
var source = './GeoLite2-City-Blocks-IPv4.csv';

exports.ipToInt = function(ip) {
  var a = ip.split(/\./);

  var toReturn = parseInt(a[0], 10) << 24 >>> 0;
  toReturn += parseInt(a[1], 10) << 16 >>> 0;
  toReturn += parseInt(a[2], 10) << 8 >>> 0;
  toReturn += parseInt(a[3], 10) >>> 0;

  return toReturn;

};

exports.startReading = function() {

  var toWrite = fs.createWriteStream(destination);

  var lineReader = readLine.createInterface({
    input : fs.createReadStream(source)
  });

  lineReader.on('close', function finished() {

    toWrite.end(function closedWriteStream() {
      console.log('Finished converting ' + (readLines - 1) + ' ips');
    });

  });

  lineReader.on('line', function gotLine(line) {

    if (finished) {
      return;
    }

    if (readLines) {
      // skip first line, its just bullshit
      exports.processLine(line, toWrite);
    }

    readLines++;

    // every 100k lines print how many lines were read
    var mileStone = readLines % 100000;
    if (!mileStone) {
      console.log(readLines);
    }

    if (readLines > MAX_LINES) {
      lineReader.close();
      finished = true;

    }

  });

};

exports.processLine = function(line, toWrite) {

  var parts = line.split(',');

  // some entries don't have a geoID, so we use the ISP's geoID
  if (!parts[1].length) {
    parts[1] = parts[2];
  }

  var finalBuffer =  Buffer.alloc(10);

  finalBuffer.writeUInt32BE(exports.ipToInt(parts[0]));
  finalBuffer.writeUIntBE(+parts[1], 4, 6);

  toWrite.write(finalBuffer);

};

fs.unlink(destination, function deleted() {
  exports.startReading();
});
