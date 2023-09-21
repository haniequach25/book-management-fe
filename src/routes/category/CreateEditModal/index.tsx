import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import { Author, Book, Category, Publisher } from '../../../utils/constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authorApi, bookApi, categoryApi, publisherApi } from '../../../apis';
import moment from 'moment';
import { CreateCategoryDTO } from '../List';

interface IProps {
  id?: string;
  open: boolean;
  onCancel: () => void;
  onFinishFormModal: (value: CreateCategoryDTO) => void;
  isLoading: boolean;
}

export const CreateEditModal: React.FC<IProps> = (props) => {
  const { open, onCancel, id, onFinishFormModal, isLoading } = props;
  const [form] = useForm();
  const n = (key: keyof CreateCategoryDTO) => key;
  const [listAuthor, setListAuthor] = useState<Author[]>([]);
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const [listPublisher, setListPublisher] = useState<Publisher[]>([]);

  const detailMutation = useMutation((id: string) => categoryApi.categoryControllerGetOne(id), {
    onSuccess: (data: any) => {
      if (data.data) {
        const detail: Category = data.data;
        console.log('detail', detail);
        form.setFieldsValue(detail);
      }
    },
    onError: (error) => {
      message.error('update failed');
    },
  });

  const onFinish = (value: CreateCategoryDTO) => {
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
    <Modal title={`${!id ? 'Create' : 'Edit'} category`} open={open} onCancel={onCancel} footer={false}>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
        <Form.Item
          name={n('name')}
          label={<span style={{ textTransform: 'capitalize' }}>Name</span>}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Button htmlType="submit" type="primary" style={{ width: '100%' }} loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  );
};
