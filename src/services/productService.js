const API_URL = 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const productService = {
  async getAllWithStock(signal) {
    const [products, stocks] = await Promise.all([
      request('/products', { signal }),
      request('/stocks', { signal })
    ]);
    
    return products.map(p => {
      const stockItem = stocks.find(s => s.productId === p.id);
      return {
        ...p,
        quantity: stockItem ? stockItem.quantity : 0,
        stockId: stockItem ? stockItem.id : null
      };
    });
  },

  async create(payload, signal) {
    const createdProduct = await request('/products', {
      method: 'POST',
      body: JSON.stringify({ name: payload.name, price: Number(payload.price) }),
      signal
    });

    const createdStock = await request('/stocks', {
      method: 'POST',
      body: JSON.stringify({ productId: createdProduct.id, quantity: Number(payload.quantity) }),
      signal
    });

    return {
      ...createdProduct,
      quantity: createdStock.quantity,
      stockId: createdStock.id
    };
  },

  async update(id, stockId, payload, signal) {
    const updatedProduct = await request(`/products/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: payload.name, price: Number(payload.price) }),
      signal
    });

    const updatedStock = await request(`/stocks/${encodeURIComponent(stockId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity: Number(payload.quantity) }),
      signal
    });

    return {
      ...updatedProduct,
      quantity: updatedStock.quantity,
      stockId: updatedStock.id
    };
  },

  async remove(id, stockId, signal) {
    await request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE', signal });
    if (stockId) {
      await request(`/stocks/${encodeURIComponent(stockId)}`, { method: 'DELETE', signal });
    }
  }
};