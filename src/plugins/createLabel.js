export default service => ({
	// @note: opened (pr open event) from action field (github api):
	async labeled({
		pull_request: { title } = {},
		repository: { labels_url } = {}
	}) {
		console.log("PR Created", title);
		try {
			const res = await service.post(labels_url, {
				name: "toto6",
				color: "ff0000"
			});

			console.log("Success", res);
		} catch (e) {
			console.error("Error", e);
		}
	}
});
