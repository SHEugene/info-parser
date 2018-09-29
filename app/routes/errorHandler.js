const Sequelize = requireApp('data/models').Sequelize;

const errorHandler = function (router, viewPath) {
	router.use(function (err, req, res, next) {
		const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';

		if (err.status !== 403 && err.status !== 404 && err.status !== 401 && err.status !== 422) {
			req.log.error({ err: err, req: req, user: req.user });
			if (err instanceof Sequelize.ValidationError) {
				req.log.error({ err: err.errors, req: req, user: req.user });
			}
		} else {
			req.log.warn({ err: err, req: req, user: req.user });
			if (err instanceof Sequelize.ValidationError) {
				req.log.warn({ err: err.errors, req: req, user: req.user });
			}
		}
		if (err.viewPath) {
			viewPath = err.viewPath;
		}


		res.status(err.status || 500);
		if (req.accepts(['json', 'html']) === 'html') {
			let title;
			let text;
			if (err.status === 403 && err.type === 'community') {
				title = req.i18n.__('errors.403.title');
				text = req.i18n.__('errors.403_community.text');
			} else if (err.status === 404) {
				title = req.i18n.__('errors.404.title');
				text = req.i18n.__('errors.404.text');
			} else if (err.status === 403) {
				title = req.i18n.__('errors.403.title');
				text = req.i18n.__('errors.403.text');
			} else if (err.status === 400) {
				title = '';
				if (err.data && err.data.message) {
					text = req.i18n.__(err.data.message);
				} else {
					req.i18n.__(err.message);
				}
			} else if (err.status === 401) {
				title = req.i18n.__('errors.401.title');
				text = req.i18n.__('errors.401.text');
			} else {
				title = req.i18n.__('errors.default.title');
				text = req.i18n.__('errors.default.text');
			}
			res.render(viewPath || 'error', {
				readableTitle: title,
				readableText: text,
				message: err.message,
				status: err.status,
				error: isDevelopmentEnvironment ? err : {}
			});
		} else {
			res.json({
				message: (err.data && err.data.message) || err.message,
				status: err.status || 500,
				debug: isDevelopmentEnvironment ? err : null,
				data: err.data
			});
		}

	});
};

module.exports = errorHandler;
