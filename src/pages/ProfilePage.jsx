import React, { useContext, useState } from 'react';
import {
    Container,
    Text,
    Button,
    Flex,
    Card,
    TextInput,
    Alert
} from '@gravity-ui/uikit';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { changePassword } from '../api/auth.jsx';

const PasswordSchema = Yup.object().shape({
    current_password: Yup.string().required('Обязательное поле'),
    new_password: Yup.string()
        .min(8, 'Пароль должен быть не менее 8 символов')
        .required('Обязательное поле'),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('new_password'), null], 'Пароли должны совпадать')
        .required('Обязательное поле'),
});

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleChangePassword = async (values, { resetForm }) => {
        try {
            await changePassword({
                old_password: values.current_password,
                new_password: values.new_password
            });

            setSuccess('Пароль успешно изменен!');
            setError(null);
            resetForm();
        } catch (err) {
            console.error('Error changing password:', err);
            setError(err.response?.data?.detail || 'Не удалось изменить пароль');
            setSuccess(null);
        }
    };

    return (
        <Container style={{maxWidth: '640px'}}>
            <Flex direction="column" gap="24">
                <Text variant="display-1">Ваш профиль</Text>

                <Card style={{ padding: '16px' }}>
                    <Flex direction="column" gap="16">
                        <Text variant="header-1">Информация об аккаунте</Text>

                        <div>
                            <Text variant="body-2">Email:</Text>
                            <Text variant="subheader-1">{user?.email}</Text>
                        </div>

                        <Button
                            view="outlined"
                            size="m"
                            onClick={logout}
                        >
                            Выйти из аккаунта
                        </Button>
                    </Flex>
                </Card>

                <Card style={{ padding: '16px' }}>
                    <Text variant="header-1" style={{ marginBottom: '16px' }}>Изменение пароля</Text>

                    {success && (
                        <Alert theme="success" style={{ marginBottom: '16px' }}>
                            {success}
                        </Alert>
                    )}

                    {error && (
                        <Alert theme="danger" style={{ marginBottom: '16px' }}>
                            {error}
                        </Alert>
                    )}

                    <Formik
                        initialValues={{ current_password: '', new_password: '', confirm_password: '' }}
                        validationSchema={PasswordSchema}
                        onSubmit={handleChangePassword}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <Flex direction="column" gap="16">
                                    <div>
                                        <Text variant="subheader-1">Текущий пароль</Text>
                                        <Field name="current_password">
                                            {({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    type="password"
                                                    size="m"
                                                    placeholder="Введите текущий пароль"
                                                    error={touched.current_password && errors.current_password}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        </Field>
                                        {touched.current_password && errors.current_password && (
                                            <Text color="danger">{errors.current_password}</Text>
                                        )}
                                    </div>

                                    <div>
                                        <Text variant="subheader-1">Новый пароль</Text>
                                        <Field name="new_password">
                                            {({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    type="password"
                                                    size="m"
                                                    placeholder="Минимум 8 символов"
                                                    error={touched.new_password && errors.new_password}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        </Field>
                                        {touched.new_password && errors.new_password && (
                                            <Text color="danger">{errors.new_password}</Text>
                                        )}
                                    </div>

                                    <div>
                                        <Text variant="subheader-1">Подтвердите новый пароль</Text>
                                        <Field name="confirm_password">
                                            {({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    type="password"
                                                    size="m"
                                                    placeholder="Повторите новый пароль"
                                                    error={touched.confirm_password && errors.confirm_password}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        </Field>
                                        {touched.confirm_password && errors.confirm_password && (
                                            <Text color="danger">{errors.confirm_password}</Text>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        view="action"
                                        size="m"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Сохранение...' : 'Сохранить новый пароль'}
                                    </Button>
                                </Flex>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </Flex>
        </Container>
    );
};

export default ProfilePage;
