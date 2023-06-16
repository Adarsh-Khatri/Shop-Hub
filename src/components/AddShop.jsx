import React, { Component } from 'react';
import { get, put, post } from './HttpService'

export default class AddEmployee extends Component {

    state = {
        shop: { name: '', rent: '' }
    }

    async fetchData() {
        let shop = { name: '', rent: '' };
        this.setState({ shop: shop, edit: false })
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.fetchData()
        }
    }

    handleChange = ({ currentTarget: input }) => {
        let updatedShop = { ...this.state.shop };
        updatedShop[input.name] = input.value;
        this.setState({ shop: updatedShop });
    }

    async postData(url, obj) {
        let res = await post(url, obj);
        this.props.history.push('/shops/view')
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.postData('/shops', this.state.shop)
    }

    render() {
        let { name, rent } = this.state.shop;
        return (
            <div className='container my-5'>
                <div className="form-group">
                    <label htmlFor='name' className='fw-bold lead'>Shop Name</label>
                    <input type="text" className='form-control mb-3' id='name' name="name" placeholder='Enter Shop Name' value={name} onChange={(e) => this.handleChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor='rent' className='fw-bold lead'>Shop Rent</label>
                    <input type="number" className='form-control mb-3' id='rent' name="rent" placeholder='Enter Shop Rent' value={rent} onChange={(e) => this.handleChange(e)} />
                </div>
                <button type='button' className='btn btn-primary my-3' onClick={(e) => this.handleSubmit(e)}>Submit</button>
            </div>
        )
    }
}



