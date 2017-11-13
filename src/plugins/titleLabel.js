export default service => {
	const extractLabel = title => {
		const labelMatch = title.match(/\((.*)\)/);

		return labelMatch && labelMatch.pop();
	};

	return {
		async opened({
			pull_request: { title, number } = {},
			repository: { labels_url, issues_url } = {}
		}) {
			const name = extractLabel(title);

			if (!name) {
				return;
			}

			try {
				await service.applyLabel({
					name,
					issues_url,
					labels_url,
					number
				});

				console.error("[titleLabel::plugin] Success");
			} catch (err) {
				console.error("[titleLabel::plugin] Unexpected error: ", err);
			}
		}
	};
};
