import React from "react";


class NewsUnit extends  React.Component {
	constructor (props) {
		super(props);
	}
	render() {
		const {news} = this.props;
		return ( news ?
				(<div className='news-container'>
					<div className='row news_header'>
						{news.header}
					</div>
					<div className='row news-description ' >
						{news.description}
					</div>
				</div> ): null
		);
	}
}


export  default  NewsUnit;