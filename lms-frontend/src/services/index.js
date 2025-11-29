import api from './api';

export const projectService = {
    getAll: () => api.get('/projects'),
    getById: (id) => api.get(`/projects/${id}`),
    create: (project) => api.post('/projects', project),
    update: (id, project) => api.put(`/projects/${id}`, project),
    delete: (id) => api.delete(`/projects/${id}`),
    getRecommendations: (id) => api.get(`/projects/${id}/recommendations`),
    addSkill: (id, skillName) => api.post(`/projects/${id}/skills?skillName=${skillName}`),
};

export const labourService = {
    getAll: () => api.get('/labours'),
    getById: (id) => api.get(`/labours/${id}`),
    create: (labour) => api.post('/labours', labour),
    update: (id, labour) => api.put(`/labours/${id}`, labour),
    delete: (id) => api.delete(`/labours/${id}`),
    addSkill: (id, skillName) => api.post(`/labours/${id}/skills?skillName=${skillName}`),
};

export const assignmentService = {
    getAll: () => api.get('/assignments'),
    getByProject: (projectId) => api.get(`/assignments/project/${projectId}`),
    getByLabour: (labourId) => api.get(`/assignments/labour/${labourId}`),
    create: (assignment) => api.post('/assignments', assignment),
    delete: (id) => api.delete(`/assignments/${id}`),
};
