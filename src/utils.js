// @note: string utils:

export const stripUrl = url => {
	// @note: url exposed by github api is formated like
	// https://api.github.com/repos/name/reponame/labels{/name}
	// we need to remove extra {.*}:
	return url.toString().replace(/^[/]+|{.*}|[/]+$/g, "");
};
