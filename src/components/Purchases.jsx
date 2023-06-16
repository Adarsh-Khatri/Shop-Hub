import React, { Component } from 'react';
import LeftPanelOptionCB from './LeftPanelOptionCB';
import { get } from './HttpService';
import queryString from 'query-string'

export default class Purchases extends Component {

    state = {
        purchases: [],
        products: [],
        shops: [],
        sort: ['QtyAsc', 'QtyDesc', 'ValueAsc', 'ValueDesc'],
        optionscb: {
            product: '',
            shop: '',
            sort: ''
        },

    }

    async fetchData() {
        let { id } = this.props.match.params;
        let { display } = this.props;
        let queryParams = this.props.location.search;
        let res1, res2, res3;
        if (id && display === 'shops') {
            res1 = await get(`/purchases/shops/${id}`)
        } else if (id && display === 'products') {
            res1 = await get(`/purchases/products/${id}`)
        } else if (queryParams) {
            res1 = await get(`/purchases${queryParams}`)
        } else {
            res1 = await get(`/purchases`)
            res2 = await get(`/products`)
            res3 = await get(`/shops`)
            this.setState({
                purchases: res1.data, products: res2.data, shops: res3.data, optionscb: { product: '', shop: '', sort: '' }
            });
        }
        this.setState({ purchases: res1.data });
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.fetchData()
        }
    }

    callURL = (url, options) => {
        let searchStr = this.makeSearchString(options);
        this.props.history.push({ pathname: url, search: searchStr })
    }

    makeSearchString = (options) => {
        let { shop, product, sort } = options;
        let searchStr = '';
        searchStr = this.addToQueryString(searchStr, 'shop', this.moddedShopQuery(shop));
        searchStr = this.addToQueryString(searchStr, 'product', this.moddedProductQuery(product));
        searchStr = this.addToQueryString(searchStr, 'sort', sort);
        return searchStr;
    };

    moddedShopQuery = (shop) => {
        let { shops } = this.state;
        if (shop) {
            let id = shops.find(sh => sh.name === shop).shopId;
            return ('st' + id);
        }
    }

    moddedProductQuery = (product) => {
        let { products } = this.state;
        if (product) {
            let productArr = product.split(',');
            let filteredProduct = products.filter(pr => productArr.find(arr => arr === pr.productName));
            let modifiedProduct = filteredProduct.map(p1 => 'pr' + p1.productId)
            console.log(modifiedProduct);
            return (modifiedProduct);
        }
    }

    addToQueryString = (str, paramName, paramValue) => {
        return ((paramValue ? str ? `${str}&${paramName}=${paramValue}` :
            `${paramName}=${paramValue}` : str))
    }

    handleOptionChange = (options) => {
        console.log(options);
        this.setState({ optionscb: options })
        this.callURL(`/purchases`, options)
    }

    render() {
        let { purchases = [], products, shops, sort, optionscb } = this.state;
        let { id } = this.props.match.params;
        let { display } = this.props;
        return (
            <div className="container-fluid my-3">
                <div className="row">
                    {
                        (id && display) ? ('') : (
                            <div className="col-sm-3 my-5">
                                <LeftPanelOptionCB products={products} shops={shops} sort={sort} options={optionscb} onOptionChange={this.handleOptionChange} />
                            </div>
                        )
                    }
                    <div className={`${(id && display) ? 'col-sm-12' : 'col-sm-9'} text-center `}>
                        <h1 className='fw-bold text-info'>ALL PURCHASES {display && ((display == "shops") ? `FOR SHOPID : ${id}` : `FOR PRODUCTID : ${id}`)}</h1>
                        {
                            purchases.length === 0
                                ? <h3 className='fw-bold text-danger text-center my-5'>NO DATA!!!</h3>
                                : (
                                    <>
                                        <div className="row bg-dark text-light">
                                            <div className="col-sm-3 border">PurchaseID</div>
                                            <div className="col-sm-2 border">ShopID</div>
                                            <div className="col-sm-2 border">ProductID</div>
                                            <div className="col-sm-2 border">Quantity</div>
                                            <div className="col-sm-3 border">Price</div>
                                        </div>
                                        {
                                            purchases.map(purchase =>
                                                <div className="row " key={purchase.purchaseId}>
                                                    <div className="col-sm-3 border">{purchase.purchaseId}</div>
                                                    <div className="col-sm-2 border">{purchase.shopId}</div>
                                                    <div className="col-sm-2 border">{purchase.productid}</div>
                                                    <div className="col-sm-2 border">{purchase.quantity}</div>
                                                    <div className="col-sm-3 border">{purchase.price}</div>
                                                </div>
                                            )
                                        }
                                    </>
                                )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
