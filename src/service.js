import fetch from "isomorphic-fetch";
import { withMerge, stripUrl } from "./utils.js";

export default class GitHub {
	constructor({ token } = {}) {
		this.headers = new Headers({
			...(token ? { Authorization: `token ${token}` } : {}),
			Accept: "application/json",
			"Content-Type": "application/json"
		});
	}

	plugins = {};

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

	// @note: notify plugins for a specific event:
	notify(eventName, data) {
		const plugin = this.plugins[eventName];

		if (Array.isArray(plugin)) {
			return plugin.forEach(plug => {
				if (typeof plug === "function") {
					return plug(data);
				}

				console.warn("listen(): plugin must be a function");
			});
		}

		console.warn(`listen(): ${eventName} event doesn't exist`);
	}

	// @note: if there are no parameters, rest operator will be set by default to []
	// @note: plugins reacts to events (signature: (service) => { eventName: (), ... })
	use(...plugins) {
		this.plugins = plugins.reduce((prev, current) => {
			const plugin = current(this);
			return Object.keys(plugin).reduce(withMerge(plugin), prev);
		}, this.plugins);

		return;
	}
}
