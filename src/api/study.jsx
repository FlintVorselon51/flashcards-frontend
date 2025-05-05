import api from './api';

export const getCardStudyData = (cardId) => {
    return api.get(`/api/cards/${cardId}/study_data/`);
};

export const submitReview = (reviewData) => {
    return api.post('/api/review/', reviewData);
};

export const endSession = (sessionId) => {
    return api.post(`/api/sessions/${sessionId}/end_session/`);
};
