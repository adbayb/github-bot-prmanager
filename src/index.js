import { json, send } from "micro";

export default async (req, res) => {
	try {
		const data = await json(req);
		console.log("REQUEST", data);
	} catch (e) {
		return send(res, 500, `Internal server error: ${e.toString()}`);
	}

	return send(
		res,
		200,
		"Welcome to Micro. Node version: " + process.versions.node
	);
};
