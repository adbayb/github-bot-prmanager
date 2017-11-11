import dotenv from "dotenv";
import { json, send } from "micro";
import GitHub from "./service.js";
import createLabel from "./plugins/createLabel.js";

// @note: we populate process.env object with variables' values from .env file:
dotenv.config();

const github = new GitHub({
	token: process.env.GITHUB_TOKEN
});
github.use(createLabel);

export default async (req, res) => {
	try {
		const data = await json(req);
		const eventName = data.action;
		if (eventName === "submitted") {
			//review posted
		}
		github.notify(eventName, data);
	} catch (e) {
		return send(res, 500, `Internal server error: ${e.toString()}`);
	}

	return send(res, 200, "Node version: " + process.versions.node);
};
