import fetch from "isomorphic-fetch";
import EventEmitter from "./event.js";
import { getRandomColor, resolveUrl, stripUrl } from "./utils.js";

export default class GitHub extends EventEmitter {
	static async afterFetch(res) {
		const data = await res.json();

		return new Promise((resolve, reject) => {
			if (res.status >= 400) {
				reject(data);
			}

			resolve(data);
		});
	}

	constructor({ token } = {}) {
		super();

		this.headers = new Headers({
			...(token ? { Authorization: `token ${token}` } : {}),
			Accept: "application/json",
			"Content-Type": "application/json"
		});
	}

	// @section: plugin management:
	// @note: plugins reacts to events (signature: (this) => { eventName: (), ... })
	// @note: a plugin can subscribe to multiple listeners
	addPlugin(plugin) {
		const listeners = plugin(this);

		Object.keys(listeners).forEach(eventName => {
			this.addListener(eventName, listeners[eventName]);
		});
	}

	// @note: if there are no parameters, rest operator will be set by default to []
	addPlugins(...plugins) {
		plugins.forEach(plugin => {
			this.addPlugin(plugin);
		});
	}

	getStatics() {
		// @note: or return this.constructor:
		return GitHub;
	}

	// @section: http operations:
	async get(url) {
		const res = await fetch(url, {
			method: "GET",
			headers: this.headers
		});

		return GitHub.afterFetch(res);
	}

	async post(url, body = {}) {
		const res = await fetch(stripUrl(url), {
			method: "POST",
			headers: this.headers,
			body: JSON.stringify(body)
		});

		return GitHub.afterFetch(res);
	}

	async patch(url, body = {}) {
		const res = await fetch(stripUrl(url), {
			method: "PATCH",
			headers: this.headers,
			body: JSON.stringify(body)
		});

		return GitHub.afterFetch(res);
	}

	// @section: github operations:
	// @return: found label data ({id,url,name,color,default})
	async getLabel({ name, labels_url }) {
		return await this.get(resolveUrl(labels_url, name));
	}

	// @note: get reviews from a pr:
	// @return: array of reviews' object:
	async getReviews({ pull_request_url }) {
		return await this.get(resolveUrl(pull_request_url, "reviews"));
	}

	// @return: Boolean
	async hasLabel({ name, labels_url }) {
		try {
			await this.getLabel({ name, labels_url });

			return true;
		} catch (e) {
			return false;
		}
	}

	// @return: created label data ({id,url,name,color,default})
	async createLabel({ name, color, labels_url }) {
		return await this.post(labels_url, {
			name,
			color
		});
	}

	// @return: created label data ({id,url,name,color,default})
	async createComment({ body, issues_url, number }) {
		return await this.post(resolveUrl(issues_url, number, "comments"), {
			body
		});
	}

	// @note: add label to a pr:
	// @return: array of labels belongs to PR:
	async addLabel({ name, issues_url, number }) {
		return await this.post(resolveUrl(issues_url, number, "labels"), [name]);
	}

	// @section: github workflows:
	// @note: apply a given label to a PR (from its creation to its application):
	applyLabel({ name: labelName, issues_url, labels_url, number }) {
		const name = labelName.toUpperCase();

		// @note: we didn't check if label exists since createLabel can determine this for us
		// (if created an error will be triggered). We do like this to avoid an extra call
		// (for api rate limit purposes):
		return this.createLabel({
			name,
			color: getRandomColor(),
			labels_url
		})
			.catch(() => {
				console.error(
					`[service.applyLabel()] Label ${name} is already created`
				);
			})
			.then(() => {
				this.addLabel({
					name,
					issues_url,
					number
				});

				console.log("[service.applyLabel()] Success");
			})
			.catch(err => {
				console.error("[service.applyLabel()] Unexpected error occurred", err);
			});
	}
}
