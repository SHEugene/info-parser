const Info = requireApp('data/models').Info;
const service = module.exports = {

getAllInfo : function () {
    return Info.findAll({});
}

};