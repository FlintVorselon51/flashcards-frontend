import React, { useState, useEffect } from 'react';
import {
    Container,
    Text,
    Button,
    Flex,
    Alert,
    Spin,
    Progress
} from '@gravity-ui/uikit';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeckById, getDueCards, startSession } from '../api/decks.jsx';
import { submitReview } from '../api/review.jsx';
import { endSession } from '../api/review.jsx';
import FlashCard from '../components/FlashCard.jsx';

const StudySessionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [dueCards, setDueCards] = useState([]);
    const [currentCard, setCurrentCard] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [completed, setCompleted] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDeckDetails();
        startStudySession();
    }, [id]);

    const fetchDeckDetails = async () => {
        try {
            const response = await getDeckById(id);
            setDeck(response.data);
        } catch (err) {
            console.error('Error fetching deck details:', err);
            setError('Не удалось загрузить информацию о наборе');
        }
    };

    const startStudySession = async () => {
        setLoading(true);
        try {
            // Начинаем сессию обучения
            const sessionResponse = await startSession(id);
            setSessionId(sessionResponse.data.id);

            // Получаем карточки для изучения
            const cardsResponse = await getDueCards(id);
            setDueCards(cardsResponse.data);

            if (cardsResponse.data.length > 0) {
                setCurrentCard(cardsResponse.data[0]);
            }
        } catch (err) {
            console.error('Error starting study session:', err);
            setError('Не удалось начать сессию обучения');
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (cardId, difficulty) => {
        try {
            await submitReview({
                card_id: cardId,
                difficulty: difficulty,
                session: sessionId
            });

            // Увеличиваем количество изученных карточек
            setCompleted(completed + 1);

            // Переходим к следующей карточке
            const currentIndex = dueCards.findIndex(card => card.id === currentCard.id);
            if (currentIndex < dueCards.length - 1) {
                setCurrentCard(dueCards[currentIndex + 1]);
            } else {
                // Все карточки изучены
                await endStudySession();
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            setError('Не удалось отправить оценку карточки');
        }
    };

    const endStudySession = async () => {
        if (sessionId) {
            try {
                await endSession(sessionId);
                setCurrentCard(null);
            } catch (err) {
                console.error('Error ending study session:', err);
            }
        }
    };

    const handleFinish = async () => {
        await endStudySession();
        navigate(`/decks/${id}`);
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
        <Container style={{maxWidth: '800px'}}>
            <Flex direction="column" gap="24">
                <Flex justifyContent="space-between" alignItems="center">
                    <Text variant="display-1">Изучение: {deck.name}</Text>
                    <Button
                        view="outlined"
                        size="l"
                        onClick={handleFinish}
                    >
                        Завершить сессию
                    </Button>
                </Flex>

                {error && (
                    <Alert theme="danger">{error}</Alert>
                )}

                {loading ? (
                    <Flex alignItems="center" justifyContent="center" style={{ height: '70vh' }}>
                        <Spin size="l" />
                    </Flex>
                ) : dueCards.length === 0 ? (
                    <Flex direction="column" alignItems="center" gap="16" style={{ marginTop: '50px' }}>
                        <Text variant="header-1">Нет карточек для изучения</Text>
                        <Text variant="body-1">
                            В этом наборе нет карточек для изучения сегодня. Вернитесь позже или добавьте новые карточки.
                        </Text>
                        <Button
                            view="action"
                            size="l"
                            onClick={() => navigate(`/decks/${id}`)}
                        >
                            Вернуться к набору
                        </Button>
                    </Flex>
                ) : currentCard ? (
                    <>
                        <Flex alignItems="center">
                            <Text variant="body-1">Прогресс: {completed}/{dueCards.length}</Text>
                            <Progress
                                value={(completed / dueCards.length) * 100}
                                style={{ minWidth: '100px', width: '300px' }}
                            />
                        </Flex>

                        <FlashCard
                            card={currentCard}
                            onRate={handleRate}
                        />
                    </>
                ) : (
                    <Flex direction="column" alignItems="center" gap="16" style={{ marginTop: '50px' }}>
                        <Text variant="header-1">Все карточки изучены!</Text>
                        <Text variant="body-1">
                            Поздравляем! Вы завершили сессию изучения карточек на сегодня.
                        </Text>
                        <Button
                            view="action"
                            size="l"
                            onClick={() => navigate(`/decks/${id}`)}
                        >
                            Вернуться к набору
                        </Button>
                    </Flex>
                )}
            </Flex>
        </Container>
    );
};

export default StudySessionPage;
