const NewsEntry = requireApp('data/models').NewsEntry;
const service = module.exports = {

getAllInfo : function () {
    return NewsEntry.findAll({});
},
getByLink : function (link) {
	return NewsEntry.find({
        where : {
            link: link
        }
    });
},
create: function (attributes) {
    return NewsEntry.create(attributes);
}

};