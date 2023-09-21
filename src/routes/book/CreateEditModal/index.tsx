import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import { Author, Book, Category, Publisher } from '../../../utils/constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authorApi, bookApi, categoryApi, publisherApi } from '../../../apis';
import { CreateBookDTO } from '../List';
import moment from 'moment';

interface IProps {
  id?: string;
  open: boolean;
  onCancel: () => void;
  onFinishFormModal: (value: CreateBookDTO) => void;
  isLoading: boolean;
}

export const CreateEditModal: React.FC<IProps> = (props) => {
  const { open, onCancel, id, onFinishFormModal, isLoading } = props;
  const [form] = useForm();
  const n = (key: keyof CreateBookDTO) => key;
  const [listAuthor, setListAuthor] = useState<Author[]>([]);
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const [listPublisher, setListPublisher] = useState<Publisher[]>([]);

  const { data: dataAuthor } = useQuery({
    queryKey: ['getListAuthor'],
    queryFn: () => authorApi.authorControllerGetAll(),
  });

  const { data: dataCategory } = useQuery({
    queryKey: ['getListCategory'],
    queryFn: () => categoryApi.categoryControllerGetAll(),
  });

  const { data: dataPublisher } = useQuery({
    queryKey: ['getListPublisher'],
    queryFn: () => publisherApi.publisherControllerGetAll(),
  });

  const detailMutation = useMutation((id: string) => bookApi.bookControllerGetOne(id), {
    onSuccess: (data: any) => {
      if (data.data) {
        const detail: Book = data.data;
        console.log('detail', detail);
        form.setFieldsValue(detail);
        if (detail.published_date) {
          form.setFieldValue(n('published_date'), moment(detail.published_date));
        }
      }
    },
    onError: (error) => {
      message.error('update failed');
    },
  });

  const onFinish = (value: CreateBookDTO) => {
    console.log('value', value);
    onFinishFormModal(value);
  };

  const onFinishFailed = () => {};

  useEffect(() => {
    if (dataAuthor?.data) {
      setListAuthor(dataAuthor?.data || []);
    }
  }, [dataAuthor]);

  useEffect(() => {
    if (dataCategory?.data) {
      setListCategory(dataCategory?.data || []);
    }
  }, [dataCategory]);

  useEffect(() => {
    if (dataPublisher?.data) {
      setListPublisher(dataPublisher?.data || []);
    }
  }, [dataPublisher]);

  useEffect(() => {
    if (id) {
      detailMutation.mutate(id);
    }
  }, [id]);

  return (
    <Modal title={`${!id ? 'Create' : 'Edit'} book`} open={open} onCancel={onCancel} footer={false}>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
        <Form.Item
          name={n('title')}
          label={<span style={{ textTransform: 'capitalize' }}>title</span>}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={n('page_number')}
          label={<span style={{ textTransform: 'capitalize' }}>page number</span>}
          rules={[{ required: true }]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item
          name={n('price')}
          label={<span style={{ textTransform: 'capitalize' }}>price</span>}
          rules={[{ required: true }]}
        >
          <Input type="number" min={0} suffix={'VND'} />
        </Form.Item>

        <Form.Item
          name={n('published_date')}
          label={<span style={{ textTransform: 'capitalize' }}>Publish date</span>}
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name={n('author')}
          label={<span style={{ textTransform: 'capitalize' }}>Author</span>}
          rules={[{ required: true }]}
        >
          <Select
            style={{ width: '100%' }}
            options={listAuthor.map((author) => ({
              label: author.firstName + ' ' + author.lastName,
              value: author._id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name={n('category')}
          label={<span style={{ textTransform: 'capitalize' }}>Category</span>}
          rules={[{ required: true }]}
        >
          <Select
            style={{ width: '100%' }}
            options={listCategory.map((cate) => ({
              label: cate.name,
              value: cate._id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name={n('publisher')}
          label={<span style={{ textTransform: 'capitalize' }}>Publisher</span>}
          rules={[{ required: true }]}
        >
          <Select
            style={{ width: '100%' }}
            options={listPublisher.map((publisher) => ({
              label: publisher.name,
              value: publisher._id,
            }))}
          />
        </Form.Item>

        <Button htmlType="submit" type="primary" style={{ width: '100%' }} loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  );
};
