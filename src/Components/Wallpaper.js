import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import '../Styles/wallpaper.css';

const constants = require('../constants');
const API_URL = constants.API_URL;

class Wallpaper extends Component {

    constructor() {
        super();
        this.state = {
            text: '',
            restaurants: [],
            suggestions: []
        }
    }

    locationChangeHandler = (event) => {
        const selectedValue = event.target.value;
        const city_id = selectedValue.split('_')[0];
        const city_name = selectedValue.split('_')[1];

        localStorage.setItem('city_id', city_id);

        // fetch the restaurants for this location
        axios.get(`${API_URL}/getRestaurantsByLocation/${city_name}`)
            .then(result => {
                this.setState({
                    restaurants: result.data.restaurants
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    onSearchTextChange = (event) => {
        const searchText = event.target.value;
        const { restaurants } = this.state;
        let suggestions = [];
        if (searchText.length > 0) {
            suggestions = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
        }
        this.setState({
            text: searchText,
            suggestions: suggestions
        });
    }

    navigateToRestaurant = (rest) => {
        this.props.history.push(`/details?id=${rest._id}`)
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;
        if (suggestions.length == 0) {
            return null;
        }
        return (
            <ul className="suggestionsBox">
                {
                    suggestions.map((item, index) => {
                        return (
                            <li key={index} className="suggestionItem" onClick={() => this.navigateToRestaurant(item)}>
                                <div className="suggestionImage">
                                    <img src={require('../' + item.image).default} alt="not found" />
                                </div>
                                <div className="suggestionText">
                                    <div className="suggestionTextName">
                                        {item.name}
                                    </div>
                                    <div className="suggestionTextLocality">
                                        {item.locality}
                                    </div>
                                </div>
                                <div className="orderButton text-danger">
                                    Order Now
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    render() {
        const { cities } = this.props;
        return (
            <>
                <img src={require('../Assets/home.png').default} alt="not found" height="450px" width="100%" />
                <div className="topSection">
                    <div className="logo">e!</div>
                    <div className="desc-text">Find the best restaurants, cafés, and bars</div>
                    <div className="search-options">
                        <select className="location" onChange={(event) => this.locationChangeHandler(event)}>
                            <option disabled value="">Select City</option>
                            {
                                cities.map((item, index) => {
                                    return <option key={index} value={item.city_id + '_' + item.city}>{item.name}, {item.city}</option>
                                })
                            }
                        </select>
                        <div className="searchSection">
                            <input className="search" type="text" placeholder="Search for food.." onChange={this.onSearchTextChange} />
                            {
                                this.renderSuggestions()
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(Wallpaper);
