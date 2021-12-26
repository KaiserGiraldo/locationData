#!/usr/bin/env node
'use strict';

var MAX_LINES = Infinity;
var readLines = 0;
var finished = false;

var fs = require('fs');
var readLine = require('readline');
var destination = './compiledASNs';
var source = './GeoLite2-ASN-Blocks-IPv4.csv';

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
      console.log('Finished converting ' + (readLines - 1) + ' ASNs');
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

  var finalBuffer = Buffer.alloc(8);

  finalBuffer.writeUInt32BE(exports.ipToInt(parts[0]));
  finalBuffer.writeUInt32BE(+parts[1], 4);

  toWrite.write(finalBuffer);

};

fs.unlink(destination, function deleted() {
  exports.startReading();
});
