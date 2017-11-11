import fetch from "isomorphic-fetch";
import { json, send } from "micro";
import GitHub from "./service.js";
import createLabel from "./plugins/createLabel.js";

const github = new GitHub();
github.use(createLabel);

export default async (req, res) => {
	try {
		const data = await json(req);
		if (data.action === "submitted") {
			//review posted
		}
	} catch (e) {
		return send(res, 500, `Internal server error: ${e.toString()}`);
	}

	return send(
		res,
		200,
		"Welcome to Micro. Node version: " + process.versions.node
	);
};
