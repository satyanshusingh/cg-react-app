import { Component } from 'react';

export default class ProductClassCard extends Component {
  constructor() {
    super();
    
    this.state = {
      id: 101,
      name: "Classic Leather Backpack",
      quantity: 5,
      price: 2499,
      category: "Accessories"
    };
  }

  render() {
    return (
      <div>
        {/* Category Header */}
        <p>[Category: {this.state.category}]</p>
        
        {/* Product Identity */}
        <h2>{this.state.name}</h2>
        <p>Product ID: {this.state.id}</p>
        
        {/* Inventory Details */}
        <p>Available Quantity: {this.state.quantity}</p>
        
        {/* Pricing Layout */}
        <p>Price: ₹{this.state.price}</p>
        
      </div>
    );
  }
}

