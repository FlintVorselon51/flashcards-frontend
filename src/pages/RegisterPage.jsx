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
import { register as apiRegister } from '../api/auth.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';

const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Некорректный email').required('Обязательное поле'),
    password: Yup.string()
        .min(8, 'Пароль должен быть не менее 8 символов')
        .required('Обязательное поле'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
        .required('Обязательное поле'),
});

const RegisterPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Регистрация пользователя
            await apiRegister({
                email: values.email,
                password: values.password,
            });

            // Автоматический вход после регистрации
            await login(values.email, values.password);

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Ошибка регистрации');
            console.error('Registration error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <Flex justifyContent="center" style={{ marginTop: '50px' }}>
                <Card style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
                    <Text variant="display-1" style={{ marginBottom: '24px', textAlign: 'center' }}>
                        Регистрация
                    </Text>

                    {error && (
                        <Alert theme="danger" style={{ marginBottom: '20px' }}>
                            {error}
                        </Alert>
                    )}

                    <Formik
                        initialValues={{ email: '', password: '', confirmPassword: '' }}
                        validationSchema={RegisterSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <Flex direction="column" gap="16">
                                    <div>
                                        <Text variant="subheader-1">Email</Text>
                                        <Field name="email">
                                            {({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    size="m"
                                                    placeholder="your.email@example.com"
                                                    error={touched.email && errors.email}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        </Field>
                                        {touched.email && errors.email && (
                                            <Text color="danger">{errors.email}</Text>
                                        )}
                                    </div>

                                    <div>
                                        <Text variant="subheader-1">Пароль</Text>
                                        <Field name="password">
                                            {({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    type="password"
                                                    size="m"
                                                    placeholder="Минимум 8 символов"
                                                    error={touched.password && errors.password}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        </Field>
                                        {touched.password && errors.password && (
                                            <Text color="danger">{errors.password}</Text>
                                        )}
                                    </div>

                                    <div>
                                        <Text variant="subheader-1">Подтвердите пароль</Text>
                                        <Field name="confirmPassword">
                                            {({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    type="password"
                                                    size="m"
                                                    placeholder="Повторите пароль"
                                                    error={touched.confirmPassword && errors.confirmPassword}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        </Field>
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <Text color="danger">{errors.confirmPassword}</Text>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        view="action"
                                        size="l"
                                        width="max"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                                    </Button>
                                </Flex>
                            </Form>
                        )}
                    </Formik>

                    <Flex direction="column" alignItems="center" gap="8" style={{ marginTop: '24px' }}>
                        <Text variant="body-1">
                            Уже есть аккаунт? <Link to="/login" style={{ color: '#1774E5', textDecoration: 'none' }}>Войти</Link>
                        </Text>
                    </Flex>
                </Card>
            </Flex>
        </Container>
    );
};

export default RegisterPage;
