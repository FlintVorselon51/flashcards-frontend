import React, { useContext, useEffect, useState } from 'react';
import {
    Text,
    Button,
    Flex,
    Container,
    Spin,
    Alert
} from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { getDecks, deleteDeck } from '../api/decks.jsx';
import DeckCard from '../components/DeckCard.jsx';

const HomePage = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDecks = async () => {
        setLoading(true);
        try {
            const response = await getDecks();
            console.log('Fetched decks:', response.data);
            setDecks(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching decks:', err);
            setError('Не удалось загрузить наборы карточек');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Очищаем ошибку при монтировании компонента
        setError(null);

        // Загружаем наборы, если пользователь аутентифицирован
        if (isAuthenticated) {
            fetchDecks();
        }
    }, [isAuthenticated]); // Зависимость от isAuthenticated позволит перезагрузить данные при входе/выходе

    const handleDeleteDeck = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот набор?')) {
            try {
                await deleteDeck(id);
                setDecks(decks.filter(deck => deck.id !== id));
            } catch (err) {
                console.error('Error deleting deck:', err);
                setError('Не удалось удалить набор');
            }
        }
    };

    // Также добавим функцию для обновления списка наборов
    const refreshDecks = () => {
        if (isAuthenticated) {
            fetchDecks();
        }
    };

    if (loading) {
        return (
            <Container>
                <Flex alignItems="center" justifyContent="center" style={{ height: '70vh' }}>
                    <Spin size="l" />
                </Flex>
            </Container>
        );
    }

    return (
        <Container style={{maxWidth: '640px'}}>
            {isAuthenticated ? (
                <>
                    <Flex justifyContent="space-between" alignItems="center" style={{ marginBottom: '20px' }}>
                        <Text variant="display-1">Мои наборы карточек</Text>
                        <Flex gap="8">
                            <Button
                                view="normal"
                                size="l"
                                onClick={refreshDecks}
                            >
                                Обновить
                            </Button>
                            <Button
                                view="action"
                                size="l"
                                onClick={() => navigate('/decks/create')}
                            >
                                Создать набор
                            </Button>
                        </Flex>
                    </Flex>

                    {error && (
                        <Alert
                            theme="danger"
                            style={{ marginBottom: '20px' }}
                            onClose={() => setError(null)}
                            showIcon
                        >
                            {error}
                        </Alert>
                    )}

                    {decks.length === 0 ? (
                        <Flex direction="column" alignItems="center" gap="16" style={{ marginTop: '50px' }}>
                            <Text variant="header-1">У вас пока нет наборов карточек</Text>
                            <Text variant="body-1">Создайте свой первый набор для изучения</Text>
                            <Button
                                view="action"
                                size="l"
                                onClick={() => navigate('/decks/create')}
                            >
                                Создать набор
                            </Button>
                        </Flex>
                    ) : (
                        <div>
                            {decks.map(deck => (
                                <DeckCard
                                    key={deck.id}
                                    deck={deck}
                                    onDelete={handleDeleteDeck}
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <Flex direction="column" alignItems="center" gap="24" style={{ marginTop: '50px' }}>
                    <Text variant="display-1">Добро пожаловать в Flashcards</Text>
                    <Text variant="header-2" style={{ textAlign: 'center', maxWidth: '800px' }}>
                        Эффективное запоминание с помощью интервальных повторений
                    </Text>
                    <Flex gap="16">
                        <Button
                            view="action"
                            size="xl"
                            onClick={() => navigate('/register')}
                        >
                            Зарегистрироваться
                        </Button>
                        <Button
                            view="outlined"
                            size="xl"
                            onClick={() => navigate('/login')}
                        >
                            Войти
                        </Button>
                    </Flex>

                    <div style={{ marginTop: '50px', maxWidth: '800px' }}>
                        <Text variant="header-1" style={{ textAlign: 'center', marginBottom: '20px' }}>
                            Возможности приложения
                        </Text>
                        <Flex gap="24" wrap="wrap" justifyContent="center">
                            <div style={{ width: '30%', textAlign: 'center' }}>
                                <Text variant="subheader-1">Создание карточек</Text>
                                <Text>Создавайте свои наборы карточек для изучения языков и других предметов</Text>
                            </div>
                            <div style={{ width: '30%', textAlign: 'center' }}>
                                <Text variant="subheader-1">Интервальные повторения</Text>
                                <Text>Используйте научный подход к запоминанию с интервальными повторениями</Text>
                            </div>
                            <div style={{ width: '30%', textAlign: 'center' }}>
                                <Text variant="subheader-1">Обмен наборами</Text>
                                <Text>Делитесь своими наборами с другими и используйте публичные наборы</Text>
                            </div>
                        </Flex>
                    </div>
                </Flex>
            )}
        </Container>
    );
};

export default HomePage;
