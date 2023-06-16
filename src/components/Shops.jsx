import React, { Component } from 'react';
import { get } from './HttpService';
import queryString from 'query-string'
import { Link } from 'react-router-dom';

export default class Shop extends Component {

    state = {
        shops: [],
        optionscb: {
            gender: '',
            department: '',
            designation: ''
        },
    }

    async fetchData() {
        let res = await get(`/shops`);
        this.setState({ shops: res.data });
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            console.log('COMPONENT UPDATING');
            this.fetchData()
        }
    }

    render() {
        let { shops = [] } = this.state;
        return (
            <div className="container mt-3 mb-5">
                <div className="row">
                    <div className="col-sm- text-center">
                        <h1 className='fw-bold'>ALL SHOPS</h1>
                        <div className="row bg-dark text-light">
                            <div className="col-sm-2 border">ShopID</div>
                            <div className="col-sm-3 border">ShopName</div>
                            <div className="col-sm-2 border">Rent</div>
                            <div className="col-sm-2 border"></div>
                            <div className="col-sm-3 border"></div>
                        </div>
                        {
                            shops.map(shop =>
                                <div className="row" key={shop.shopId}>
                                    <div className="col-sm-2 border">{shop.shopId}</div>
                                    <div className="col-sm-3 border">{shop.name}</div>
                                    <div className="col-sm-2 border">{shop.rent}</div>
                                    <div className="col-sm-2 border">
                                        <Link className="btn btn-success btn-sm m-0" to={`/purchases/shops/${shop.shopId}`}>Purchases</Link>
                                    </div>
                                    <div className="col-sm-3 border">
                                        <Link className="btn btn-danger btn-sm m-0" to={`/totalPurchase/shop/${shop.shopId}`}>Total Purchases</Link>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
