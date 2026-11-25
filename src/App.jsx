// import { Component } from 'react';
// // import PhotoGallery from './PhotoGallery';
// import StudentForm from './func_comp/StudentForm';
// import UsersAccordion from './components/UsersAccordion';
// import RefHook from './func_comp/RefHook';
// import TableCreator from './components/Table/TableCreator';
// // import TableCreator from './components/TableCreator';

// export default class App extends Component {

//   render(){
//     return(
//       // <PhotoGallery/>
//       // <StudentForm/>
//       // <UsersAccordion/>
//       // <RefHook/>
//       <TableCreator/>
//     )
//   }
// }
//   constructor(props) {
//     super(props);
//     this.state = {
//       textInputValue: 'users',
//       selectedRoute: 'users'
//     };
//   }

//   handleInputChange(event) {
//     this.setState({ textInputValue: event.target.value });
//   }

//   triggerDataFetch() {
//     this.setState({ selectedRoute: this.state.textInputValue.trim().toLowerCase() });
//   }

//   render() {
//     return (
//       <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
//         <h1>Dashboard Viewer</h1>
        
//         <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
//           <label htmlFor="endpoint-input" style={{ fontWeight: 'bold' }}>Enter Endpoint:</label>
//           <input 
//             id="endpoint-input"
//             type="text" 
//             value={this.state.textInputValue}
//             onChange={(e) => this.handleInputChange(e)}
//             placeholder="e.g., users, posts, todos"
//             style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
//           />
//           <button 
//             onClick={() => this.triggerDataFetch()}
//             style={{ padding: '8px 16px', backgroundColor: '#0070d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
//           >
//             Fetch Data
//           </button>
//         </div>

//         <TableCreator data={this.state.selectedRoute} />
//       </div>
//     );
//   }
// }

// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { Button, Col, Container, Row, Stack, ButtonGroup } from "react-bootstrap";
// import { employeeService } from "./services/employeeService";
// import EmployeeForm from "./components/Employee/EmployeeForm";
// import EmployeeTable from "./components/Employee/EmployeeTable";
// import { ThemeProvider, useTheme } from "./context/ThemeContext";

// const emptyForm = () => ({
//   name: '',
//   email: '',
//   department: ''
// });

// function EmployeeAppContent() {
//   const [employees, setEmployees] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const { theme, toggleTheme } = useTheme();
//   const controllerRef = useRef(null);

//   const beginRequest = useCallback(() => {
//     if (controllerRef.current && !controllerRef.current.signal.aborted) {
//       return null;
//     }
//     const controller = new AbortController();
//     controllerRef.current = controller;
//     return controller;
//   }, []);

//   const finishRequest = useCallback((controller) => {
//     if (controllerRef.current === controller) {
//       controllerRef.current = null;
//     }
//   }, []);

//   const loadEmployees = useCallback(async () => {
//     const controller = beginRequest();
//     if (!controller) return;

//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       const data = await employeeService.getAll(controller.signal);
//       if (!Array.isArray(data)) {
//         throw new Error("The API must return an ARRAY of employees");
//       }
//       if (!controller.signal.aborted) {
//         setEmployees(data);
//       }
//     } catch (err) {
//       if (!controller.signal.aborted) {
//         setError(err.message);
//       }
//     } finally {
//       if (!controller.signal.aborted) {
//         setLoading(false);
//       }
//       finishRequest(controller);
//     }
//   }, [beginRequest, finishRequest]);

//   useEffect(() => {
//     loadEmployees();
//   }, [loadEmployees]);

//   const handleChange = useCallback((event) => {
//     const { name, value } = event.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError('');
//     setMessage('');
//   }, []);

//   const handleSubmit = useCallback(async (event) => {
//     event.preventDefault();
//     const payload = {
//       name: form.name.trim(),
//       email: form.email.trim(),
//       department: form.department.trim()
//     };

//     if (!payload.name || !payload.email || !payload.department) {
//       setError('Please Complete all fields');
//       setMessage('');
//       return;
//     }

//     const controller = beginRequest();
//     if (!controller) return;

//     setSaving(true);
//     setError('');
//     setMessage('');

//     try {
//       let savedEmployee;
//       if (editingId === null) {
//         savedEmployee = await employeeService.create(payload, controller.signal);
//       } else {
//         savedEmployee = await employeeService.update(editingId, payload, controller.signal);
//       }

//       if (!controller.signal.aborted) {
//         setEmployees(prev =>
//           editingId === null
//             ? [...prev, savedEmployee]
//             : prev.map(emp => (emp.id === editingId ? savedEmployee : emp))
//         );
//         setForm(emptyForm());
//         setEditingId(null);
//         setMessage(editingId === null ? 'Employee Added Successfully' : 'Employee updated Successfully');
//       }
//     } catch (err) {
//       if (!controller.signal.aborted) {
//         setError(err.message);
//       }
//     } finally {
//       if (!controller.signal.aborted) {
//         setSaving(false);
//       }
//       finishRequest(controller);
//     }
//   }, [form, editingId, beginRequest, finishRequest]);

