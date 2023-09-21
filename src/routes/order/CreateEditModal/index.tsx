import { Button, Card, DatePicker, Form, Input, Modal, Select, Space, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import { Author, Book, Category, Order, Publisher } from '../../../utils/constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authorApi, bookApi, categoryApi, orderApi, publisherApi } from '../../../apis';
import moment from 'moment';
import TextArea from 'antd/es/input/TextArea';
import { BookItems, CreateOrderDTO } from '../List';
import { CloseOutlined } from '@ant-design/icons';

interface IProps {
  id?: string;
  open: boolean;
  onCancel: () => void;
  onFinishFormModal: (value: CreateOrderDTO) => void;
  isLoading: boolean;
}

export const CreateEditModal: React.FC<IProps> = (props) => {
  const { open, onCancel, id, onFinishFormModal, isLoading } = props;
  const [form] = useForm();
  const n = (key: keyof CreateOrderDTO) => key;
  const nBook = (key: keyof BookItems) => key;
  const [listBook, setListBook] = useState<Book[]>([]);

  const { data: dataBook } = useQuery({
    queryKey: ['getListBook'],
    queryFn: () => bookApi.bookControllerGetAll(),
  });

  const detailMutation = useMutation((id: string) => orderApi.orderControllerGetOne(id), {
    onSuccess: (data: any) => {
      if (data.data) {
        const detail: Order = data.data;
        console.log('detail', detail);
        form.setFieldsValue(detail);
      }
    },
    onError: (error) => {
      message.error('update failed');
    },
  });

  const onFinish = (value: CreateOrderDTO) => {
    console.log('value', value);
    onFinishFormModal(value);
  };

  const onFinishFailed = () => {};

  useEffect(() => {
    if (id) {
      detailMutation.mutate(id);
    }
  }, [id]);

  useEffect(() => {
    if (dataBook?.data) {
      setListBook(dataBook?.data);
    }
  }, [dataBook]);

  return (
    <Modal title={`${!id ? 'Create' : 'Edit'} book`} open={open} onCancel={onCancel} footer={false}>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
        <Form.Item
          name={n('customerName')}
          label={<span style={{ textTransform: 'capitalize' }}>Customer Name</span>}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={n('customerPhoneNumber')}
          label={<span style={{ textTransform: 'capitalize' }}>Customer Phone Number</span>}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <p>
          <span style={{ textTransform: 'capitalize' }}>Ordered Books</span>
        </p>
        <Form.List
          name={n('items')}
          rules={[
            {
              validator: (_, value) => {
                const v = value;
                console.log('value', v);
                if (!v) {
                  return Promise.reject('Vui lòng nhập đầy đủ thông tin');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Item ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                >
                  <Form.Item
                    name={[field.name, nBook('book')]}
                    label={<span style={{ textTransform: 'capitalize' }}>Book: </span>}
                    rules={[{ required: true, message: 'hãy chọn sách' }]}
                  >
                    <Select
                      showSearch
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      style={{ width: '100%' }}
                      options={listBook.map((book) => ({
                        label: book.title,
                        value: book._id,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, nBook('quantity')]}
                    label={<span style={{ textTransform: 'capitalize' }}>Quantity: </span>}
                    rules={[{ required: true, message: 'hãy nhập số lượng' }]}
                  >
                    <Input
                      type="number"
                      min={1}
                      onChange={(e) => {
                        if (e.target.value && Number(e.target.value) < 1) {
                          const items: BookItems[] = form.getFieldValue(n('items'));
                          const currentValue = items[field.name];
                          items[field.name] = {
                            ...currentValue,
                            quantity: 1,
                          };
                          form.setFieldValue(n('items'), [...items]);
                        }
                      }}
                    />
                  </Form.Item>
                </Card>
              ))}

              <Button type="dashed" onClick={() => add()} block style={{ marginBottom: '20px' }}>
                + Add Item
              </Button>
            </div>
          )}
        </Form.List>

        <Button htmlType="submit" type="primary" style={{ width: '100%' }} loading={isLoading}>
          Submit
        </Button>
      </Form>
    </Modal>
  );
};
