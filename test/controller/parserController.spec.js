const parserController = requireApp('controllers/parserController');
const fs = require('fs');
var path = require('path');
describe('getLinks',function () {
	it('should return 3 links', function () {
		const body = fs.readFile(path.join(__dirname,'./mocks/linkPage.html'));


		const result = parserController.getLinks();


	})
});