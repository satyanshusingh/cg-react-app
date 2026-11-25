import { Component } from "react";
import { Button, Card, Form, Spinner, Stack } from "react-bootstrap";

export default class EmployeeForm extends Component {
  render() {
    const { 
      form, 
      editing, 
      busy, 
      saving, 
      theme, 
      onChange, 
      onSubmit, 
      onCancel 
    } = this.props;

    const isDark = theme === "dark";
    const cardHeaderClass = isDark 
      ? "bg-dark text-warning border-bottom border-secondary" 
      : "bg-primary text-white";

    return (
      <Card className={`shadow-sm h-100 ${isDark ? "border-secondary" : ""}`}>
        <Card.Header className={cardHeaderClass}>
          <strong>{editing ? "Edit Employee" : "Add Employee"}</strong>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <fieldset disabled={busy}>
              
              <Form.Group className="mb-3" controlId="employee-name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Employee Name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="employee-email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter Employee Email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="employee-department">
                <Form.Label>Department</Form.Label>
                <Form.Select 
                  name="department"
                  value={form.department} 
                  onChange={onChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option>Engineering</option>
                  <option>Finance</option>
                  <option>Human Resources</option>
                  <option>IT</option>
                  <option>Sales</option>
                  <option>QA</option>
                  <option>Product Management</option>
                  <option>Operations</option>
                  <option>DevOps</option>
                </Form.Select>
              </Form.Group>

              <Stack direction="horizontal" gap={2}>
                <Button 
                  variant={isDark ? "warning" : "primary"} 
                  type="submit" 
                  disabled={busy}
                  className={isDark ? "text-dark fw-bold" : ""}
                >
                  {saving && (
                    <Spinner 
                      animation="border"
                      size="sm" 
                      className="me-2"
                    />
                  )}
                  {saving ? "Saving..." : editing ? "Update Employee" : "Add Employee"}
                </Button>
                
                {editing && (
                  <Button 
                    variant={isDark ? "outline-light" : "secondary"} 
                    type="button" 
                    disabled={busy}
                    onClick={onCancel}
                  >
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
}
