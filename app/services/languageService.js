const Language = requireApp('data/models').Language;

module.exports = {
	getAll: () => {
		return Language.findAll();
	}
};
