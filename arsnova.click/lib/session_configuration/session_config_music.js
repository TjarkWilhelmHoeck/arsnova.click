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

const hashtag = Symbol("hashtag");
const isEnabled = Symbol("isEnabled");
const volume = Symbol("volume");
const title = Symbol("title");
const isLobbyEnabled = Symbol("isLobbyEnabled");
const lobbyTitle = Symbol("lobbyTitle");

export class MusicSessionConfiguration {
	constructor (options = {}) {
		this[hashtag] = options.hashtag;
		this[isEnabled] = typeof options.music.isEnabled === "undefined" ? true : options.music.isEnabled;
		this[volume] = options.music.volume || 80;
		this[title] = options.music.title || "Song1";
		this[isLobbyEnabled] = typeof options.music.isLobbyEnabled === "undefined" ? true : options.music.isLobbyEnabled;
		this[lobbyTitle] = options.music.lobbyTitle || "LobbySong1";
	}

	serialize () {
		return {
			hashtag: this.getHashtag(),
			isEnabled: this.isEnabled(),
			volume: this.getVolume(),
			title: this.getTitle(),
			isLobbyEnabled: this.getIsLobbyEnabled(),
			lobbyTitle: this.getLobbyTitle()
		};
	}

	equals (value) {
		return this.isEnabled() === value.isEnabled() &&
				this.getTitle() === value.getTitle() &&
				this.getVolume() === value.getVolume() &&
				this.getIsLobbyEnabled() === value.getIsLobbyEnabled &&
				this.getLobbyTitle() === value.getLobbyTitle;
	}

	getHashtag () {
		return this[hashtag];
	}

	setHashtag (value) {
		this[hashtag] = value;
	}

	isEnabled () {
		return this[isEnabled];
	}

	setEnabled (value) {
		if (typeof value !== "boolean") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setEnabled");
		}
		this[isEnabled] = value;
	}

	getVolume () {
		return this[volume];
	}

	setVolume (value) {
		if (typeof value !== "number") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setVolume");
		}
		this[volume] = value;
	}

	getTitle () {
		return this[title];
	}

	setTitle (value) {
		if (typeof value !== "string") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setTitle");
		}
		this[title] = value;
	}

	getIsLobbyEnabled () {
		return this[isLobbyEnabled];
	}

	setIsLobbyEnabled (value) {
		if (typeof value !== "boolean") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setEnabled");
		}
		this[isLobbyEnabled] = value;
	}

	getLobbyTitle () {
		return this[lobbyTitle];
	}

	setLobbyTitle (value) {
		if (typeof value !== "string") {
			throw new Error("Invalid argument list for MusicSessionConfiguration.setTitle");
		}
		this[lobbyTitle] = value;
	}
}
