import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
 
function UsersAccordion() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(r => r.json())
      .then(setUsers);
  }, []);
 
  return (
    <Accordion>
      {users.map((u, i) => (
        <Accordion.Item eventKey={i.toString()} key={u.id}>
          <Accordion.Header>{u.name}</Accordion.Header>
          <Accordion.Body>
            <Table bordered>
              <tbody>
                {Object.entries({
                  ID: u.id,
                  Username: u.username,
                  Email: u.email,
                  Phone: u.phone
                }).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
 
export default UsersAccordion;