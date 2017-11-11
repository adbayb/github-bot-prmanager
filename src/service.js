import { withMerge } from "./utils.js";

export default class GitHub {
	plugins = {};

	authenticate() {}

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
