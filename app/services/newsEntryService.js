const NewsEntry = requireApp('data/models').NewsEntry;
const service = module.exports = {

getAllInfo : function () {
    return NewsEntry.findAll({});
},
create: function (attributes) {
    return NewsEntry.create(attributes);
}

};