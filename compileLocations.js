#!/usr/bin/env node

'use strict';

var MAX_LINES = Infinity;
var readLines = 0;
var MAX_CITY_NAME_LENGTH = 49;
var finished = false;

var fs = require('fs');
var readLine = require('readline');
var destination = './compiledLocations';
var source = './GeoLite2-City-Locations-en.csv';

exports.startReading = function() {

  var toWrite = fs.createWriteStream(destination);

  var lineReader = readLine.createInterface({
    input : fs.createReadStream(source)
  });

  lineReader.on('close', function finished() {

    toWrite.end(function closedWriteStream() {
      console.log('Finished converting ' + (readLines - 1) + ' locations');
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

    if (readLines > MAX_LINES) {
      lineReader.close();
      finished = true;

    }

  });

};

exports.processLine = function(line, toWrite) {

  var parts = line.split(',');

  parts[10] = parts[10].replace(/"/g, '');

  var parenthesisIndex = parts[10].indexOf('(');

  if (parenthesisIndex > -1) {
    parts[10] = parts[10].substring(0, parenthesisIndex).trim();
  }

  if (parts[10].length > MAX_CITY_NAME_LENGTH) {
    console.log('Max city name encountered: ' + parts[10]);
    console.log('Length: ' + parts[10].length);
  }

  var finalBuffer =  Buffer.alloc(60);
  finalBuffer.fill(0);

  finalBuffer.writeUIntBE(+parts[0], 0, 6);
  finalBuffer.write(parts[4], 6);
  finalBuffer.write(parts[6], 8);
  finalBuffer.write(parts[10], 11);

  toWrite.write(finalBuffer);

};

fs.unlink(destination, function deleted() {
  exports.startReading();
});
