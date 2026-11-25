import React, { Component } from "react";

class ProductCard extends Component {
  constructor() {
    super();

    this.products = [
      { id: "P101", name: "Laptop", price: 50000, quantity: 2 },
      { id: "P102", name: "Mobile", price: 20000, quantity: 3 },
      { id: "P103", name: "Headphone", price: 3000, quantity: 5 },
      { id: "P104", name: "Keyboard", price: 1500, quantity: 0 }
    ];
  }

  render() {
    const { products } = this;

    return (
      <div>
        <h1>Product List</h1>

        <table border="1">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>TotalPrice</th>
              <th>StockAvailability</th>
            </tr>
          </thead>

          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.price * product.quantity}</td>
                <td>
                  {product.quantity > 0
                    ? "In Stock"
                    : "Out Of Stock"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ProductCard;