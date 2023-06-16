import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import Shops from './Shops';
import Products from './Products';
import Purchases from './Purchases';
import AddShop from './AddShop';
import AddProducts from './AddProducts';
import TotalShopPurchase from './TotalShopPurchase';
import TotalProductPurchase from './TotalProductPurchase';
import HomeScreen from './HomeScreen';

export default class MainComponent extends Component {

    render() {
        return (
            <>
                <div className="container-fluid">
                    <NavBar />
                    <Switch>

                        {/* ---------------------------------------------------------- VIEW SHOPS, PRODUCTS, PURCHASES */}


                        <Route path='/shops/view' component={Shops} />

                        <Route path='/products/view' component={Products} />

                        <Route path='/purchases/shops/:id' render={props => <Purchases {...props} display="shops" />} />

                        <Route path='/purchases/products/:id' render={props => <Purchases {...props} display="products" />} />

                        <Route path='/purchases' component={Purchases} />

                        <Route path='/totalPurchase/shop/:id' component={TotalShopPurchase} />

                        <Route path='/totalPurchase/product/:id' component={TotalProductPurchase} />



                        {/* ---------------------------------------------------------- ADD SHOPS, PRODUCTS */}


                        <Route path='/shops/add' component={AddShop} />

                        <Route path='/products/:id/edit' component={AddProducts} />

                        <Route path='/products/add' component={AddProducts} />

                        <Route path='/' component={HomeScreen} />

                        {/* <Redirect from="/" to='/shops' /> */}

                    </Switch>

                </div>
            </>

        )
    }
}

