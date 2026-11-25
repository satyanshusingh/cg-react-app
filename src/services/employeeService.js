const API_URL = 'http://localhost:3000/employees';
 
async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    throw new Error(`Request failed : ${response.status} check JSON Server`);
  }
 
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
 
export const employeeService = {
  getAll(signal){
    return request('', { signal });
  },
  create(employee, signal){
    return request('', {
      method: 'POST',
      body: JSON.stringify(employee),
      signal
    });
  },
  update(id, employee, signal){
    return request(`/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(employee),
      signal
    });
  },
  remove(id, signal){
    return request(`/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      signal
    });
  }
};
