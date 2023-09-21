import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import { Author, Book, Category, Publisher } from '../../../utils/constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authorApi, bookApi, categoryApi, publisherApi } from '../../../apis';
import moment from 'moment';
import { CreateAuthorDTO } from '../List';
import TextArea from 'antd/es/input/TextArea';

interface IProps {
  id?: string;
  open: boolean;
  onCancel: () => void;
  onFinishFormModal: (value: CreateAuthorDTO) => void;
  isLoading: boolean;
}

export const CreateEditModal: React.FC<IProps> = (props) => {
  const { open, onCancel, id, onFinishFormModal, isLoading } = props;
  const [form] = useForm();
  const n = (key: keyof CreateAuthorDTO) => key;

  const detailMutation = useMutation((id: string) => authorApi.authorControllerGetOne(id), {
    onSuccess: (data: any) => {
      if (data.data) {
        const detail: Author = data.data;
        console.log('detail', detail);
        form.setFieldsValue(detail);
        if (detail.dob) {
          form.setFieldValue(n('dob'), moment(detail.dob));
        }
      }
    },
    onError: (error) => {
      message.error('update failed');
    },
  });

  const onFinish = (value: CreateAuthorDTO) => {
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
    <Modal title={`${!id ? 'Create' : 'Edit'} book`} open={open} onCancel={onCancel} footer={false}>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
        <Form.Item
          name={n('firstName')}
          label={<span style={{ textTransform: 'capitalize' }}>First name</span>}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={n('lastName')}
          label={<span style={{ textTransform: 'capitalize' }}>Last name</span>}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name={n('dob')} label={<span style={{ textTransform: 'capitalize' }}>Birth day</span>}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name={n('description')} label={<span style={{ textTransform: 'capitalize' }}>Description</span>}>
          <TextArea />
        </Form.Item>

        <Button htmlType="submit" type="primary" style={{ width: '100%' }} loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  );
};
