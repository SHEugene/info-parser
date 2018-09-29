import React from "react";


class NewsUnit extends  React.Component {
	constructor (props) {
		super(props);
	}
	render() {
		const {news} = this.props;
		return ( news ?
				(<div>
					<div className='row'>
						{news.header}
					</div>
					<div className='row'>
						{news.description}
					</div>
				</div> ): null
		);
	}
}


export  default  NewsUnit;