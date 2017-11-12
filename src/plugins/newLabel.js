import { getRandomColor } from "../utils";

export default service => {
	// @return: found label data ({id,url,name,color,default})
	const getLabel = async ({ name, labels_url }) => {
		return await service.get(service.resolveUrl(labels_url, name));
	};

	// @return: Boolean
	const hasLabel = async ({ name, labels_url }) => {
		try {
			await getLabel({
				name,
				labels_url
			});

			return true;
		} catch (e) {
			return false;
		}
	};

	// @return: created label data ({id,url,name,color,default})
	const createLabel = async ({ name, color, labels_url }) => {
		return await service.post(labels_url, {
			name,
			color
		});
	};

	// @note: affect label to a pr:
	// @return: array of labels belongs to PR:
	const affectLabel = async ({ name, issues_url, number }) => {
		return await service.post(
			service.resolveUrl(issues_url, number, "labels"),
			[name]
		);
	};

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
				const hasLab = await hasLabel({
					name,
					labels_url
				});

				if (!hasLab) {
					await createLabel({
						name,
						color: getRandomColor(),
						labels_url
					});
				}

				await affectLabel({
					name,
					issues_url,
					number
				});

				console.log("Success");
			} catch (err) {
				console.error("Error", err);
			}
		}
	};
};
