import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class QuickSearch extends Component {

    handleClick = (mealtype) => {
        this.props.history.push(`/filter?mealType=${mealtype}`);
    }

    render() {
        const { image, title, description } = this.props;
        return (
            <>
                <div className="qs-box col-12 col-sm-12 col-md-6 col-lg-4" onClick={() => this.handleClick(title)} style={{ cursor: 'pointer' }}>
                    <div className="qs-box-items">
                        <img src={image} alt="not found"/>
                        <h4 className="qs-box-header">{title}</h4>
                        <p className="qs-box-desc">{description}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(QuickSearch);
