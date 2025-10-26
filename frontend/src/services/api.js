const BFF_URL = import.meta.env.VITE_BFF_URL || 'http://localhost:3000/api';

export const api = {
  async getCompanyDetails(companyId) {
    const response = await fetch(`${BFF_URL}/empresas/${companyId}/detalhes`);
    if (!response.ok) throw new Error('Failed to fetch company details');
    return response.json();
  },

  async getCourses(queryParams = {}) {
    const params = new URLSearchParams(queryParams);
    const response = await fetch(`${BFF_URL}/cursos?${params}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  async createCourse(courseData) {
    const response = await fetch(`${BFF_URL}/cursos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  },

  async getGroups(companyId) {
    const response = await fetch(`${BFF_URL}/empresas/${companyId}/groups`);
    if (!response.ok) throw new Error('Failed to fetch groups');
    return response.json();
  },

  async createEnrollment(enrollmentData) {
    const response = await fetch(`${BFF_URL}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrollmentData)
    });
    if (!response.ok) throw new Error('Failed to create enrollment');
    return response.json();
  }
};
