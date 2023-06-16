import React, { Component } from 'react';
import { get } from './HttpService';

export default class TotalShopPurchase extends Component {

    state = {
        totalPurchase: [],
    }

    async fetchData() {
        let { id } = this.props.match.params;
        let res = await get(`/totalPurchase/shop/${id}`)
        this.setState({ totalPurchase: res.data });
    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        let { totalPurchase = [] } = this.state;
        let { id } = this.props.match.params;
        return (
            <div className="container my-5">
                <div className="row">
                    <h1 className='text-center lead fs-1'>TOTAL PURCHASES FOR SHOP : {id}</h1>
                    {
                        totalPurchase.length === 0
                            ? (<h3 className='text-center text-danger my-5'>NO DATA AVAILABLE</h3>)
                            : (
                                totalPurchase.map(total =>
                                    <div className="row my-2">
                                        <h3 className='fw-bold' style={{ color: "rgb(222 150 0)" }}>
                                            ProductID : {total.productid}
                                        </h3>
                                        <h3 className='fw-bold'>
                                            Total Purchase : <span className='text-success'>{total.totalShopPurchase}</span>
                                        </h3>
                                    </div>
                                )
                            )
                    }
                </div>
            </div >
        )
    }
}
