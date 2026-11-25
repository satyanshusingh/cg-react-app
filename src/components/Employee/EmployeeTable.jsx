import { useState, useMemo } from "react";
import { Badge, Button, Card, Form, Spinner, Stack, Table } from "react-bootstrap";

export default function EmployeeTable({
  employees,
  loading,
  busy,
  onEdit,
  onDelete
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;

    const query = searchTerm.toLowerCase().trim();
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query)
    );
  }, [employees, searchTerm]);

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span>Employee List</span>
        <div style={{ width: "250px" }}>
          <Form.Control
            type="text"
            size="sm"
            placeholder="Search by name, email, dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">Loading Employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <p className="text-muted mb-0">No Employees Found</p>
        ) : filteredEmployees.length === 0 ? (
          <p className="text-muted mb-0">No matching employees found for "{searchTerm}"</p>
        ) : (
          <Table striped bordered hover responsive className="align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Department</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <Badge bg="info" text="dark">
                      {employee.department}
                    </Badge>
                  </td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        type="button"
                        disabled={busy}
                        onClick={() => onEdit(employee)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        type="button"
                        disabled={busy}
                        onClick={() => onDelete(employee)}
                      >
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