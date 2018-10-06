const parserController = requireApp('controllers/parserController');
const should = require('should');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
describe('getLinks',function () {
	it('should return 27 links',  function () {
		const body =   fs.readFileSync(path.join(__dirname,'mocks/linkPage.html'),'utf8');
		const result = parserController.getLinks(body);
		result.length.should.be.equal(27)
	})
	it('should return 0 links',  function () {
		const body =   fs.readFileSync(path.join(__dirname,'mocks/empty.html'),'utf8');
		const result = parserController.getLinks(body);
		result.length.should.be.equal(0)
	})
});

describe('getNewEntityFromBody',function () {
	it('should be throws exception when permission denied  ',function () {
		const body =   fs.readFileSync(path.join(__dirname,'mocks/withoutAccess.html'),'utf8');
		let ex = null;
		try {
			const result = parserController.getNewEntityFromBody(body);
		}
		catch (e) {
			ex = e
		}
		ex.should.not.be.equal(null);
	});
	it('should returns header - No header  ',function () {
		const body =   fs.readFileSync(path.join(__dirname,'mocks/withoutHeader.html'),'utf8');
		const result = parserController.getNewEntityFromBody(body);
		result.header.should.be.equal('No header');
	});
	it('should returns null - without paragraphs',function () {
		const body =   fs.readFileSync(path.join(__dirname,'mocks/withoutParagraphs.html'),'utf8');
		const result = parserController.getNewEntityFromBody(body);
		assert.equal(result,null);
	});
	it('should returns null - without texts',function () {
		const body =   fs.readFileSync(path.join(__dirname,'mocks/withoutText.html'),'utf8');
		const result = parserController.getNewEntityFromBody(body);
		assert.equal(result,null);
	});
	it('should returns not null newsEntity',function () {
		const body =   fs.readFileSync(path.join(__dirname,'mocks/mainPage.html'),'utf8');
		const result = parserController.getNewEntityFromBody(body,'http://google.com');
		result.header.should.not.be.equal(null);
		result.link.should.not.be.equal(null);
		result.description.should.not.be.equal(null);
	});
});
