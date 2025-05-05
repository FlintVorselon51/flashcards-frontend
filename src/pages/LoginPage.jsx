// src/pages/LoginPage.js
import React, { useContext, useState } from 'react';
import {
    Card,
    Text,
    Button,
    TextInput,
    Flex,
    Container,
    Alert
} from '@gravity-ui/uikit';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Некорректный email').required('Обязательное поле'),
    password: Yup.string().required('Обязательное поле'),
});

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await login(values.email, values.password);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.detail || 'Ошибка входа. Проверьте данные');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <Flex justifyContent="center" style={{ marginTop: '50px' }}>
                <Card style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
                    <Text variant="display-1" style={{ marginBottom: '24px', textAlign: 'center' }}>
                        Вход
                    </Text>

                    {error && (
                        <Alert theme="danger" style={{ marginBottom: '20px' }}>
                            {error}
                        </Alert>
                    )}

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <Flex direction="column" gap="12">
                                    <div>
                                        <Text variant="subheader-1">Email</Text>
                                        <Field name="email">
                                            {({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    size="m"
                                                    placeholder="your.email@example.com"
                                                    error={touched.email && errors.email ? true : false}
                                                    style={{ width: '100%', marginTop: '4px' }}
                                                />
                                            )}
                                        </Field>
                                        {touched.email && errors.email && (
                                            <Text color="danger" style={{ fontSize: '12px', marginTop: '4px' }}>{errors.email}</Text>
                                        )}
                                    </div>

                                    <div style={{ marginTop: '8px' }}>
                                        <Text variant="subheader-1">Пароль</Text>
                                        <Field name="password">
                                            {({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    type="password"
                                                    size="m"
                                                    placeholder="Ваш пароль"
                                                    error={touched.password && errors.password ? true : false}
                                                    style={{ width: '100%', marginTop: '4px' }}
                                                />
                                            )}
                                        </Field>
                                        {touched.password && errors.password && (
                                            <Text color="danger" style={{ fontSize: '12px', marginTop: '4px' }}>{errors.password}</Text>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        view="action"
                                        size="l"
                                        width="max"
                                        disabled={isSubmitting}
                                        style={{ marginTop: '16px' }}
                                    >
                                        {isSubmitting ? 'Вход...' : 'Войти'}
                                    </Button>
                                </Flex>
                            </Form>
                        )}
                    </Formik>

                    <Flex direction="column" alignItems="center" gap="8" style={{ marginTop: '24px' }}>
                        <Text variant="body-1">
                            Нет аккаунта? <Link to="/register" style={{ color: '#1774E5', textDecoration: 'none' }}>Зарегистрироваться</Link>
                        </Text>
                    </Flex>
                </Card>
            </Flex>
        </Container>
    );
};

export default LoginPage;
