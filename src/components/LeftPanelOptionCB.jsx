import React, { Component } from 'react'

export default class LeftPanelOptionsCB extends Component {

    handleChange = (e) => {
        let { currentTarget: input } = e;
        let options = { ...this.props.options };
        if (input.type === 'checkbox') {
            options[input.name] = this.updateCBs(options[input.name], input.checked, input.value);
        } else {
            options[input.name] = input.value;
        }
        this.props.onOptionChange(options);
    }

    updateCBs = (inpValue, checked, value) => {
        let inpArr = inpValue ? inpValue.split(',') : [];
        if (checked) inpArr.push(value);
        else {
            let index = inpArr.findIndex(ele => ele === value);
            if (index >= 0) inpArr.splice(index, 1);
        }
        return inpArr.join(',');
    }

    makeCheckboxes = (arr, values, name, label) => (
        <div className='form-check'>
            <label className='form-check-label w-100 lead fw-bold text-center'>{label}</label>
            {arr.map((opt, index) => (
                <div className="form-check" key={index}>
                    <input type="checkbox" id={`${name}${index}`} className='form-check-input' value={opt} name={name} checked={values.find(val => val === opt)} onChange={this.handleChange} />
                    <label className='form-check-label' htmlFor={`${name}${index}`}>{opt}</label>
                </div>
            ))}
        </div>
    );


    makeDropdown = (arr, values, name, label) => (
        <div className="form-group bg-light text-center">
            <label htmlFor="orderBy" className='form-label lead fw-bold' style={{ height: "50px", lineHeight: "50px" }}>{label}</label>
            <select className='form-select' id='orderBy' name={name} value={values} onChange={this.handleChange}>
                <option value="" disabled>{label}</option>
                {arr.map(opt =>
                    <option value={opt}>{opt}</option>
                )}
            </select>
        </div>
    )

    render() {
        let { shop = '', product = '', sort = '' } = this.props.options;
        let { products: productArr, shops: shopArr, sort: sortArr } = this.props;
        return (
            <div className="row border border-dark bg-light rounded my-2 me-2 py-4">
                <div className="col-sm-12">
                    {this.makeCheckboxes(productArr.map(prod => prod.productName), product.split(','), 'product', 'Choose Product')}
                </div>
                <div>
                    {this.makeDropdown(shopArr.map(shop => shop.name), shop, 'shop', 'Choose Shop')}
                </div>
                <div>
                    {this.makeDropdown(sortArr, sort, 'sort', 'Sort By')}
                </div>
            </div>
        )
    }
}



