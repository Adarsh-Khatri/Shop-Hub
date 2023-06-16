import React, { Component } from 'react';
import { get } from './HttpService';
import queryString from 'query-string'
import { Link } from 'react-router-dom';

export default class Products extends Component {

    state = {
        products: [],
        optionscb: {
            gender: '',
            department: '',
            designation: ''
        }
    }

    async fetchData() {
        let res = await get(`/products`)
        this.setState({ products: res.data });
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.fetchData()
        }
    }


    render() {
        let { products = [] } = this.state;
        return (
            <div className="container mt-3 mb-5">
                <div className="row">
                    <div className="col-sm text-center">
                        <h1 className='fw-bold text-muted'>ALL PRODUCTS</h1>
                        <div className="row bg-dark text-light">
                            <div className="col-sm-1 border">ProductID</div>
                            <div className="col-sm-2 border">Product</div>
                            <div className="col-sm-2 border">Category</div>
                            <div className="col-sm-2 border">Description</div>
                            <div className="col-sm-1 border"></div>
                            <div className="col-sm-2 border"></div>
                            <div className="col-sm-2 border"></div>
                        </div>
                        {
                            products.map(product =>
                                <div className="row" key={product.productId}>
                                    <div className="col-sm-1 border">{product.productId}</div>
                                    <div className="col-sm-2 border">{product.productName}</div>
                                    <div className="col-sm-2 border">{product.category}</div>
                                    <div className="col-sm-2 border">{product.description}</div>
                                    <div className="col-sm-1 border">
                                        <Link className="btn btn-warning btn-sm m-0" to={`/products/${product.productId}/edit`}>Edit</Link>
                                    </div>
                                    <div className="col-sm-2 border">
                                        <Link className="btn btn-success btn-sm m-0" to={`/purchases/products/${product.productId}`}>Purchases</Link>
                                    </div>
                                    <div className="col-sm-2 border">
                                        <Link className="btn btn-danger btn-sm m-0" to={`/totalPurchase/product/${product.productId}`}>Total Purchases</Link>
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








// render() {
//     let { products = [] } = this.state;
//     return (
//         <div className="container mt-3 mb-5">
//             <div className="row">
//                 <div className="col-sm-3"></div>
//                 <div className="col-sm-6 text-center">
//                     <h1 className='fw-bold'>ALL PRODUCTS</h1>
//                     <div className="row bg-dark text-light">
//                         <div className="col-sm-2 border">ProductID</div>
//                         <div className="col-sm-2 border">Product</div>
//                         <div className="col-sm-2 border">Category</div>
//                         <div className="col-sm-3 border">Description</div>
//                         <div className="col-sm-3 border"></div>
//                     </div>
//                     {
//                         products.map(product =>
//                             <div className="row" key={product.productId}>
//                                 <div className="col-sm-2 border">{product.productId}</div>
//                                 <div className="col-sm-2 border">{product.productName}</div>
//                                 <div className="col-sm-2 border">{product.category}</div>
//                                 <div className="col-sm-3 border">{product.description}</div>
//                                 <div className="col-sm-3 border">
//                                     <div className='row'>
//                                         <div className="col-sm-1 border text-center p-0"><Link className="btn btn-warning btn-sm m-0" to={`/products/${product.productId}/edit`}>Edit</Link></div>
//                                         <div className="col-sm-1 border text-center p-0"><Link className="btn btn-warning btn-sm m-0" to={`/products/${product.productId}/edit`}>Purchases</Link></div>
//                                         <div className="col-sm-1 border text-center p-0"><Link className="btn btn-warning btn-sm m-0" to={`/products/${product.productId}/edit`}>Total Purchases</Link></div>
//                                     </div>
//                                 </div>

//                             </div>
//                         )
//                     }
//                 </div>
//                 <div className="col-sm-3"></div>
//             </div>
//         </div>
//     )
// }







// return (
//     <div className="container mt-3 mb-5">
//         <div className="row">
//             {/* <div className="col-sm-3"></div> */}
//             <div className="col-sm text-center">
//                 <h1 className='fw-bold'>ALL PRODUCTS</h1>
//                 <div className="table-responsive-sm">
//                     <table className='table table-bordered table-striped'>
//                         <thead>
//                             <tr>
//                                 <th scope="col">ProductID</th>
//                                 <th id='p-name' scope="col">Product</th>
//                                 <th id='p-category' scope="col">Category</th>
//                                 <th id='p-desc' scope="col">Description</th>
//                                 <th scope="col"></th>
//                                 <th scope="col"></th>
//                                 <th id='p-total' scope="col"></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {
//                                 products.map(product =>
//                                     <tr key={product.productId}>
//                                         <th scope="row">{product.productId}</th>
//                                         <td >{product.productName}</td>
//                                         <td>{product.category}</td>
//                                         <td>{product.description}</td>
//                                         <td>
//                                             <Link className="btn btn-warning btn-sm m-0" to={`/products/${product.productId}/edit`}>Edit</Link>
//                                         </td>
//                                         <td>
//                                             <Link className="btn btn-warning btn-sm m-0" to={`/products/${product.productId}/edit`}>Purchases</Link>
//                                         </td>
//                                         <td>
//                                             <Link className="btn btn-warning btn-sm m-0" to={`/products/${product.productId}/edit`}>Total Purchases</Link>
//                                         </td>
//                                     </tr>
//                                 )
//                             }

//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//             {/* <div className="col-sm-3"></div> */}
//         </div>
//     </div >
// )
// 