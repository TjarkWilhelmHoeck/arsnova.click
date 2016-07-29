import {Session} from 'meteor/session';
import {TAPi18n} from 'meteor/tap:i18n';
import * as localData from '/lib/local_storage.js';

let formatBootstrapSwitchTracker = null;

export function formatBootstrapSwitch() {
	$("#block_illegal_nicks_switch").bootstrapSwitch({
		size: "small",
		state: Session.get("questionGroup").getBlockIllegalNicks(),
		onText: TAPi18n.__("region.header.yes"),
		offText: TAPi18n.__("region.header.no"),
		wrapperClass: "input-field",
		animate: false,
		onSwitchChange: function (event, state) {
			var questionItem = Session.get("questionGroup");
			questionItem.setBlockIllegalNicks(state);
			Session.set("questionGroup", questionItem);
			localData.addHashtag(Session.get("questionGroup"));
		}
	});
}

export function setFormatBootstrapSwitchTracker(value) {
	if (value === null && formatBootstrapSwitchTracker) {
		formatBootstrapSwitchTracker.stop();
	}
	formatBootstrapSwitchTracker = value;
}