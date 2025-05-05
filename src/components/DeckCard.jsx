import React from 'react';
import { Card, Text, Button, Flex, Label } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';

const DeckCard = ({ deck, onDelete }) => {
    const navigate = useNavigate();

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <Card style={{ margin: '10px 0', padding: '16px' }}>
            <Flex direction="column" gap="8">
                <Flex justifyContent="space-between" alignItems="center">
                    <Text variant="header-2">{deck.name}</Text>
                    {deck.is_public && <Label theme="success">Публичный</Label>}
                </Flex>

                <Text variant="body-1">{deck.description || 'Без описания'}</Text>

                <Flex gap="4">
                    <Text variant="caption">Создан: {formatDate(deck.created_at)}</Text>
                    <Text variant="caption">Обновлен: {formatDate(deck.updated_at)}</Text>
                </Flex>

                <Flex gap="8">
                    <Button
                        view="action"
                        size="m"
                        onClick={() => navigate(`/decks/${deck.id}/study`)}
                    >
                        Изучать
                    </Button>
                    <Button
                        view="normal"
                        size="m"
                        onClick={() => navigate(`/decks/${deck.id}`)}
                    >
                        Открыть
                    </Button>
                    <Button
                        view="outlined"
                        size="m"
                        onClick={() => onDelete(deck.id)}
                    >
                        Удалить
                    </Button>
                </Flex>
            </Flex>
        </Card>
    );
};

export default DeckCard;
