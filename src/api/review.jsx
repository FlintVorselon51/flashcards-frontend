import api from './api.jsx';

export const submitReview = (reviewData) => {
    return api.post('/api/review/', reviewData);
};

export const endSession = (sessionId) => {
    return api.post(`/api/sessions/${sessionId}/end_session/`);
};
