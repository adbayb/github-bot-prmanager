// @note: reduce utils:

export const withMerge = reducer => (accu = {}, currentIndex) => {
	const reducerVal = reducer[currentIndex];
	const accuVal = accu[currentIndex];

	return {
		...accu,
		[currentIndex]: [
			...(accuVal ? accuVal : []),
			...(reducerVal ? [reducerVal] : [])
		]
	};
};

// @note: string utils:

export const stripUrl = url => {
	// @note: url exposed by github api is formated like
	// https://api.github.com/repos/name/reponame/labels{/name}
	// we need to remove extra {.*}:
	return url.replace(/{.*}/, "");
};
