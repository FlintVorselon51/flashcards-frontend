// src/components/DeckForm.js
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    TextInput,
    TextArea,
    Flex,
    Card,
    Text,
    Checkbox
} from '@gravity-ui/uikit';

const DeckSchema = Yup.object().shape({
    name: Yup.string().required('Название обязательно'),
    description: Yup.string(),
    is_public: Yup.boolean()
});

const DeckForm = ({ onSubmit, initialValues = { name: '', description: '', is_public: false }, buttonText = 'Сохранить' }) => {
    return (
        <Card style={{ padding: '16px', margin: '0', width: '100%', maxWidth: '800px' }}>
            <Formik
                initialValues={initialValues}
                validationSchema={DeckSchema}
                onSubmit={(values) => {
                    onSubmit(values);
                }}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Flex direction="column" gap="8">
                            <div>
                                <Text variant="subheader-1" style={{ marginBottom: '4px' }}>Название набора</Text>
                                <Field name="name">
                                    {({ field }) => (
                                        <TextInput
                                            {...field}
                                            size="m"
                                            placeholder="Например: Китайский - Русский"
                                            error={touched.name && errors.name ? true : false}
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Field>
                                {touched.name && errors.name && (
                                    <Text color="danger" style={{ fontSize: '12px', marginTop: '2px' }}>{errors.name}</Text>
                                )}
                            </div>

                            <div style={{ marginTop: '8px' }}>
                                <Text variant="subheader-1" style={{ marginBottom: '4px' }}>Описание</Text>
                                <Field name="description">
                                    {({ field }) => (
                                        <TextArea
                                            {...field}
                                            size="m"
                                            placeholder="Описание набора карточек"
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Field>
                            </div>

                            <div style={{ marginTop: '8px' }}>
                                <Field name="is_public">
                                    {({ field }) => (
                                        <Checkbox
                                            {...field}
                                            checked={field.value}
                                        >
                                            Сделать набор публичным
                                        </Checkbox>
                                    )}
                                </Field>
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

export default DeckForm;
