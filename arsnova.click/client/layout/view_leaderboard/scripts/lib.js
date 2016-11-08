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

import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {EventManagerCollection} from '/lib/eventmanager/collection.js';
import {AnswerOptionCollection} from '/lib/answeroptions/collection.js';
import {ResponsesCollection} from '/lib/responses/collection.js';
import {QuestionGroupCollection} from '/lib/questions/collection.js';

export function setMaxResponseButtons(value) {
	Session.set("maxResponseButtons", value);
}

export function calculateButtonCount(allMembersCount) {
	/*
	 This session variable determines if the user has clicked on the show-more-button. The button count must not
	 be calculated then. It is set in the event handler of the button and is reset if the user reenters the page
	 */
	if (Session.get("responsesCountOverride")) {
		setMaxResponseButtons(allMembersCount);
		return;
	}

	/*
	 To calculate the maximum output of attendee button rows we need to:
	 - get the mainContentContainer height (the content wrapper for all elements)
	 - subtract the appTitle height (the indicator for the question index)
	 */
	var viewport = $('.contentPosition');

	var viewPortHeight = viewport.outerHeight();

	/* The height of the learner button must be set manually if the html elements are not yet generated */
	var btnLearnerHeight = $('.button-leader').first().parent().outerHeight(true) ? $('.button-leader').first().parent().outerHeight(true) : 70;

	/* Calculate how much buttons we can place in the viewport until we need to scroll */
	var queryLimiter = Math.floor(viewPortHeight / btnLearnerHeight);

	/*
	 Multiply the displayed elements by 2 if on widescreen and reduce the max output of buttons by 1 row for the display
	 more button if necessary. Also make sure there is at least one row of buttons shown even if the user has to scroll
	 */
	var limitModifier = viewport.outerWidth() >= 992 ? 2 : 1;

	queryLimiter *= limitModifier;
	queryLimiter -= limitModifier;
	if (queryLimiter <= 0) {
		queryLimiter = limitModifier;
	}

	/*
	 This variable holds the amount of shown buttons and is used in the scripts functions
	 */
	setMaxResponseButtons(queryLimiter);
}

function checkIsCorrectSingleChoiceQuestion(response, questionIndex) {
	let hasCorrectAnswer = false;
	AnswerOptionCollection.find({
		isCorrect: true,
		questionIndex: questionIndex,
		inputValue: response.inputValue,
		hashtag: Router.current().params.quizName
	}).fetch().forEach(function (answeroption) {
		hasCorrectAnswer = $.inArray(answeroption.answerOptionNumber, response.answerOptionNumber) > -1;
	});
	return hasCorrectAnswer;
}

function checkIsCorrectRangedQuestion(response, questionIndex) {
	const question = QuestionGroupCollection.findOne({
		hashtag: Router.current().params.quizName
	}).questionList[questionIndex];
	return response.rangedInputValue >= question.rangeMin && response.rangedInputValue <= question.rangeMax;
}

function checkIsCorrectFreeTextQuestion(response, questionIndex) {
	const answerOption = AnswerOptionCollection.findOne({questionIndex: questionIndex});
	let	userHasRightAnswers = false;
	if (!answerOption.configCaseSensitive) {
		answerOption.answerText = answerOption.answerText.toLowerCase();
		response.freeTextInputValue = response.freeTextInputValue.toLowerCase();
	}
	if (!answerOption.configTrimWhitespaces) {
		answerOption.answerText = answerOption.answerText.replace(/ /g, "");
		response.freeTextInputValue = response.freeTextInputValue.replace(/ /g, "");
	}
	if (!answerOption.configUsePunctuation) {
		answerOption.answerText = answerOption.answerText.replace(/(\.)*(,)*(!)*(")*(;)*(\?)*/g, "");
		response.freeTextInputValue = response.freeTextInputValue.replace(/(\.)*(,)*(!)*(")*(;)*(\?)*/g, "");
	}
	if (answerOption.configUseKeywords) {
		userHasRightAnswers = answerOption.answerText === response.freeTextInputValue;
	} else {
		let hasCorrectKeywords = true;
		answerOption.answerText.split(" ").forEach(function (keyword) {
			if (response.freeTextInputValue.indexOf(keyword) === -1) {
				hasCorrectKeywords = false;
			}
		});
		userHasRightAnswers = hasCorrectKeywords;
	}
	return userHasRightAnswers;
}

export function isCorrectResponse(response, question, questionIndex) {
	switch (question.type) {
		case "SingleChoiceQuestion":
		case "YesNoSingleChoiceQuestion":
		case "TrueFalseSingleChoiceQuestion":
		case "MultipleChoiceQuestion":
			return checkIsCorrectSingleChoiceQuestion(response, questionIndex);
		case "SurveyQuestion":
			return false;
		case "RangedQuestion":
			return checkIsCorrectRangedQuestion(response, questionIndex);
		case "FreeTextQuestion":
			return checkIsCorrectFreeTextQuestion(response, questionIndex);
		default:
			throw new Error("Unsupported question type while checking correct response");
	}
}

export function objectToArray(obj) {
	return $.map(obj, function (value, index) {
		return [{nick: index, responseTime: value}];
	});
}

export function getLeaderboardItemsByIndex(questionIndex) {
	const hashtag = Router.current().params.quizName;
	const question = QuestionGroupCollection.findOne({
		hashtag: hashtag
	}).questionList[questionIndex];
	const result = {};
	ResponsesCollection.find({
		hashtag: hashtag,
		questionIndex: questionIndex
	}).fetch().forEach(function (response) {
		const isCorrect = isCorrectResponse(response, question, questionIndex);
		if (isCorrect) {
			if (typeof result[response.userNick] === "undefined") {
				result[response.userNick] = 0;
			}
			result[response.userNick] += response.responseTime;
		}
	});
	return result;
}

export function getAllLeaderboardItems() {
	let allItems = getLeaderboardItemsByIndex(0);
	for (let i = 1; i < EventManagerCollection.findOne().questionIndex; i++) {
		const tmpItems = getLeaderboardItemsByIndex(i);
		var result = $.extend({}, allItems, tmpItems);
		for (const o in result) {
			if (result.hasOwnProperty(o)) {
				if (typeof allItems[o] !== "undefined" && typeof tmpItems[o] !== "undefined") {
					result[o] = allItems[o] + tmpItems[o];
				} else {
					delete result[o];
				}
			}
		}
		allItems = result;
	}
	return allItems;
}

export function generateExportData() {
	const items = Session.get("nicks");
	let csvString = "Nickname,ResponseTime (ms),UserID,Email\n";
	items.forEach(function (item) {
		let responseTime = 0;
		const responses = ResponsesCollection.find({hashtag: Router.current().params.quizName, userNick: item.nick}, {userRef: 1});
		const user = Meteor.users.findOne({_id: responses.collection.findOne().userRef});
		if (user) {
			responseTime = item.responseTime;
			if (typeof user !== "undefined") {
				item.id      = user.profile.id;
				item.mail    = user.profile.mail instanceof Array ? user.profile.mail.join(",") : user.profile.mail;
				csvString += item.nick + "," + responseTime + "," + item.id + "," + item.mail + "\n";
			} else {
				csvString += item.nick + "," + responseTime + ",,\n";
			}
		}
	});
	return csvString;
}
