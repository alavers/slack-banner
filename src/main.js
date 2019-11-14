'use strict';

var $ = require('jquery');
var fs = require('fs');
var hashabet = fs.readFileSync(__dirname + '/hashabet.flf', 'utf8');
require('./main.less');
var figlet = require('./figlet');
var ClipboardJS = require('./clipboard');
figlet.parseFont('default', hashabet);

// TODO: Customizable background
var bg = '⬜';

function emojifyAciiArt(text, fg, bg) {
    text = text.replace(/ /g, bg);
    text = text.replace(/#/g, fg);
    return text;
}

function renderAsciiArt(text, done) {
    figlet(text, 'default', function(err, asciiArt) {
        if (err) {
            console.error('figlet error');
            console.dir(err);
            return;
        }
        done(err, asciiArt);
    });
}

function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}

function isEmoji(s) {
    if ((s.length === 2) && (byteCount(s) === 4)) {
        // Double character of 4 bytes is probably an emoji
        // Try to render it
        return true;
    } else {
        // If not, its a string, render a preview ?
        return false;
    }
}

$(document).ready(function() {
    var sourceInput = $('.source');
    var resultTextBox = $('.result');
    var options = $('.option');
    var hint = $('.hint');
    var copyButton = $('#copy-button');
    var cb = new ClipboardJS('#copy-button');

    cb.on("success", function() {
        var orig = copyButton.html();
        copyButton.html('COPIED!');
        setTimeout(function() {
            copyButton.html(orig);
        }, 1000);
    });

    cb.on("error", function() {
        var orig = copyButton.html();
        copyButton.html('shit didnt work');
        setTimeout(function() {
            copyButton.html(orig);
        }, 1000);
    });

    chooseFg(options.first());

    function chooseFg(e) {
        var el = $(e);
        options.removeClass('selected');
        el.addClass('selected');
    }

    function render() {
        var sourceText = sourceInput.val();
        var selectedFg = $('.option.selected');
        var previewFg;
        var realFg;
        hint.addClass('invisible');

        if (selectedFg.hasClass('custom')) {
            var customValue = selectedFg.find('input').val();
            if (customValue === '') {
                previewFg = realFg = '';
                sourceText = '';
            } else if (isEmoji(customValue)) {
                previewFg = realFg = customValue;
            } else {
                hint.removeClass('invisible');
                hint.html('(❓' + ' =      ' + customValue + ')');
                previewFg = '❓';
                realFg = customValue;
            }
        } else {
            previewFg = realFg = selectedFg.html();
        }

        renderAsciiArt(sourceText, function(err, asciiArt) {
            var preview = emojifyAciiArt(asciiArt, previewFg, bg);
            var clipboard = emojifyAciiArt(asciiArt, realFg, bg);
            resultTextBox.val(preview);
            copyButton.attr('data-clipboard-text', clipboard);
        })
    }

    options.click(function(e) {
        chooseFg(this);
        render();
    })

    $('.custom input').keyup(function() {
        render();
    });

    sourceInput.keyup(function() {
        render();
    });

    render();
});
