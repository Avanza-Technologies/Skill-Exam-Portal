/**
 * Centralized API Service for communicating with Spring Boot Backend
 * Supports JWT Token injection, automatic JSON parsing, and graceful error messages.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function getStoredToken() {
  try {
    return localStorage.getItem('ns_access_token') || null;
  } catch {
    return null;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle binary responses (e.g. Excel download)
    if (options.isBinary) {
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }
      return await response.blob();
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.detail ||
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status && err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error('Cannot connect to Spring Boot server (http://localhost:8080). Please ensure the backend is running.');
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

// ── Auth APIs ───────────────────────────────────────────────────
export const authApi = {
  login: (usernameOrEmail, password) =>
    apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    }),

  register: (payload) =>
    apiRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  refreshToken: (refreshToken) =>
    apiRequest('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  getProfile: () =>
    apiRequest('/api/v1/auth/me', {
      method: 'GET',
    }),
};

// ── Attendance APIs ─────────────────────────────────────────────
export const attendanceApi = {
  checkIn: (checkInRequest) =>
    apiRequest('/api/v1/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(checkInRequest),
    }),

  checkOut: (checkOutRequest) =>
    apiRequest('/api/v1/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify(checkOutRequest),
    }),

  upsertDaily: (dailyDto) =>
    apiRequest('/api/v1/attendance', {
      method: 'POST',
      body: JSON.stringify(dailyDto),
    }),

  recalculateMonth: (employeeId, month) =>
    apiRequest(`/api/v1/attendance/${employeeId}/recalculate?month=${month}`, {
      method: 'POST',
    }),
};

// ── Leave APIs ──────────────────────────────────────────────────
export const leaveApi = {
  submit: (leaveRequestDto) =>
    apiRequest('/api/v1/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveRequestDto),
    }),

  getPending: (organizationId = 1) =>
    apiRequest(`/api/v1/leaves/pending?organizationId=${organizationId}`, {
      method: 'GET',
    }),

  approveOrReject: (id, status, remarks = '') =>
    apiRequest(`/api/v1/leaves/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks }),
    }),
};

// ── Outside Work / Official Duty APIs ───────────────────────────
export const outsideWorkApi = {
  submit: (dto) =>
    apiRequest('/api/v1/outside-work', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  getPending: (organizationId = 1) =>
    apiRequest(`/api/v1/outside-work/pending?organizationId=${organizationId}`, {
      method: 'GET',
    }),

  approveOrReject: (id, status, remarks = '') =>
    apiRequest(`/api/v1/outside-work/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks }),
    }),
};

// ── Employee APIs ───────────────────────────────────────────────
export const employeeApi = {
  getAllActive: (organizationId = 1) =>
    apiRequest(`/api/v1/employees/list?organizationId=${organizationId}`, {
      method: 'GET',
    }),

  getById: (id) =>
    apiRequest(`/api/v1/employees/${id}`, {
      method: 'GET',
    }),

  create: (dto) =>
    apiRequest('/api/v1/employees', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  update: (id, dto) =>
    apiRequest(`/api/v1/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    }),
};

// ── Reports & Payroll APIs ──────────────────────────────────────
export const reportingApi = {
  getMonthlySummaries: (organizationId = 1, month = '2026-09') =>
    apiRequest(`/api/v1/reports/monthly?organizationId=${organizationId}&month=${month}`, {
      method: 'GET',
    }),

  downloadExcel: async (organizationId = 1, month = '2026-09') => {
    const blob = await apiRequest(`/api/v1/reports/monthly/excel?organizationId=${organizationId}&month=${month}`, {
      method: 'GET',
      isBinary: true,
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_Report_${month}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  finalizeMonth: (organizationId = 1, month = '2026-09') =>
    apiRequest(`/api/v1/months/${month}/finalize?organizationId=${organizationId}`, {
      method: 'POST',
    }),
};

// ── Holiday Calendar APIs ───────────────────────────────────────
export const holidayApi = {
  getHolidays: (organizationId = 1, startDate = '2026-01-01', endDate = '2026-12-31') =>
    apiRequest(`/api/v1/holidays?organizationId=${organizationId}&startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
    }),

  create: (holidayDto) =>
    apiRequest('/api/v1/holidays', {
      method: 'POST',
      body: JSON.stringify(holidayDto),
    }),
};

// ── Policy & Org Structure APIs ─────────────────────────────────
export const policyApi = {
  getByOrg: (organizationId = 1) =>
    apiRequest(`/api/v1/policies/organization/${organizationId}`, {
      method: 'GET',
    }),

  getBranches: (organizationId = 1) =>
    apiRequest(`/api/v1/organizations/${organizationId}/branches`, {
      method: 'GET',
    }),

  getDepartments: (organizationId = 1) =>
    apiRequest(`/api/v1/organizations/${organizationId}/departments`, {
      method: 'GET',
    }),
};

// ── Audit Log APIs ──────────────────────────────────────────────
export const auditApi = {
  getLogs: (organizationId = 1, page = 0, size = 30) =>
    apiRequest(`/api/v1/audit?organizationId=${organizationId}&page=${page}&size=${size}`, {
      method: 'GET',
    }),
};

// ── System / Health APIs ─────────────────────────────────────────
export const systemApi = {
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/actuator/health`);
      if (res.ok) {
        const data = await res.json();
        return { online: true, status: data.status };
      }
      return { online: false, status: 'DOWN' };
    } catch {
      return { online: false, status: 'OFFLINE' };
    }
  },
};
