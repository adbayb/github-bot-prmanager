import fetch from "isomorphic-fetch";
import EventEmitter from "./event.js";
import { stripUrl } from "./utils.js";

export default class GitHub extends EventEmitter {
	constructor({ token } = {}) {
		super();

		this.headers = new Headers({
			...(token ? { Authorization: `token ${token}` } : {}),
			Accept: "application/json",
			"Content-Type": "application/json"
		});
	}

	static async afterFetch(res) {
		const data = await res.json();

		return new Promise((resolve, reject) => {
			if (res.status >= 400) {
				reject(data);
			}

			resolve(data);
		});
	}

	async post(url, body = {}) {
		const res = await fetch(stripUrl(url), {
			method: "POST",
			headers: this.headers,
			body: JSON.stringify(body)
		});

		return GitHub.afterFetch(res);
	}

	async get(url) {
		const res = await fetch(url, {
			method: "GET",
			headers: this.headers
		});

		return GitHub.afterFetch(res);
	}

	async patch(url) {}

	resolveUrl(...urlParts) {
		// @note: toString() since resolve accepts only string
		// (especially if relativeUrl is a number)
		return urlParts.map(part => stripUrl(part)).join("/");
	}
}
