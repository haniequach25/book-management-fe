import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Empty, Popconfirm, Row, Table, message } from 'antd';
import { ColumnType } from 'antd/es/table';
import moment from 'moment';
import { bookApi, orderApi } from '../../../apis';
import { Book, Order } from '../../../utils/constants';
import { CreateEditModal } from '../CreateEditModal';

export interface BookItems {
  quantity: number;
  book: string;
  price: number;
}

export interface CreateOrderDTO {
  customerName: string;
  customerPhoneNumber: string;
  items: BookItems[];
  totalPrice?: number;
}

const OrderList = () => {
  const [listData, setListData] = useState<Order[]>();
  const [currentId, setCurrentId] = useState<string>();
  const [isOpenCreateEdit, setIsOpenCreateEdit] = useState<boolean>(false);
  const [listBook, setListBook] = useState<Book[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ['getList'],
    queryFn: () => orderApi.orderControllerGetAll(),
  });

  const { data: dataBook } = useQuery({
    queryKey: ['getListBook'],
    queryFn: () => bookApi.bookControllerGetAll(),
  });

  const createMutation = useMutation((createDTO: CreateOrderDTO) => orderApi.orderControllerCreate(createDTO), {
    onSuccess: ({ data }) => {
      refetch();
      onCancelModal();
    },
    onError: (error) => {
      message.error('create failed');
    },
  });

  const editMutation = useMutation(
    (param: { id: string; updateDTO: CreateOrderDTO }) => orderApi.orderControllerUpdate(param.id, param.updateDTO),
    {
      onSuccess: ({ data }) => {
        refetch();
        onCancelModal();
      },
      onError: (error) => {
        message.error('update failed');
      },
    }
  );

  const deleteMutation = useMutation((id: string) => orderApi.orderControllerDetele(id), {
    onSuccess: ({ data }) => {
      refetch();
      onCancelModal();
    },
    onError: (error) => {
      message.error('delete failed');
    },
  });

  const onClickCreateButton = () => {
    setCurrentId(undefined);
    setIsOpenCreateEdit(true);
  };

  const onClickEditButton = (value: string) => {
    setCurrentId(value);
    setIsOpenCreateEdit(true);
  };

  const onClickDeleteButton = (value: string) => {
    setCurrentId(value);
    deleteMutation.mutate(value);
  };

  const onCancelModal = () => {
    setIsOpenCreateEdit(false);
    setCurrentId(undefined);
  };

  const onFinishFormModal = (value: CreateOrderDTO) => {
    let totalPrice = 0;
    value.items?.forEach((item) => {
      console.log(
        'book',
        item.book,
        listBook.find((book) => book._id === item.book)
      );
      if (listBook && listBook.find((book) => book._id === item.book)) {
        const price = listBook.find((book) => book._id === item.book)?.price ?? 0;
        totalPrice += +Number(item.quantity ?? 1) * Number(price);
      }
    });
    if (!currentId) {
      createMutation.mutate({
        ...value,
        totalPrice,
      });
    } else {
      editMutation.mutate({
        id: currentId,
        updateDTO: {
          ...value,
          totalPrice,
        },
      });
    }
  };

  const columns: ColumnType<Order>[] = [
    {
      align: 'center',
      dataIndex: '_id',
      key: 0,
      title: '#',
      render: (value) => <span>{value}</span>,
    },
    {
      align: 'center',
      dataIndex: 'customerName',
      key: 1,
      title: 'Customer Name',
      render: (value) => <span>{value}</span>,
    },
    {
      align: 'center',
      dataIndex: 'customerPhoneNumber',
      key: 2,
      title: 'Customer Phone Number',
      render: (value) => <span>{value || '...'}</span>,
    },
    {
      align: 'center',
      key: 6,
      title: 'Quantity',
      render: (value, record) => <span>{record.items?.length ?? 0}</span>,
    },
    {
      align: 'center',
      key: 6,
      title: 'Total',
      render: (value, record) => <span>{Number(record.totalPrice || 0)} VND</span>,
    },
    {
      align: 'center',
      key: 8,
      render: (value, record) => (
        <Row>
          <Col span={12}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => (record._id ? onClickEditButton(record._id) : undefined)}
            >
              Edit
            </Button>
          </Col>
          <Col span={12}>
            <Popconfirm
              title="Delete"
              description="Are you sure to delete this task?"
              onConfirm={() => (record._id ? onClickDeleteButton(record._id) : undefined)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    if (data?.data) {
      setListData(data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (dataBook?.data) {
      setListBook(dataBook?.data);
    }
  }, [dataBook]);

  return (
    <div className="container">
      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Row align="middle" justify="space-between" wrap>
            <Col span={12}>
              <h3>Order Management</h3>
            </Col>

            <Col span={12}>
              <Row justify="end">
                <Col>
                  <Button type="primary" icon={<PlusOutlined />} onClick={onClickCreateButton}>
                    Add
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Table
            columns={columns}
            pagination={{
              pageSize: 10,
              position: ['bottomCenter'],
            }}
            locale={{
              emptyText: <Empty description="Empty" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
            }}
            rowKey="_id"
            dataSource={listData}
          />
        </Col>
      </Row>
      {isOpenCreateEdit && (
        <CreateEditModal
          open={isOpenCreateEdit}
          onCancel={onCancelModal}
          id={currentId}
          onFinishFormModal={onFinishFormModal}
          isLoading={createMutation.isLoading || editMutation.isLoading}
        />
      )}
    </div>
  );
};

export default OrderList;
