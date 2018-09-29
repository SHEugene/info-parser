import React from "react";
import api  from '../lib/api';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MainHeader from '../components/MainHeader';
import * as InfoActions from '../actions/InfoAction'
import _ from 'lodash'
import NewsUnit from '../components/NewsUnit'

class Home extends  React.Component{

    constructor (props) {
        super(props);
        this.state = {
            infos : null
        }
    }
	componentDidMount () {
        this.props.actions.loadInfo();
    }
    render() {
    	const {info} = this.props.info;
        return (
            <div>
                <MainHeader/>
				{_.map(info,(inf) => (<div>{<NewsUnit news={inf}/>}</div>))}
            </div>
        );
    }

}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(InfoActions, dispatch),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)