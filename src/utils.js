// @note: string utils:

export const stripUrl = url => {
	// @note: url exposed by github api is formated like
	// https://api.github.com/repos/name/reponame/labels{/name}
	// we need to remove extra {.*}:
	return url.toString().replace(/^[/]+|{.*}|[/]+$/g, "");
};

export const getRandomColor = () => {
	return ((Math.random() * 0xffffff) << 0).toString(16);
};

export const resolveUrl = (...urlParts) => {
	// @note: toString() since resolve accepts only string
	// (especially if relativeUrl is a number)
	return urlParts.map(part => stripUrl(part)).join("/");
};
