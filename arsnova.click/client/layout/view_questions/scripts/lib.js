import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { TAPi18n } from 'meteor/tap:i18n';
import * as localData from '/client/lib/local_storage.js';
import { splashscreen_error } from '/client/plugins/splashscreen/scripts/lib.js';

export var subscriptionHandler = null;

export function addQuestion(index) {
    var questionText = $('#questionText').val();
    Meteor.call("QuestionGroup.addQuestion", {
        privateKey: localData.getPrivateKey(),
        hashtag: Session.get("hashtag"),
        questionIndex: index,
        questionText: questionText
    }, (err) => {
        if (err) {
            splashscreen_error.setErrorText(TAPi18n.__("plugins.splashscreen.error.error_messages."+err.reason));
            splashscreen_error.open();
        } else {
            localData.addQuestion(Session.get("hashtag"), index, questionText);
        }
    });
}

export function calculateWindow() {
    var hashtag_length = Session.get("hashtag").length;
    var headerTitel = $(".header-titel");
    var fontSize = "";
    var marginTopModifier = 0;

    if(hashtag_length <= 10){
        if($(document).width() < 1200){
            fontSize = "6vw";
            marginTopModifier = 0.1;
        } else {
            fontSize = "5vw";
            marginTopModifier = 0.2;
        }

    } else if(hashtag_length > 10 && hashtag_length <= 15){
        fontSize = "4vw";
        marginTopModifier = 0.4;
    } else {
        fontSize = "2.5vw";
        marginTopModifier = 0.6;
    }

    headerTitel.css("font-size", fontSize);
    headerTitel.css("margin-top", $(".arsnova-logo").height() * marginTopModifier);
}

export function calculateAndSetPreviewSplashWidthAndHeight() {
    $('.modal-dialog').width($('#mainContentContainer').width() - 40);
}

export function questionContainsMarkdownSyntax(questionText) {
    if (doesMarkdownSyntaxExist(questionText, '**', '**') || doesMarkdownSyntaxExist(questionText, '#', '#') || doesMarkdownSyntaxExist(questionText, '[', '](', ')') ||
        doesMarkdownSyntaxExist(questionText, '- ') || doesMarkdownSyntaxExist(questionText, '1. ') || doesMarkdownSyntaxExist(questionText, '\\(', '\\)') ||
        doesMarkdownSyntaxExist(questionText, '$$', '$$') || doesMarkdownSyntaxExist(questionText, '<hlcode>', '</hlcode>') || doesMarkdownSyntaxExist(questionText, '>')) {
        return true;
    } else {
        return false;
    }
}

function doesMarkdownSyntaxExist (questionText, syntaxStart, syntaxMiddle, syntaxEnd) {
    if (questionText.length <= 0) {
        return false;
    }

    if (questionText.indexOf(syntaxStart) !=-1) {
        if (!syntaxMiddle && !syntaxEnd) {
            return true;
        }
    } else {
        return false;
    }

    questionText = questionText.substring(questionText.indexOf(syntaxStart) + syntaxStart.length, questionText.length);

    if (questionText.indexOf(syntaxMiddle) !=-1) {
        if (!syntaxEnd) {
            return true;
        }
    } else {
        return false;
    }

    questionText = questionText.substring(questionText.indexOf(syntaxMiddle) + syntaxMiddle.length, questionText.length);

    if (questionText.indexOf(syntaxEnd) !=-1) {
        return true;

    } else {
        return false;
    }
}

export function changePreviewButtonText(text) {
    $('#formatPreviewText').text(text);
    $('#formatPreviewGlyphicon').removeClass("glyphicon-cog").addClass("glyphicon-phone");
    $('#markdownBarDiv').removeClass('hide');
    $('#questionText').removeClass('round-corners').addClass('round-corners-markdown');
}