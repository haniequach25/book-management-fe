import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import { Author, Book, Category, Publisher } from '../../../utils/constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authorApi, bookApi, categoryApi, publisherApi } from '../../../apis';
import moment from 'moment';
import TextArea from 'antd/es/input/TextArea';
import { CreatePublisherDTO } from '../List';
import { formatPhoneNumber } from '../../../utils';

interface IProps {
  id?: string;
  open: boolean;
  onCancel: () => void;
  onFinishFormModal: (value: CreatePublisherDTO) => void;
  isLoading: boolean;
}

export const CreateEditModal: React.FC<IProps> = (props) => {
  const { open, onCancel, id, onFinishFormModal, isLoading } = props;
  const [form] = useForm();
  const n = (key: keyof CreatePublisherDTO) => key;

  const detailMutation = useMutation((id: string) => authorApi.authorControllerGetOne(id), {
    onSuccess: (data: any) => {
      if (data.data) {
        const detail: Publisher = data.data;
        console.log('detail', detail);
        form.setFieldsValue(detail);
      }
    },
    onError: (error) => {
      message.error('update failed');
    },
  });

  const onFinish = (value: CreatePublisherDTO) => {
    console.log('value', value);
    onFinishFormModal(value);
  };

  const onFinishFailed = () => {};

  useEffect(() => {
    if (id) {
      detailMutation.mutate(id);
    }
  }, [id]);

  return (
    <Modal title={`${!id ? 'Create' : 'Edit'} publisher`} open={open} onCancel={onCancel} footer={false}>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
        <Form.Item
          name={n('name')}
          label={<span style={{ textTransform: 'capitalize' }}>Name</span>}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={n('address')}
          label={<span style={{ textTransform: 'capitalize' }}>Address</span>}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={n('phoneNumber')}
          label={<span style={{ textTransform: 'capitalize' }}>Phone Number</span>}
          rules={[{ required: true }]}
        >
          <Input
            onChange={(e) => {
              const value = e.target.value;
              form.setFieldValue(n('phoneNumber'), formatPhoneNumber(value));
            }}
          />
        </Form.Item>

        <Form.Item
          name={n('email')}
          label={<span style={{ textTransform: 'capitalize' }}>Email</span>}
          rules={[{ required: true }]}
        >
          <Input type="email" />
        </Form.Item>

        <Button htmlType="submit" type="primary" style={{ width: '100%' }} loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  );
};
