// src/pages/CreateDeckPage.js
import React, { useState } from 'react';
import {
    Container,
    Text,
    Flex,
    Alert
} from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';
import { createDeck } from '../api/decks';
import DeckForm from '../components/DeckForm';

const CreateDeckPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleCreateDeck = async (deckData) => {
        try {
            const response = await createDeck(deckData);
            navigate(`/decks/${response.data.id}`);
        } catch (err) {
            console.error('Error creating deck:', err);
            setError('Не удалось создать набор карточек');
        }
    };

    return (
        <Container>
            <Flex direction="column" alignItems="center" gap="16">
                <Text variant="display-1" style={{ marginBottom: '16px' }}>Создание нового набора карточек</Text>

                {error && (
                    <Alert
                        theme="danger"
                        style={{ marginBottom: '16px', width: '100%', maxWidth: '800px' }}
                        onClose={() => setError(null)}
                        showIcon
                    >
                        {error}
                    </Alert>
                )}

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <DeckForm
                        onSubmit={handleCreateDeck}
                        buttonText="Создать набор"
                    />
                </div>
            </Flex>
        </Container>
    );
};

export default CreateDeckPage;
