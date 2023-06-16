import React, { Component } from 'react'

export default class HomeScreen extends Component {

    render() {
        const IMG = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80';

        return (
            <div className="row">
                <img src={IMG} height="100%" alt="homescreen shopping image" />
            </div>
        )
    }
}
