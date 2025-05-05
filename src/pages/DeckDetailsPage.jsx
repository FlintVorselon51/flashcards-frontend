import React, { useState, useEffect } from 'react';
import {
    Container,
    Text,
    Button,
    Flex,
    Card,
    Alert,
    Spin,
    Modal,
    TextInput,
} from '@gravity-ui/uikit';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeckById, updateDeck, deleteDeck } from '../api/decks';
import { getCards, createCard, updateCard, deleteCard } from '../api/cards';
import { getCardStudyData } from '../api/study'; // Новый импорт
import DeckForm from '../components/DeckForm';
import CardForm from '../components/CardForm';

// API функция для получения данных об изучении карточки
// Эту функцию нужно добавить в файл src/api/study.js
// export const getCardStudyData = (cardId) => {
//   return api.get(`/api/cards/${cardId}/study_data/`);
// };

const DeckDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]); // Новое состояние
    const [searchQuery, setSearchQuery] = useState(''); // Новое состояние
    const [cardStudyData, setCardStudyData] = useState({}); // Новое состояние
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState(null);

    useEffect(() => {
        fetchDeckDetails();
        fetchCards();
    }, [id]);

    // Новый useEffect для фильтрации карточек
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCards(cards);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = cards.filter(card =>
                card.front.toLowerCase().includes(query) ||
                card.back.toLowerCase().includes(query)
            );
            setFilteredCards(filtered);
        }
    }, [searchQuery, cards]);

    const fetchDeckDetails = async () => {
        try {
            const response = await getDeckById(id);
            setDeck(response.data);
        } catch (err) {
            console.error('Error fetching deck details:', err);
            setError('Не удалось загрузить информацию о наборе');
        }
    };

    const fetchCards = async () => {
        setLoading(true);
        try {
            const response = await getCards(id);
            setCards(response.data);
            setFilteredCards(response.data); // Инициализация отфильтрованных карточек

            // Загружаем данные об изучении для каждой карточки
            for (const card of response.data) {
                try {
                    const studyDataResponse = await getCardStudyData(card.id);
                    setCardStudyData(prev => ({
                        ...prev,
                        [card.id]: studyDataResponse.data
                    }));
                } catch (error) {
                    console.log(`No study data for card ${card.id}`);
                }
            }
        } catch (err) {
            console.error('Error fetching cards:', err);
            setError('Не удалось загрузить карточки');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDeck = async (updatedDeck) => {
        try {
            await updateDeck(id, updatedDeck);
            setDeck({ ...deck, ...updatedDeck });
            setError(null);
        } catch (err) {
            console.error('Error updating deck:', err);
            setError('Не удалось обновить набор');
        }
    };

    const handleDeleteDeck = async () => {
        if (window.confirm('Вы уверены, что хотите удалить этот набор?')) {
            try {
                await deleteDeck(id);
                navigate('/');
            } catch (err) {
                console.error('Error deleting deck:', err);
                setError('Не удалось удалить набор');
            }
        }
    };

    const handleAddCard = async (cardData) => {
        try {
            const response = await createCard({ ...cardData, deck: id });
            setCards([...cards, response.data]);
            setError(null);
        } catch (err) {
            console.error('Error adding card:', err);
            setError('Не удалось добавить карточку');
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту карточку?')) {
            try {
                await deleteCard(cardId);
                setCards(cards.filter(card => card.id !== cardId));
            } catch (err) {
                console.error('Error deleting card:', err);
                setError('Не удалось удалить карточку');
            }
        }
    };

    const openEditModal = (card) => {
        setEditingCard(card);
        setIsEditModalOpen(true);
    };

    const handleUpdateCard = async (updatedCard) => {
        try {
            await updateCard(editingCard.id, updatedCard);
            setCards(cards.map(card =>
                card.id === editingCard.id ? { ...card, ...updatedCard } : card
            ));
            setIsEditModalOpen(false);
            setEditingCard(null);
        } catch (err) {
            console.error('Error updating card:', err);
            setError('Не удалось обновить карточку');
        }
    };

    // Новая функция для форматирования даты
    const formatDate = (dateString) => {
        if (!dateString) return 'Не изучалась';

        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Проверяем, сегодня ли дата
        if (date.toDateString() === today.toDateString()) {
            return `Сегодня, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        // Проверяем, завтра ли дата
        if (date.toDateString() === tomorrow.toDateString()) {
            return `Завтра, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        // Для других дат
        return date.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Новая функция для отображения информации об изучении
    const renderStudyData = (cardId) => {
        const studyData = cardStudyData[cardId];

        if (!studyData) {
            return (
                <Text style={{
                    fontSize: '14px',
                    color: '#666',
                    textAlign: 'center',
                    marginTop: '12px'
                }}>
                    Карточка еще не изучалась
                </Text>
            );
        }

        return (
            <Flex direction="column" gap="4" style={{ marginTop: '12px' }}>
                <Text style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
                    Следующее повторение: {formatDate(studyData.next_review)}
                </Text>
                <Flex gap="16" justifyContent="center" style={{ fontSize: '14px', color: '#666' }}>
                    <Text>Коэффициент: {studyData.ease_factor?.toFixed(2) || '-'}</Text>
                    <Text>Интервал: {studyData.interval || 0} {getIntervalText(studyData.interval || 0)}</Text>
                    <Text>Повторений: {studyData.total_reviews || 0}</Text>
                </Flex>
            </Flex>
        );
    };

    // Вспомогательная функция для правильного склонения слова "день"
    const getIntervalText = (interval) => {
        if (interval === 1) return 'день';
        if (interval > 1 && interval < 5) return 'дня';
        return 'дней';
    };

    if (loading && !deck) {
        return (
            <Container>
                <Flex alignItems="center" justifyContent="center" style={{ height: '70vh' }}>
                    <Spin size="l" />
                </Flex>
            </Container>
        );
    }

    if (!deck) {
        return (
            <Container>
                <Alert theme="danger">Набор не найден</Alert>
            </Container>
        );
    }

    return (
        <Container style={{maxWidth: '640px'}}>
            <Flex direction="column" gap="24">
                <Flex justifyContent="space-between" alignItems="center">
                    <Text variant="display-1">{deck.name}</Text>
                    <Flex gap="8">
                        <Button
                            view="action"
                            size="l"
                            onClick={() => navigate(`/decks/${id}/study`)}
                        >
                            Изучать
                        </Button>
                        <Button
                            view="outlined"
                            size="l"
                            onClick={handleDeleteDeck}
                        >
                            Удалить набор
                        </Button>
                    </Flex>
                </Flex>

                <Text variant="body-1">{deck.description}</Text>

                {error && (
                    <Alert theme="danger">{error}</Alert>
                )}


                <div>
                    <Flex direction="column" alignItems="center" gap="16" style={{ marginTop: '16px' }}>
                        <Text variant="header-1" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                            Настройки набора
                        </Text>
                        <DeckForm
                            initialValues={deck}
                            onSubmit={handleUpdateDeck}
                            buttonText="Сохранить изменения"
                        />
                    </Flex>
                </div>

                <div>
                    <div>
                        <Flex direction="column" gap="24" style={{ marginTop: '16px' }}>
                            {/* Заголовок "Добавить новую карточку" */}
                            <Text
                                variant="header-1"
                                style={{
                                    textAlign: 'center',
                                    marginBottom: '16px'
                                }}
                            >
                                Добавить новую карточку
                            </Text>

                            {/* Форма добавления карточки */}
                            <div>
                                <CardForm
                                    onSubmit={handleAddCard}
                                    buttonText="Добавить карточку"
                                />
                            </div>

                            {/* Заголовок "Карточки" и поисковая строка */}
                            <Flex direction="column" gap="16">
                                <Text
                                    variant="header-1"
                                    style={{
                                        textAlign: 'center',
                                        margin: '24px 0 8px'
                                    }}
                                >
                                    Карточки ({cards.length})
                                </Text>

                                {/* Поисковая строка */}
                                <TextInput
                                    placeholder="Поиск по карточкам..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '100%' }}
                                    size="m"
                                    hasClear
                                    onClearClick={() => setSearchQuery('')}
                                    leftContent={
                                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.7 14.3l-3.6-3.6c0.9-1.1 1.4-2.5 1.4-4.1 0-3.6-2.9-6.4-6.4-6.4S0.7 3.1 0.7 6.6s2.9 6.4 6.4 6.4c1.6 0 3-0.5 4.1-1.4l3.6 3.6c0.1 0.1 0.3 0.2 0.5 0.2 0.4 0 0.7-0.3 0.7-0.7 0-0.2-0.1-0.3-0.2-0.5zM2.5 6.6c0-2.6 2.1-4.7 4.7-4.7s4.7 2.1 4.7 4.7-2.1 4.7-4.7 4.7-4.7-2.1-4.7-4.7z" fill="#999999"/>
                                            </svg>
                                        </div>
                                    }
                                />
                            </Flex>

                            {/* Содержимое блока карточек */}
                            {loading ? (
                                <Flex justifyContent="center" style={{ padding: '20px' }}>
                                    <Spin size="m" />
                                </Flex>
                            ) : filteredCards.length === 0 ? (
                                <Text style={{ textAlign: 'center' }}>
                                    {searchQuery ? 'По вашему запросу ничего не найдено' : 'В этом наборе пока нет карточек'}
                                </Text>
                            ) : (
                                <div>
                                    {filteredCards.map(card => (
                                        <Card
                                            key={card.id}
                                            style={{
                                                padding: '24px',
                                                margin: '16px 0',
                                                width: '100%'
                                            }}
                                        >
                                            <Flex direction="column" gap="16">
                                                {/* Контент карточки */}
                                                <div>
                                                    {/* Лицевая сторона */}
                                                    <Text
                                                        variant="subheader-1"
                                                        style={{
                                                            textAlign: 'center',
                                                            color: '#666',
                                                            marginBottom: '8px'
                                                        }}
                                                    >
                                                        Лицевая сторона
                                                    </Text>
                                                    <div style={{
                                                        padding: '16px',
                                                        backgroundColor: '#f9f9f9',
                                                        borderRadius: '8px',
                                                        border: '1px solid #eee',
                                                    }}>
                                                        <Text
                                                            style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontSize: '16px',
                                                                lineHeight: '1.5',
                                                                textAlign: 'center',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {card.front}
                                                        </Text>
                                                    </div>

                                                    {/* Обратная сторона */}
                                                    <Text
                                                        variant="subheader-1"
                                                        style={{
                                                            textAlign: 'center',
                                                            color: '#666',
                                                            marginTop: '16px',
                                                            marginBottom: '8px'
                                                        }}
                                                    >
                                                        Обратная сторона
                                                    </Text>
                                                    <div style={{
                                                        padding: '16px',
                                                        backgroundColor: '#f5f9ff',
                                                        borderRadius: '8px',
                                                        border: '1px solid #e6f0ff',
                                                    }}>
                                                        <Text
                                                            style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontSize: '16px',
                                                                lineHeight: '1.5',
                                                                textAlign: 'center',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {card.back}
                                                        </Text>
                                                    </div>

                                                    {/* Данные об изучении */}
                                                    {renderStudyData(card.id)}
                                                </div>

                                                {/* Кнопки */}
                                                <Flex justifyContent="center" gap="16">
                                                    <Button
                                                        view="normal"
                                                        size="m"
                                                        onClick={() => openEditModal(card)}
                                                    >
                                                        Редактировать
                                                    </Button>
                                                    <Button
                                                        view="outlined"
                                                        size="m"
                                                        onClick={() => handleDeleteCard(card.id)}
                                                    >
                                                        Удалить
                                                    </Button>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Flex>
                    </div>
                </div>

                {isEditModalOpen && (
                    <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                        <div>
                            <Text
                                variant="header-1"
                                style={{
                                    marginBottom: '20px',
                                    textAlign: 'center'
                                }}
                            >
                                Редактирование карточки
                            </Text>

                            <div>
                                <CardForm
                                    initialValues={editingCard}
                                    onSubmit={handleUpdateCard}
                                    buttonText="Сохранить изменения"
                                />
                            </div>

                            <Flex justifyContent="center" style={{ marginTop: '20px' }}>
                                <Button
                                    view="normal"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Отмена
                                </Button>
                            </Flex>
                        </div>
                    </Modal>
                )}
            </Flex>
        </Container>
    );
};

export default DeckDetailsPage;
