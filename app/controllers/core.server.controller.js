'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	console.log('core: ', req);
	res.render('index', {
		user: req.user || null,
		request: req
	});
};