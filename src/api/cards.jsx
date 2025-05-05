import api from './api.jsx';

export const getCards = (deckId) => {
    return api.get('/api/cards/', {params: {deck: deckId}});
};

export const createCard = (cardData) => {
    return api.post('/api/cards/', cardData);
};

export const getCardById = (id) => {
    return api.get(`/api/cards/${id}/`);
};

export const updateCard = (id, cardData) => {
    return api.put(`/api/cards/${id}/`, cardData);
};

export const deleteCard = (id) => {
    return api.delete(`/api/cards/${id}/`);
};
