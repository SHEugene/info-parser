import React, { Component } from 'react'
const i18n = require('../lib/i18n');

class PageHome extends Component {
	render() {
		return <div>{i18n.__('client.site.description')}</div>;
	}
}
export default PageHome
