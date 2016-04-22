import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { EventManager } from '/lib/eventmanager.js';
import { mathjaxMarkdown } from '/client/lib/mathjax_markdown.js';
import { Splashscreen } from '/client/plugins/splashscreen/scripts/lib.js';
import * as lib from './lib.js';

Template.createQuestionView.events({
    'input #questionText': function () {
        if(!EventManager.findOne()) {
            return;
        }
        lib.addQuestion(EventManager.findOne().questionIndex);
    },
    //Save question in Sessions-Collection when Button "Next" is clicked
    'click #forwardButton': function () {
        if(!EventManager.findOne()) {
            return;
        }
        lib.addQuestion(EventManager.findOne().questionIndex);
        Router.go("/answeroptions");
    },
    "click #backButton": function () {
        Router.go("/");
    },
    "click #formatPreviewButton": function () {
        var formatPreviewText = $('#formatPreviewText');
        if (formatPreviewText.text() === "Bearbeiten") {
            lib.changePreviewButtonText("view.questions.format");
            $('#previewQuestionText').hide();
            $('#editQuestionText').show();
        } else if (formatPreviewText.text() === "Format") {
            lib.changePreviewButtonText("view.questions.preview");
        } else {
            new Splashscreen({
                autostart: true,
                templateName: "questionPreviewSplashscreen",
                closeOnButton: '#js-btn-hidePreviewModal',
                onRendered: function (instance) {
                    mathjaxMarkdown.initializeMarkdownAndLatex();
                    let content = mathjaxMarkdown.getContent($('#questionText').val());
                    instance.templateSelector.find('.modal-body').html(content).find('p').css("margin-left", "0px");
                }
            });
        }
    }
});