export default service => {
	return {
		async labeled(data) {
			// console.log("PR", data);
			console.log(service, "SERVICE");
			console.log(service.getStatics());
		}
	};
};
