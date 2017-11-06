import fetch from "isomorphic-fetch";
import { json, send } from "micro";

const githubService = new class {
	constructor() {
		this.baseUrl = "https://api.github.com/";
	}

	use() {
		// @note middleware chain
		return;
	}

	async getReviews() {
		// @note: example of url: https://api.github.com/repos/ayoubadib/test/pulls/2/reviews
		// if(!this.owner || !this.repo || ) @todo: use() middleware next()
		const endpoint = ["repos", "pulls//", "reviews"]
			.map(str => str.replace(/\//g, ""))
			.join("/");
		const data = await fetch(endpoint);
		console.log(data, "DATA");

		return await data.json();
	}

	setParams({ owner, repo, number }) {
		this.owner = owner;
		this.repo = repo;
		this.number = number;
	}
}();

export default async (req, res) => {
	try {
		const data = await json(req);
		if (data.action === "submitted") {
			//review posted
		}
		githubService.setParams({
			owner: "ayoubadib",
			repo: "test",
			number: 2
		});
		const reviews = await githubService.getReviews();
		// console.log("REQUEST", data);
	} catch (e) {
		return send(res, 500, `Internal server error: ${e.toString()}`);
	}

	return send(
		res,
		200,
		"Welcome to Micro. Node version: " + process.versions.node
	);
};
