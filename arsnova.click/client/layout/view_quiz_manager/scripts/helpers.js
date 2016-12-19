
import {Session} from 'meteor/session';
import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import * as questionLib from '/client/layout/view_questions/scripts/lib.js';

Template.quizManager.helpers({
	questionTypes: function () {
		return questionLib.getQuestionTypes();
	},
	isMovingQuestion: function () {
		return Session.get("isMovingQuestion");
	},
	getDescriptionForQuestionType: function (typeName) {
		return "view.question_type.description." + typeName;
	}
});

Template.quizManagerDetails.helpers({
	getQuestionIndex: function () {
		return Router.current().params.questionIndex;
	},
	isXsDevice: function () {
		return $(document).width() <= 768;
	}
});