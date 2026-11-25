import React, { useState, useMemo } from "react";
import { Badge, Button, Card, Form, Spinner, Stack, Table } from "react-bootstrap";
import { useProducts } from "../../context/ProductContext";

export default function ProductTable({ theme, busy, onEdit, onDelete }) {
  const { state } = useProducts();
  const { products, loading } = state;
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return products;
    return products.filter(p => p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term));
  }, [products, query]);

  const isDark = theme === "dark";

  return (
    <Card className={`shadow-sm ${isDark ? "border-secondary" : ""}`}>
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span>Inventory Directory</span>
        <div style={{ width: "250px" }}>
          <Form.Control
            type="text"
            size="sm"
            placeholder="Search by ID or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">Loading Store Items...</p>
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted mb-0">No Products Registered</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted mb-0">No matches found for "{query}"</p>
        ) : (
          <Table striped bordered hover responsive className="align-middle mb-0">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Stock Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id}>
                  <td><code>{product.id}</code></td>
                  <td>{product.name}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>
                    <Badge bg={product.quantity > 10 ? "success" : product.quantity > 0 ? "warning" : "danger"}>
                      {product.quantity} units
                    </Badge>
                  </td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      <Button variant="outline-primary" size="sm" disabled={busy} onClick={() => onEdit(product)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" disabled={busy} onClick={() => onDelete(product)}>
                        Delete
                      </Button>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}