//   const handleCancel = useCallback(() => {
//     setEditingId(null);
//     setForm(emptyForm());
//     setError('');
//     setMessage('');
//   }, []);

//   const handleEdit = useCallback((employee) => {
//     setEditingId(employee.id);
//     setForm({
//       name: employee.name,
//       email: employee.email,
//       department: employee.department
//     });
//     setError('');
//     setMessage('');
//   }, []);

//   const handleDelete = useCallback(async (employee) => {
//     const confirmed = window.confirm(`Are you sure you want to delete ${employee.name} ?`);
//     if (!confirmed) return;

//     const controller = beginRequest();
//     if (!controller) return;

//     setDeleting(true);
//     setError('');
//     setMessage('');

//     try {
//       await employeeService.remove(employee.id, controller.signal);
//       if (!controller.signal.aborted) {
//         setEmployees(prev => prev.filter(item => item.id !== employee.id));
//         setEditingId(prevId => {
//           if (prevId === employee.id) {
//             setForm(emptyForm());
//             return null;
//           }
//           return prevId;
//         });
//         setMessage('Employee Deleted Successfully');
//       }
//     } catch (err) {
//       if (!controller.signal.aborted) {
//         setError(err.message);
//       }
//     } finally {
//       if (!controller.signal.aborted) {
//         setDeleting(false);
//       }
//       finishRequest(controller);
//     }
//   }, [beginRequest, finishRequest]);

//   const busy = useMemo(() => loading || saving || deleting, [loading, saving, deleting]);

//   return (
//     <Container as="main" className="py-4">
//       <Row className="align-items-center mb-4 g-3">
//         <Col xs={12} md>
//           <h1 className="h3 mb-0">Employee Management</h1>
//           {error && <div className="text-danger mt-2">{error}</div>}
//           {message && <div className="text-success mt-2">{message}</div>}
//         </Col>
//         <Col xs={12} md="auto">
//           <Stack direction="horizontal" gap={3}>
            
//             <ButtonGroup>
//               <Button
//                 variant={theme === "light" ? "warning" : "outline-secondary"}
//                 onClick={() => theme !== "light" && toggleTheme()}
//                 active={theme === "light"}
//               >
//                 ☀️
//               </Button>
//               <Button
//                 variant={theme === "dark" ? "primary" : "outline-secondary"}
//                 onClick={() => theme !== "dark" && toggleTheme()}
//                 active={theme === "dark"}
//               >
//                 🌙
//               </Button>
//             </ButtonGroup>

//             <Button
//               type="button"
//               variant="outline-primary"
//               disabled={busy}
//               onClick={loadEmployees}
//             >
//               Reload Employees
//             </Button>
//           </Stack>
//         </Col>
//       </Row>
//       <Row className="g-4">
//         <Col xs={12} lg={4}>
//           <EmployeeForm
//             form={form}
//             editing={editingId !== null}
//             busy={busy}
//             saving={saving}
//             theme={theme} 
//             onChange={handleChange}
//             onSubmit={handleSubmit}
//             onCancel={handleCancel}
//           />
//         </Col>
//         <Col xs={12} lg={8}>
//           <EmployeeTable
//             employees={employees}
//             loading={loading}
//             busy={busy}
//             theme={theme}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default function App() {
//   return (
//     <ThemeProvider>
//       <EmployeeAppContent />
//     </ThemeProvider>
//   );
// }


// import React, { useEffect, useRef, useCallback, useMemo } from "react";
// import { Button, Col, Container, Row, Stack, ButtonGroup, Badge } from "react-bootstrap";
// import { productService } from "./services/productService";
// import ProductForm from "./components/stores/ProductForm";
// import ProductTable from "./components/stores/ProductTable";
// import { ThemeProvider, useTheme } from "./context/ThemeContext";
// import { ProductProvider, useProducts } from "./context/ProductContext";

// function StoreDashboardContent() {
//   const { theme, toggleTheme } = useTheme();
//   const { state, dispatch } = useProducts();
//   const { form, editingProduct, loading, saving, deleting, products } = state;
  
//   const controllerRef = useRef(null);

//   const beginRequest = useCallback(() => {
//     if (controllerRef.current && !controllerRef.current.signal.aborted) return null;
//     const controller = new AbortController();
//     controllerRef.current = controller;
//     return controller;
//   }, []);

