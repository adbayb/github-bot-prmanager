export default service => ({
	// @note: opened (pr open event) from action field (github api):
	async labeled({
		pull_request: { title, number } = {},
		repository: { labels_url, issues_url } = {}
	}) {
		console.log(
			"PR Created",
			title,
			service.resolveUrl(issues_url, number.toString())
		);
		try {
			const res = await service.post(labels_url, {
				name: "myfirst1",
				color: "ffff00"
			});

			console.log("Success", res);
		} catch (e) {
			console.error("Error", e);
		}
	}
});
