'use strict';

var templateHandler = require('../../engine/templateHandler.js');
var domManipCommon  = require('../../engine/domManipulator/common.js');
var domManipStatic  = require('../../engine/domManipulator/static.js');

exports.engineVersion = '2.5';


//Catalog Templating
var catalogPage = templateHandler.pageTests.filter(function(page) { return page.template == 'catalogPage' })[0];
catalogPage.prebuiltFields.linkLogs = 'href';
catalogPage.prebuiltFields.bannerImage = 'src';

var originalCatalogElements = domManipStatic.setCatalogElements;

domManipStatic.setCatalogElements = function(boardData, language, threads, flagData) {

  var document = originalCatalogElements(boardData, language, threads, flagData);
  var boardUri = domManipCommon.clean(boardData.boardUri);
   
  document = document.replace('__bannerImage_src__', '/randomBanner.js?boardUri=' + boardUri);
  document = document.replace('__linkLogs_href__', '/logs.js?boardUri=' + boardData.boardUri);
  return document
};
