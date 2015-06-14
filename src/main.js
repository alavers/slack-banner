'use strict';

var $ = require('jquery');
var fs = require('fs');
var hashabet = fs.readFileSync(__dirname + '/hashabet.flf', 'utf8');
require('./main.less');
var figlet = require('./figlet');

figlet.parseFont('default', hashabet);

function renderHtmlPreview(text) {
    text = text.replace(/ /g, '<div class="white_square"></div>');
    text = text.replace(/#/g, '<div class="thumbsup"></div>');
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    return text;
}

function renderChatText(text) {
    text = text.replace(/ /g, ':white_square:');
    text = text.replace(/#/g, ':thumbsup:');
    return text;
}

function renderAsciiArt(text, done) {
    figlet(text, 'default', function(err, asciiArt) {
        if (err) {
            console.log('something went wrong...');
            console.dir(err);
            return;
        }
        done(err, asciiArt);
    });
}

$(document).ready(function() {
    var sourceInput = $('.source');
    var preview = $('.preview');
    var resultTextBox = $('.result');

    sourceInput.keyup(function() {
        var sourceText = sourceInput.val();
        renderAsciiArt(sourceText, function(err, asciiArt) {
            var htmlPreview = renderHtmlPreview(asciiArt);
            preview.html(htmlPreview);

            var result = renderChatText(asciiArt);
            resultTextBox.val(result);
        })
    });
});
