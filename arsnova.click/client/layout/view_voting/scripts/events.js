/*
 * This file is part of ARSnova Click.
 * Copyright (C) 2016 The ARSnova Team
 *
 * ARSnova Click is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Click is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Click.  If not, see <http://www.gnu.org/licenses/>.*/

import {Session} from 'meteor/session';
import {Template} from 'meteor/templating';
import {EventManager} from '/lib/eventmanager.js';
import {AnswerOptions} from '/lib/answeroptions.js';
import {QuestionGroup} from '/lib/questions.js';
import {mathjaxMarkdown} from '/client/lib/mathjax_markdown.js';
import {Splashscreen} from "/client/plugins/splashscreen/scripts/lib.js";
import {makeAndSendResponse} from './lib.js';

Template.votingview.events({
	'click #js-btn-showQuestionAndAnswerModal': function (event) {
		event.stopPropagation();
		var questionDoc = QuestionGroup.findOne();
		if (!questionDoc) {
			return;
		}

		mathjaxMarkdown.initializeMarkdownAndLatex();
		let questionContent = mathjaxMarkdown.getContent(questionDoc.questionList[EventManager.findOne().questionIndex].questionText);
		var answerContent = "";

		let hasEmptyAnswers = true;

		AnswerOptions.find({questionIndex: EventManager.findOne().questionIndex}, {sort: {answerOptionNumber: 1}}).forEach(function (answerOption) {
			if (!answerOption.answerText) {
				answerOption.answerText = "";
			} else {
				hasEmptyAnswers = false;
			}

			answerContent += String.fromCharCode((answerOption.answerOptionNumber + 65)) + "<br/>";
			answerContent += mathjaxMarkdown.getContent(answerOption.answerText) + "<br/>";
		});

		if (hasEmptyAnswers) {
			answerContent = "";
			$('#answerOptionsHeader').hide();
		}

		new Splashscreen({
			autostart: true,
			templateName: 'questionAndAnswerSplashscreen',
			closeOnButton: '#js-btn-hideQuestionModal',
			instanceId: "questionAndAnswers_" + EventManager.findOne().questionIndex,
			onRendered: function (instance) {
				instance.templateSelector.find('#questionContent').html(questionContent);
				instance.templateSelector.find('#answerContent').html(answerContent);
			}
		});
	},
	"click #forwardButton": function (event) {
		event.stopPropagation();
		if (Session.get("hasSendResponse")) {
			return;
		}

		Session.set("hasSendResponse", true);
		var responseArr = JSON.parse(Session.get("responses"));
		for (var i = 0; i < AnswerOptions.find({questionIndex: EventManager.findOne().questionIndex}).count(); i++) {
			if (responseArr[i]) {
				makeAndSendResponse(i);
			}
		}
		if (EventManager.findOne().questionIndex + 1 >= QuestionGroup.findOne().questionList.length) {
			Session.set("sessionClosed", true);
		}
		Router.go("/results");
	},
	"click .sendResponse": function (event) {
		event.stopPropagation();

		if (Session.get("questionSC")) {
			makeAndSendResponse(event.currentTarget.id);
			Router.go("/results");
		} else {
			var responseArr = JSON.parse(Session.get("responses"));
			var currentId = event.currentTarget.id;
			responseArr[currentId] = responseArr[currentId] ? false : true;
			Session.set("responses", JSON.stringify(responseArr));
			Session.set("hasToggledResponse", JSON.stringify(responseArr).indexOf("true") > -1);
			$(event.target).toggleClass("answer-selected");
		}
	}
});