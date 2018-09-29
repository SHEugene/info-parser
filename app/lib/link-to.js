const linkTo = module.exports = {
	createLocal: function (req) {
		return function (target) {
			const url = req.originalUrl;
			if (url.match(/^\/tenants\/[0-9]*\/manage/)) {
				return linkTo.manage(req.tenant, target);
			} else if (req.community) {
				return linkTo.community(req.community, target);
			} else {
				return '/app/register/' + target;
			}
		};
	}
};
