'use strict';

var common = require('../../engine/postingOps').common;

exports.engineVersion = '2.5';


var pinkTextFunction = function(match) {
  return '<span class="pinkText">' + match + '</span>';

};

var echoesFunction = function(match) {
  return '<span class="echoText">' + match + '</span>';
};

var slantsFunction = function(match) {
  return '<span class="slopedText">' + match + '</span>';
};

var moeFunction = function(match) {
  var content = match.substring(5, match.length - 6);
  return '<span class="moeText">' + content + '</span>';
};

var magnetFunction = function(match) {
  return '<span class="magnetLink">' + '<a href="' + '    ' + match.replace(/&amp;/g, '&') + '">' + match.substring(20, 28) + '</a>' + '</span>';
};

var doomFunction = function(match) {
  var content = match.substring(6, match.length - 7);
  return '<span class="doomText">' + content + '</span>';
};

var boardTextFunction = function(match) {
  var content = match.substring(7, match.length - 8);
  return '<span class="boardText">' + content + '</span>';

};

var diceFunction = function(match) {
  var [num_of_dice, num_of_faces, modifier] = match.substring(6, match.length - 1).split(/d|[+-]/i);
  var mod_op = ''
  var rolls = [];
  var sum = 0;
  
  //Record all rolls
  if (num_of_faces != 0) {
    for (var i = 0; i < num_of_dice; ++i) {
      var roll = Math.floor(Math.random() * num_of_faces + 1);
      sum += roll;
      rolls.push(roll);
    }
  }

  //Handle any modifiers
  if (modifier != null) {
    modifier = Number(modifier);
    console.log(modifier);
    if (match.includes('+')) {
        sum += modifier;
        mod_op = '+';
    } else {
        sum -= modifier;
	mod_op = '-';
    }
  sum = Math.max(sum, 0);
  }

  return '<span class="diceRoll" title="' + rolls.join(', ') + '">'
	 + num_of_dice + 'd' + num_of_faces + mod_op + ((modifier != null) ? modifier : '') +' = ' + sum + '</span>';
};

var processLineOriginal = common.processLine;

common.processLine = function(split, replaceCode) {
  split = split.replace(/\({3,}.+?\){3,}/g, echoesFunction);
  split = split.replace(/\/{3,}.+?\\{3,}/g, slantsFunction);
  split = split.replace(/^&lt;.*/g, pinkTextFunction);
  split = split.replace(/\[moe\].*\[\/moe\]/gi, moeFunction);
  split = split.replace(/\[doom\].*\[\/doom\]/gi, doomFunction);
  split = split.replace(/\[board\].*\[\/board\]/gi, boardTextFunction);
  split = split.replace(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32,40}&amp;dn=.+&amp;tr=.+/gi, magnetFunction);
  split = split.replace(/\/roll{[0-9]{1,2}d[0-9]{1,6}([+-]?[0-9]+)?}/gi, diceFunction);
  return processLineOriginal(split, replaceCode);
};
