import React, { Component } from "react";

class Sample extends Component {
  constructor() {
    super();

    this.state = {
      items: [],
      nextId: 1
    };
  }

  generateItem = () => {
    const newItem = {
      id: this.state.nextId,
      name: "NewItem" + this.state.nextId,
      isActive: true
    };

    this.setState({
      items: [...this.state.items, newItem],
      nextId: this.state.nextId + 1
    });
  };

  render() {
    return (
      <div>
        <h1>List Demo</h1>

        <button onClick={this.generateItem}>
          Generate
        </button>

        <ul>
          {this.state.items.map((item) => (
            <li key={item.id}>
              ID: {item.id} | Name: {item.name} | isActive:{" "}
              {item.isActive ? "True" : "False"}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Sample;