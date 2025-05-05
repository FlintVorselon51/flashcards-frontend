// src/components/CardForm.js
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    TextArea,
    Flex,
    Card,
    Text
} from '@gravity-ui/uikit';

const CardSchema = Yup.object().shape({
    front: Yup.string().required('Обязательное поле'),
    back: Yup.string().required('Обязательное поле'),
});

const CardForm = ({ onSubmit, initialValues = { front: '', back: '' }, buttonText = 'Сохранить' }) => {
    return (
        <Card style={{ padding: '16px', margin: '0', width: '100%', maxWidth: '800px' }}>
            <Formik
                initialValues={initialValues}
                validationSchema={CardSchema}
                onSubmit={(values, { resetForm }) => {
                    onSubmit(values);
                    resetForm();
                }}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Flex direction="column" gap="8">
                            <div>
                                <Text variant="subheader-1">Лицевая сторона</Text>
                                <Field name="front">
                                    {({ field }) => (
                                        <TextArea
                                            {...field}
                                            size="m"
                                            placeholder="Например: 你好"
                                            error={touched.front && errors.front ? true : false}
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Field>
                                {touched.front && errors.front && (
                                    <Text color="danger" style={{ fontSize: '12px', marginTop: '2px' }}>{errors.front}</Text>
                                )}
                            </div>

                            <div style={{ marginTop: '8px' }}>
                                <Text variant="subheader-1">Обратная сторона</Text>
                                <Field name="back">
                                    {({ field }) => (
                                        <TextArea
                                            {...field}
                                            size="m"
                                            placeholder="Например: Привет"
                                            error={touched.back && errors.back ? true : false}
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Field>
                                {touched.back && errors.back && (
                                    <Text color="danger" style={{ fontSize: '12px', marginTop: '2px' }}>{errors.back}</Text>
                                )}
                            </div>

                            <Button
                                type="submit"
                                view="action"
                                size="m"
                                disabled={isSubmitting}
                                style={{ marginTop: '12px', alignSelf: 'center', width: '100%' }}
                            >
                                {buttonText}
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default CardForm;
