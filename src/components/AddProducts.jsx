import React, { Component } from 'react';
import { get, put, post } from './HttpService'

export default class Addproducts extends Component {

    state = {
        product: { productId: '', productName: '', category: '', description: '' },
        edit: false,
    }

    async fetchData() {
        const { id } = this.props.match.params;
        if (id) {
            let { data } = await get(`/products/${id}/edit`)
            this.setState({ product: data, edit: true })
        } else {
            let product = { productId: '', productName: '', category: '', description: '' };
            this.setState({ product: product, edit: false })
        }
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
        let updatedProduct = { ...this.state.product };
        updatedProduct[input.name] = input.value;
        console.log(updatedProduct);
        this.setState({ product: updatedProduct });
    }

    async postData(url, obj) {
        let res = await post(url, obj);
        console.log(url, obj);
        this.props.history.push('/products/view')
    }

    async putData(url, obj) {
        let res = await put(url, obj);
        this.props.history.push('/products/view')
    }

    handleSubmit = (e) => {
        let { product, edit } = this.state;
        e.preventDefault();
        console.log(edit);
        edit ? this.putData(`/products/${product.productId}`, product) : this.postData(`/products`, this.state.product)
    }

    render() {
        let { productId, productName, category, description } = this.state.product;
        let { edit } = this.state;
        return (
            <div className='container my-5'>
                {
                    !edit ? '' : (
                        <div className="form-group">
                            <label htmlFor='productId' className='fw-bold lead'>Product ID</label>
                            <input type="text" className='form-control mb-3' id='productId' name="productId" placeholder='Enter Product ID' value={productId} disabled={edit} onChange={(e) => this.handleChange(e)} />
                        </div>
                    )
                }
                <div className="form-group">
                    <label htmlFor='productName' className='fw-bold lead'>Product Name</label>
                    <input type="text" className='form-control mb-3' id='productName' name="productName" placeholder='Enter Product Name' value={productName} disabled={edit} onChange={(e) => this.handleChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor='category' className='fw-bold lead'>Category</label>
                    <input type="text" className='form-control mb-3' id='category' name="category" placeholder='Enter Product Category' value={category} onChange={(e) => this.handleChange(e)} />
                </div>
                <div className="form-group">
                    <label htmlFor='description' className='fw-bold lead'>Description</label>
                    <input type="text" className='form-control mb-3' id='description' name="description" placeholder='Enter Product Description' value={description} onChange={(e) => this.handleChange(e)} />
                </div>
                <button type='button' className='btn btn-primary my-3' onClick={(e) => this.handleSubmit(e)}>Submit</button>
            </div>
        )
    }
}
