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
 * along with ARSnova Click.  If not, see <http://www.gnu.org/licenses/>.
 */

Template.modalShowMyHashtags.helpers({
    hashtags: function () {
        return localData.getAllHashtags();
    }
});

Template.modalShowMyHashtags.events({
    "click .js-my-hash": function (event) {
        var hashtag = event.target.innerHTML;
        localData.reenterSession(hashtag);
        Session.set("isOwner", true);
        Session.set("hashtag", hashtag);
        Meteor.call("Hashtags.setIsActive", localData.getPrivateKey(), hashtag, 1);

        closeAndRedirectTo('/question');
    },
    "click #js-btn-showHashtagManagement": function (event) {
        closeAndRedirectTo('/hashtagmanagement');
    }
});