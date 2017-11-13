export default service => {
	const LABEL_NAME = "LGTM";
	const COMMENT = `${LABEL_NAME} !`;
	const MIN_APPROVALS = 1;

	const getLastReviews = (reviews = []) => {
		return reviews.reduce((prev, current = {}) => {
			const { user: { login } = {}, state } = current;

			// @note: only these two states are relevant to validate or not a PR ("COMMENTED" state is not relevant)
			if (state !== "APPROVED" && state !== "CHANGES_REQUESTED") {
				return prev;
			}

			return { ...prev, [login]: state };
		}, {});
	};

	return {
		async submitted({
			pull_request: { url, number } = {},
			repository: { labels_url, issues_url } = {}
		}) {
			try {
				const reviews = await service.getReviews({ pull_request_url: url });
				/* @note: reviews array contains all reviews objects history (a same user can
				review multiple times so potentially we can have multiple reviews
				for the same user: so we need to only pay attention on the last review
				for each user (e.g. reviews.reverse().find(user) ) */
				const reviewsPerUser = getLastReviews(reviews);
				const statesPerUser = Object.values(reviewsPerUser);
				const numApprovals =
					(!statesPerUser.includes("CHANGES_REQUESTED") &&
						statesPerUser.filter(state => state === "APPROVED").length) ||
					0;

				if (numApprovals < MIN_APPROVALS) {
					return;
				}

				await service.applyLabel({
					name: LABEL_NAME,
					issues_url,
					labels_url,
					number
				});
				await service.createComment({
					body: COMMENT,
					issues_url,
					number
				});

				console.log("[approvedLabel::plugin] Success");
			} catch (err) {
				console.error("[approvedLabel::plugin] Unexpected error: ", err);
			}
		}
	};
};
