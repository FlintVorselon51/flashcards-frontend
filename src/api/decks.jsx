import api from './api.jsx';

export const getDecks = () => {
    return api.get('/api/decks/');
};

export const createDeck = (deckData) => {
    return api.post('/api/decks/', deckData);
};

export const getDeckById = (id) => {
    return api.get(`/api/decks/${id}/`);
};

export const updateDeck = (id, deckData) => {
    return api.put(`/api/decks/${id}/`, deckData);
};

export const deleteDeck = (id) => {
    return api.delete(`/api/decks/${id}/`);
};

export const getDueCards = (deckId) => {
    return api.get(`/api/decks/${deckId}/due_cards/`);
};

export const startSession = (deckId) => {
    return api.post(`/api/decks/${deckId}/start_session/`);
};
