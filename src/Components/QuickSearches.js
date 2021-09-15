import React, { Component } from 'react';
import QuickSearch from './QuickSearch';

export default class QuickSearches extends Component {
    render() {
        const { quicksearches } = this.props;
        return (
            <>
                <div className="bottomSection container">
                    <h1 className="bottom-header">Quick Searches</h1>
                    <h3 className="bottom-subheader">Discover restaurants by type of meal</h3>
                    <div className="qs row">
                        {
                            quicksearches.map((item, index) => {
                                return <QuickSearch key={index} image={require('../' + item.image).default} title={item.name} description={item.content} />
                            })
                        }
                    </div>
                </div>
            </>
        )
    }
}
