import React, { useState } from 'react';
import { Container, Form, Button, Table, Card, Alert } from 'react-bootstrap';


function StudentForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [students, setStudents] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !age) return;

    const newStudent = {
      id: Date.now(),
      name: name.trim(),
      age: age,
    };

    setStudents([...students, newStudent]);
    setName('');
    setAge('');
    setShowAlert(true);

    // Hide alert after 3 seconds
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDelete = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <Container className="my-5" style={{ maxWidth: '650px' }}>
      <Card className="shadow-sm p-4">
        <h2 className="mb-4 text-center">Student Information</h2>

        {showAlert && (
          <Alert variant="success" className="py-2">
            Student added successfully!
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-3" controlId="formStudentName">
            <Form.Label>Student Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStudentAge">
            <Form.Label>Student Age</Form.Label>
            <Form.Control
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter student age"
              min="1"
              max="120"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Add Student
          </Button>
        </Form>

        <h3 className="mb-3">Student Records</h3>
        {students.length === 0 ? (
          <p className="text-muted">No student records added yet.</p>
        ) : (
          <Table striped bordered hover responsive align="middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td className="text-center">
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
}

export default StudentForm;