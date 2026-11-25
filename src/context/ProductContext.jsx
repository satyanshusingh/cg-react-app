import React, { createContext, useReducer, useContext } from "react";
const ProductContext = createContext();

const initialState = {
  products: [],
  loading: true,
  saving: false,
  deleting: false,
  error: '',
  message: '',
  editingProduct: null,
  form: { name: '', price: '', quantity: '' }
};

function productReducer(state, action) {
  switch (action.type) {
    case 'START_FETCH':
      return { ...state, loading: true, error: '', message: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'START_SAVE':
      return { ...state, saving: true, error: '', message: '' };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        saving: false,
        products: [...state.products, action.payload],
        form: { name: '', price: '', quantity: '' },
        message: 'Product Created Successfully'
      };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        saving: false,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
        editingProduct: null,
        form: { name: '', price: '', quantity: '' },
        message: 'Product Updated Successfully'
      };
    case 'SAVE_FAILURE':
      return { ...state, saving: false, error: action.payload };
    case 'START_DELETE':
      return { ...state, deleting: true, error: '', message: '' };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        deleting: false,
        products: state.products.filter(p => p.id !== action.payload),
        editingProduct: state.editingProduct?.id === action.payload ? null : state.editingProduct,
        form: state.editingProduct?.id === action.payload ? { name: '', price: '', quantity: '' } : state.form,
        message: 'Product Deleted Successfully'
      };
    case 'DELETE_FAILURE':
      return { ...state, deleting: false, error: action.payload };
    case 'SET_FORM_FIELD':
      return { ...state, form: { ...state.form, [action.payload.name]: action.payload.value }, error: '', message: '' };
    case 'SET_EDIT_MODE':
      return {
        ...state,
        editingProduct: action.payload,
        form: { name: action.payload.name, price: action.payload.price, quantity: action.payload.quantity },
        error: '',
        message: ''
      };
    case 'CANCEL_EDIT':
      return { ...state, editingProduct: null, form: { name: '', price: '', quantity: '' }, error: '', message: '' };
    case 'SET_ERROR':
      return { ...state, error: action.payload, message: '' };
    default:
      return state;
  }
}

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}