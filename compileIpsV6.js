#!/usr/bin/env node
'use strict';

var MAX_LINES = Infinity;
var readLines = 0;
var finished = false;

var fs = require('fs');
var readLine = require('readline');
var destination = './compiledIpsV6';
var source = './GeoLite2-City-Blocks-IPv6.csv';

exports.completeIp = function(parts) {

  for (var i = 0; i < parts.length; i++) {

    if (!parts[i].length) {
      parts[i] = '0';

      while (parts.length < 8) {
        parts.splice(i, 0, '0');
      }

      break;

    }
  }

};

exports.ipToArray = function(ip) {

  var parts = ip.split(':');

  if (parts.length < 8) {
    exports.completeIp(parts);
  }

  parts = parts.map(function padOctets(part) {
    if (part.length < 4) {
      return ('0000' + part).slice(-4);
    }

    return part;
  });

  var parsedIp = [];

  for (var i = 0; i < parts.length; i++) {

    var part = parts[i];

    parsedIp.push(parseInt(part.substring(0, 2), 16));
    parsedIp.push(parseInt(part.substring(2, 4), 16));

  }

  return parsedIp;

};

exports.startReading = function() {

  var toWrite = fs.createWriteStream(destination);

  var lineReader = readLine.createInterface({
    input : fs.createReadStream(source)
  });

  lineReader.on('close', function finished() {

    toWrite.end(function closedWriteStream() {
      console.log('Finished converting ' + (readLines - 1) + ' ipsV6');
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

  var finalBuffer = Buffer.alloc(22);

  var ip = exports.ipToArray(parts[0].split('/')[0]);

  for (var i = 0; i < ip.length; i++) {
    finalBuffer[i] = ip[i];
  }

  finalBuffer.writeUIntBE(+parts[1], 16, 6);

  toWrite.write(finalBuffer);

};

fs.unlink(destination, function deleted() {
  exports.startReading();
});
