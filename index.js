'use strict';

var settingsHandler = require('../../settingsHandler');
var verbose;

exports.engineVersion = '2.6';


const loadAddon = function(module_name) {
  try {
	  return require(`./${module_name}.js`);
      } catch(err) {
          console.log(`[Moe] Failed to load submodule: ${module_name}.js`);
	  console.log(err);

      }

}

exports.init = function() {
  var markdown = loadAddon('moe_markdown');
  var syntax   = loadAddon('syntax_highlighting');
  var latex    = loadAddon('latex');
  var torIDs   = loadAddon('tor_ids');
  var sageBox  = loadAddon('sage_box');
  var bumplock = loadAddon('bumplock');
  //var reflow   = loadAddon('prevent_reflow');
  var boards   = loadAddon('board_creation_throttle');
  var filter   = loadAddon('evade_filter');
  var vidThumb = loadAddon('video_thumbs');
  var template = loadAddon('extend_templates');
  //var replies  = require('./reply_identifiers.js');
  var deletion = loadAddon('delete_permissions');
  var warn     = loadAddon('warning');

  //sageBox.init();

  if (settingsHandler.getGeneralSettings().verbose) {
    console.log('Moe Modifications Loaded');
  }
};
