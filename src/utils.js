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
