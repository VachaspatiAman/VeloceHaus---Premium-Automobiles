/**
 * Veloce API Service
 * ------------------
 * Centralised HTTP utility for all frontend → backend communication.
 *
 * In production  : calls go to /.netlify/functions/api/<path>
 * In development : calls go to http://localhost:5000/api/<path>
 *                  (or whatever NEXT_PUBLIC_API_URL is set to)
 *
 * Usage:
 *   import api from '@/lib/api';
 *   const data = await api.get('/vehicles');
 *   const data = await api.post('/auth/login', { email, password });
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || '/.netlify/functions/api';

// ─── Token helpers ────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('veloce_token');
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') localStorage.setItem('veloce_token', token);
}

export function clearToken(): void {
  if (typeof window !== 'undefined') localStorage.removeItem('veloce_token');
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  noAuth?: boolean;
}

interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

async function request<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, noAuth = false } = options;

  const token = getToken();
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (!noAuth && token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'same-origin',
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkErr) {
    const err: ApiError = new Error('Network error – please check your connection.');
    throw err;
  }

  // Try to parse JSON regardless of status
  let data: unknown;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = null;
  }

  if (!response.ok) {
    const err: ApiError = new Error(
      (data as { message?: string })?.message || `HTTP error ${response.status}`
    );
    err.status = response.status;
    err.data   = data;
    throw err;
  }

  return data as T;
}

// ─── Public API ───────────────────────────────────────────────────────────────

const api = {
  get<T = unknown>(endpoint: string, headers?: Record<string, string>) {
    return request<T>(endpoint, { headers });
  },

  post<T = unknown>(endpoint: string, body: unknown, options: Omit<ApiOptions, 'method' | 'body'> = {}) {
    return request<T>(endpoint, { method: 'POST', body, ...options });
  },

  put<T = unknown>(endpoint: string, body: unknown, options: Omit<ApiOptions, 'method' | 'body'> = {}) {
    return request<T>(endpoint, { method: 'PUT', body, ...options });
  },

  patch<T = unknown>(endpoint: string, body: unknown, options: Omit<ApiOptions, 'method' | 'body'> = {}) {
    return request<T>(endpoint, { method: 'PATCH', body, ...options });
  },

  delete<T = unknown>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}) {
    return request<T>(endpoint, { method: 'DELETE', ...options });
  },

  // ── Auth shortcuts ───────────────────────────────────────────────────────────
  auth: {
    login(email: string, password: string) {
      return request('/auth/login', { method: 'POST', body: { email, password }, noAuth: true });
    },
    signup(payload: { full_name: string; email: string; password: string; phone?: string }) {
      return request('/auth/signup', { method: 'POST', body: payload, noAuth: true });
    },
  },

  // ── Vehicle shortcuts ────────────────────────────────────────────────────────
  vehicles: {
    getAll(params?: Record<string, string>) {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/vehicles${qs}`);
    },
    getOne(id: string) { return request(`/vehicles/${id}`); },
    getFeatured()      { return request('/vehicles/featured'); },
  },

  // ── Cart shortcuts ───────────────────────────────────────────────────────────
  cart: {
    get()                               { return request('/cart'); },
    add(vehicle_id: string, quantity = 1) { return request('/cart/add', { method: 'POST', body: { vehicle_id, quantity } }); },
    update(cart_id: string, quantity: number) { return request('/cart/update', { method: 'PUT', body: { cart_id, quantity } }); },
    remove(id: string)                  { return request(`/cart/remove/${id}`, { method: 'DELETE' }); },
  },

  // ── Wishlist shortcuts ───────────────────────────────────────────────────────
  wishlist: {
    get()                    { return request('/wishlist'); },
    add(vehicle_id: string)  { return request('/wishlist/add', { method: 'POST', body: { vehicle_id } }); },
    remove(id: string)       { return request(`/wishlist/remove/${id}`, { method: 'DELETE' }); },
  },

  // ── Orders shortcuts ─────────────────────────────────────────────────────────
  orders: {
    create()    { return request('/orders/create', { method: 'POST', body: {} }); },
    getMyOrders() { return request('/orders/myorders'); },
  },

  // ── Admin shortcuts ──────────────────────────────────────────────────────────
  admin: {
    getStats()                  { return request('/admin/dashboard'); },
    addVehicle(payload: unknown) { return request('/admin/vehicles', { method: 'POST', body: payload }); },
    updateVehicle(id: string, payload: unknown) { return request(`/admin/vehicles/${id}`, { method: 'PUT', body: payload }); },
    deleteVehicle(id: string)   { return request(`/admin/vehicles/${id}`, { method: 'DELETE' }); },
    getOrders()                 { return request('/admin/orders'); },
    updateOrderStatus(id: string, status: string) {
      return request(`/admin/orders/${id}/status`, { method: 'PUT', body: { status } });
    },
    getUsers()                  { return request('/admin/users'); },
    assignRole(id: string, role: string) {
      return request(`/admin/users/${id}/assign-role`, { method: 'PUT', body: { role } });
    },
  },

  // ── AI shortcuts ─────────────────────────────────────────────────────────────
  ai: {
    chat(query: string)              { return request('/ai/chat', { method: 'POST', body: { query } }); },
    recommendations()                { return request('/ai/recommendations'); },
    similarVehicles(vehicleId: string) { return request(`/ai/similar/${vehicleId}`); },
  },
};

export default api;
