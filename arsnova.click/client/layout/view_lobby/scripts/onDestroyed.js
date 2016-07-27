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
import {lobbySound} from '/client/plugins/sound/scripts/lib.js';
import {memberlistObserver} from './lib.js';

Template.memberlist.onDestroyed(function () {
	if (memberlistObserver) {
		memberlistObserver.stop();
	}
	lobbySound.stop();
	Session.set("allMembersCount", undefined);
	Session.set("maxLearnerButtons", undefined);
	Session.set("learnerCountOverride", undefined);
	delete Session.keys.allMembersCount;
	delete Session.keys.maxLearnerButtons;
	delete Session.keys.learnerCountOverride;
});
