import React, { Component } from 'react'
import { Link } from 'react-router'
const i18n = require('../lib/i18n');

export default class NotFound extends Component {
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
			  {i18n.__('not_found.text')}<Link to='/'>{i18n.__('not_found.main')}</Link>?
          </div>
        </div>
      </div>
    )
  }
}
