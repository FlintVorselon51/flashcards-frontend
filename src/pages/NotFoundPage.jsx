import React from 'react';
import {
    Container,
    Text,
    Button,
    Flex
} from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Flex direction="column" alignItems="center" gap="24" style={{ marginTop: '100px' }}>
                <Text variant="display-1">404</Text>
                <Text variant="header-1">Страница не найдена</Text>
                <Text variant="body-1" style={{ textAlign: 'center', maxWidth: '500px' }}>
                    Извините, запрашиваемая страница не существует или была перемещена.
                </Text>
                <Button
                    view="action"
                    size="l"
                    onClick={() => navigate('/')}
                >
                    Вернуться на главную
                </Button>
            </Flex>
        </Container>
    );
};

export default NotFoundPage;
