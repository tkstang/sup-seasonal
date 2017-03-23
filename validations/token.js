const jwt = require('jsonwebtoken');

module.exports.verify = function verifyToken(req, res, next){
	const token = req.headers['token'];
	if (token){
		jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
			if (err) {
				return res.status(400).json('Failed to authenticate token.');
			} else {
				next();
			}
		});
	} else {
		return res.status(400).json('No token provided.')
	}
}
