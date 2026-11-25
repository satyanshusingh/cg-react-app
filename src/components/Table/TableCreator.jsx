import { Component } from 'react';
import './TableCreator.css';

class TableCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchData(this.props.data);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.fetchData(this.props.data);
    }
  }

  fetchData = (endpoint) => {
    if (!endpoint) return;
    this.setState({ loading: true, error: null });

    fetch(`https://jsonplaceholder.typicode.com/${endpoint}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data for "${endpoint}"`);
        }
        return response.json();
      })
      .then((result) => {
        this.setState({
          items: Array.isArray(result) ? result : [result],
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({
          error: err.message,
          loading: false,
        });
      });
  };

  render() {
    const { items, loading, error } = this.state;
    const { data } = this.props;

    if (loading) {
      return (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading {data}...</p>
        </div>
      );
    }

    if (error) {
      return <div className="error-message">⚠️ Error: {error}</div>;
    }

    if (items.length === 0) {
      return <div className="no-data">No data available for "{data}".</div>;
    }

    const headers = Object.keys(items[0]);

    return (
      <div className="table-responsive-container">
        <table className="custom-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index}>
                {headers.map((header) => {
                  const value = item[header];
                  const displayValue =
                    typeof value === 'object' && value !== null
                      ? JSON.stringify(value)
                      : String(value ?? '');

                  return (
                    <td key={header} title={displayValue}>
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TableCreator;