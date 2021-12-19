'use strict';

var common = require('../../engine/postingOps').common;


exports.engineVersion = '2.5';

var createIdOriginal = common.createId;

common.createId = function(salt, boardUri, ip) {
  var id = createIdOriginal(salt, boardUri, ip);
  return (id == null ? "000000" : id)
};

