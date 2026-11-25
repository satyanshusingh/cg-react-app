import React from "react";
import { Button, Card, Form, InputGroup, Spinner, Stack } from "react-bootstrap";
import { useProducts } from "../../context/ProductContext";

export default function ProductForm({ theme, busy, onSubmit }) {
  const { state, dispatch } = useProducts();
  const { form, editingProduct, saving } = state;

  const isDark = theme === "dark";

  const handleChange = (e) => {
    dispatch({
      type: 'SET_FORM_FIELD',
      payload: { name: e.target.name, value: e.target.value }
    });
  };

  const handleQuantityChange = (delta) => {
    const currentQty = form.quantity === '' ? 0 : Number(form.quantity);
    const newQty = Math.max(0, currentQty + delta);
    dispatch({
      type: 'SET_FORM_FIELD',
      payload: { name: 'quantity', value: newQty }
    });
  };

  const handleCancel = () => {
    dispatch({ type: 'CANCEL_EDIT' });
  };

  return (
    <Card className={`shadow-sm h-100 ${isDark ? "border-secondary" : ""}`}>
      <Card.Header className={isDark ? "bg-dark text-warning border-bottom border-secondary" : "bg-primary text-white"}>
        <strong>{editingProduct ? "Edit Product" : "Create Product"}</strong>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={onSubmit}>
          <fieldset disabled={busy}>
            
            <Form.Group className="mb-3" controlId="product-name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter item name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="product-price">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="product-quantity">
              <Form.Label>Quantity in Stock</Form.Label>
              <InputGroup>
                <Button 
                  variant={isDark ? "outline-secondary" : "outline-secondary"} 
                  type="button"
                  disabled={busy || (form.quantity !== '' && Number(form.quantity) <= 0)}
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </Button>
                <Form.Control
                  type="number"
                  name="quantity"
                  min="0"
                  placeholder="0"
                  value={form.quantity}
                  onChange={handleChange}
                  className="text-center"
                  required
                />
                <Button 
                  variant={isDark ? "outline-secondary" : "outline-secondary"} 
                  type="button"
                  disabled={busy}
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </Button>
              </InputGroup>
            </Form.Group>

            <Stack direction="horizontal" gap={2}>
              <Button variant={isDark ? "warning" : "primary"} type="submit" disabled={busy} className={isDark ? "text-dark fw-bold" : ""}>
                {saving && <Spinner animation="border" size="sm" className="me-2" />}
                {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
              </Button>
              {editingProduct && (
                <Button variant={isDark ? "outline-light" : "secondary"} type="button" disabled={busy} onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </Stack>

          </fieldset>
        </Form>
      </Card.Body>
    </Card>
  );
}