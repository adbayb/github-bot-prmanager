export default (req, res) => {
	console.log("REQUEST", req);
	console.log("RESPONSE", res);
	res.end("Welcome to Micro. Node version: " + process.versions.node);
};
