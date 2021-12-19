'use strict';

var metaOps = require('../../engine/boardOps/metaOps.js');
var lang    = require('../../engine/langOps.js').languagePack;


exports.engineVersion = '2.5';

var createBoardOriginal = metaOps.createBoard;

metaOps.createBoard = function(captchaId, parameters, userData, language, callback) {
  var allowed = userData.globalRole <= 1
  //Denies users with unverified e-mail addresses, unless they are Admin or Root.
  if (!allowed && !userData.confirmed) {
    return callback(lang(language).errDeniedBoardCreation);
  }

  //Denies board creation for users with 3 or more boards, unless they're Admin or Root.
  if (!allowed && !(userData.ownedBoards == undefined || userData.ownedBoards.length < 3)) {
    return callback(lang(language).errDeniedBoardCreation);
  }

  return createBoardOriginal(captchaId, parameters, userData, language, callback);
};

