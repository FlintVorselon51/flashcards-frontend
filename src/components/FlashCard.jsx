import React, { useState } from 'react';
import { Card, Button, Text, Flex } from '@gravity-ui/uikit';

const FlashCard = ({ card, onRate }) => {
    const [showAnswer, setShowAnswer] = useState(false);

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    const handleRate = (difficulty) => {
        onRate(card.id, difficulty);
        setShowAnswer(false);
    };

    return (
        <Card style={{ padding: '24px', margin: '20px 0', minHeight: '300px' }}>
            <Flex direction="column" gap="16" alignItems="center" justifyContent="center" style={{ height: '100%' }}>
                <Text variant="display-1" style={{ textAlign: 'center' }}>
                    {card.front}
                </Text>

                {showAnswer ? (
                    <>
                        <div style={{ borderTop: '1px solid #eee', width: '100%', margin: '20px 0' }}></div>

                        <Text variant="display-2" style={{ textAlign: 'center' }}>
                            {card.back}
                        </Text>

                        <Flex gap="8" style={{ marginTop: '20px' }}>
                            <Button view="outlined" size="l" onClick={() => handleRate(1)}>
                                Снова
                            </Button>
                            <Button view="outlined" size="l" onClick={() => handleRate(2)}>
                                Трудно
                            </Button>
                            <Button view="normal" size="l" onClick={() => handleRate(3)}>
                                Хорошо
                            </Button>
                            <Button view="action" size="l" onClick={() => handleRate(4)}>
                                Легко
                            </Button>
                        </Flex>
                    </>
                ) : (
                    <Button
                        view="action"
                        size="xl"
                        onClick={handleShowAnswer}
                        style={{ marginTop: '20px' }}
                    >
                        Показать ответ
                    </Button>
                )}
            </Flex>
        </Card>
    );
};

export default FlashCard;
