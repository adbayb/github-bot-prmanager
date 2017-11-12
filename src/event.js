class EventEmitter {
	// @note: We use Map object instead of Object since a Map iterates its
	// elements in insertion order whereas iteration order is not specified
	// for Objects (Object is an unordered collection of properties and each
	// browser/runtime have his own rules about the order in objects).
	// Listeners insertion is important since we might apply a plugin
	// before another one and order can have impact on how the workflow works:
	listeners = new Map();

	emit(eventName, data) {
		if (!this.listeners.has(eventName)) {
			return false;
		}

		this.listeners.get(eventName).forEach(listener => {
			listener(data);
		});

		return true;
	}

	// @note: plugins reacts to events (signature: (service) => { eventName: (), ... })
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

	addListener(eventName, callback) {
		if (typeof callback !== "function") {
			return false;
		}

		!this.listeners.has(eventName) && this.listeners.set(eventName, []);
		const listeners = this.listeners.get(eventName);
		this.listeners.set(eventName, [...listeners, callback]);

		return true;
	}

	removeListener() {
		// @todo
		return;
	}
}

export default EventEmitter;