//   const finishRequest = useCallback((controller) => {
//     if (controllerRef.current === controller) controllerRef.current = null;
//   }, []);

//   const fetchInventory = useCallback(async () => {
//     const controller = beginRequest();
//     if (!controller) return;
//     dispatch({ type: 'START_FETCH' });
//     try {
//       const data = await productService.getAllWithStock(controller.signal);
//       if (!controller.signal.aborted) dispatch({ type: 'FETCH_SUCCESS', payload: data });
//     } catch (err) {
//       if (!controller.signal.aborted) dispatch({ type: 'FETCH_FAILURE', payload: err.message });
//     } finally {
//       finishRequest(controller);
//     }
//   }, [beginRequest, finishRequest, dispatch]);

//   useEffect(() => {
//     fetchInventory();
//   }, [fetchInventory]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name.trim() || !form.price || form.quantity === '') {
//       dispatch({ type: 'SET_ERROR', payload: 'Please fill all inputs correctly' });
//       return;
//     }

//     const controller = beginRequest();
//     if (!controller) return;
//     dispatch({ type: 'START_SAVE' });

//     try {
//       if (!editingProduct) {
//         const payload = await productService.create(form, controller.signal);
//         if (!controller.signal.aborted) dispatch({ type: 'CREATE_SUCCESS', payload });
//       } else {
//         const payload = await productService.update(editingProduct.id, editingProduct.stockId, form, controller.signal);
//         if (!controller.signal.aborted) dispatch({ type: 'UPDATE_SUCCESS', payload });
//       }
//     } catch (err) {
//       if (!controller.signal.aborted) dispatch({ type: 'SAVE_FAILURE', payload: err.message });
//     } finally {
//       finishRequest(controller);
//     }
//   };

//   const handleEditSelect = useCallback((item) => {
//     dispatch({ type: 'SET_EDIT_MODE', payload: item });
//   }, [dispatch]);

//   const handleDeleteSelect = useCallback(async (item) => {
//     if (!window.confirm(`Remove ${item.name} from global records?`)) return;
//     const controller = beginRequest();
//     if (!controller) return;
//     dispatch({ type: 'START_DELETE' });

//     try {
//       await productService.remove(item.id, item.stockId, controller.signal);
//       if (!controller.signal.aborted) dispatch({ type: 'DELETE_SUCCESS', payload: item.id });
//     } catch (err) {
//       if (!controller.signal.aborted) dispatch({ type: 'DELETE_FAILURE', payload: err.message });
//     } finally {
//       finishRequest(controller);
//     }
//   }, [beginRequest, finishRequest, dispatch]);

//   const appBusy = useMemo(() => loading || saving || deleting, [loading, saving, deleting]);

//   return (
//     <Container as="main" className="py-4">
//       <Row className="align-items-center mb-4 g-3">
//         <Col xs={12} md>
//           <div className="d-flex align-items-center gap-3 flex-wrap">
//             <h1 className="h3 mb-0">Product Store</h1>
//             <Badge bg="secondary" className="fs-6 px-3 py-2">
//               Total Products: {products.length}
//             </Badge>
//           </div>
//           {state.error && <div className="text-danger mt-2 small">⚠️ {state.error}</div>}
//           {state.message && <div className="text-success mt-2 small">✓ {state.message}</div>}
//         </Col>
//         <Col xs={12} md="auto">
//           <Stack direction="horizontal" gap={3}>
//             <ButtonGroup>
//               <Button variant={theme === "light" ? "warning" : "outline-secondary"} onClick={() => theme !== "light" && toggleTheme()}>
//                 ☀️
//               </Button>
//               <Button variant={theme === "dark" ? "primary" : "outline-secondary"} onClick={() => theme !== "dark" && toggleTheme()}>
//                 🌙
//               </Button>
//             </ButtonGroup>
//             <Button variant="outline-primary" disabled={appBusy} onClick={fetchInventory}>
//               Reload Store
//             </Button>
//           </Stack>
//         </Col>
//       </Row>
//       <Row className="g-4">
//         <Col xs={12} lg={4}>
//           <ProductForm theme={theme} busy={appBusy} onSubmit={handleSubmit} />
//         </Col>
//         <Col xs={12} lg={8}>
//           <ProductTable 
//             theme={theme} 
//             busy={appBusy} 
//             onEdit={handleEditSelect} 
//             onDelete={handleDeleteSelect} 
//           />
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default function App() {
//   return (
//     <ThemeProvider>
//       <ProductProvider>
//         <StoreDashboardContent />
//       </ProductProvider>
//     </ThemeProvider>
//   );
// }


import { Component } from 'react';
import LeaveReason from './components/Leave/LeaveReason.jsx'
export default class App extends Component {

  render(){
    return(
      <LeaveReason/>
    )
  }
}