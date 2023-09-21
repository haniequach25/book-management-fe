import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Empty, Input, Popconfirm, Row, Table, message } from 'antd';
import { ColumnType } from 'antd/es/table';
import moment from 'moment';
import { bookApi } from '../../../apis';
import { Book, SearchFilter } from '../../../utils/constants';
import { CreateEditModal } from '../CreateEditModal';

export interface CreateBookDTO {
  title?: string;
  page_number?: number;
  price?: number;
  published_date?: Date | string;
  created_at?: Date;
  author?: string;
  category?: string;
  publisher?: string;
}

const BookList = () => {
  const [listData, setListData] = useState<Book[]>();
  const [currentId, setCurrentId] = useState<string>();
  const [isOpenCreateEdit, setIsOpenCreateEdit] = useState<boolean>(false);
  const [filter, setFilter] = useState<SearchFilter>({
    fullTextSearch: undefined,
  });

  const { data, refetch } = useQuery({
    queryKey: ['getList'],
    queryFn: () => bookApi.bookControllerGetAll({ params: filter }),
  });

  const createMutation = useMutation((createDTO: CreateBookDTO) => bookApi.bookControllerCreate(createDTO), {
    onSuccess: ({ data }) => {
      refetch();
      onCancelModal();
    },
    onError: (error) => {
      message.error('create failed');
    },
  });

  const editMutation = useMutation(
    (param: { id: string; updateDTO: CreateBookDTO }) => bookApi.bookControllerUpdate(param.id, param.updateDTO),
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

  const deleteMutation = useMutation((id: string) => bookApi.bookControllerDetele(id), {
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

  const onFinishFormModal = (value: CreateBookDTO) => {
    if (!currentId) {
      createMutation.mutate(value);
    } else {
      editMutation.mutate({ id: currentId, updateDTO: value });
    }
  };

  const columns: ColumnType<any>[] = [
    {
      align: 'center',
      dataIndex: '_id',
      key: 0,
      title: '#',
      render: (value) => <span>{value}</span>,
    },
    {
      align: 'center',
      dataIndex: 'title',
      key: 1,
      title: 'Title',
      filterSearch: true,
      render: (value) => <span>{value}</span>,
    },
    {
      align: 'center',
      dataIndex: 'page_number',
      key: 2,
      title: 'Page Number',
      render: (value) => <span>{value || '...'}</span>,
    },
    {
      align: 'center',
      dataIndex: 'price',
      key: 3,
      title: 'Price',
      render: (value) => (
        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}</span>
      ),
    },
    {
      align: 'center',
      dataIndex: 'published_date',
      key: 4,
      title: 'Published Date',
      render: (value) => <span>{value ? moment(value).format('DD/MM/YYYY') : '...'}</span>,
    },
    {
      align: 'center',
      dataIndex: 'author',
      key: 5,
      title: 'Author',
      render: (value, record) => <span>{`${record.author?.firstName} ${record.author?.lastName}`}</span>,
    },
    {
      align: 'center',
      dataIndex: 'category',
      key: 6,
      title: 'Category',
      render: (value, record) => <span>{record.category?.name}</span>,
    },
    {
      align: 'center',
      dataIndex: 'publisher',
      key: 7,
      title: 'Publisher',
      render: (value, record) => <span>{record.publisher?.name?.toUpperCase()}</span>,
    },
    {
      align: 'center',
      key: 8,
      render: (value, record: Book) => (
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

  return (
    <div className="container">
      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Row align="middle" justify="space-between" wrap>
            <Col span={12}>
              <h3>Book Management</h3>
            </Col>

            <Col span={12}>
              <Row justify="end" style={{ gap: '10px' }}>
                <Col>
                  <Input
                    placeholder="Search"
                    onChange={(e) =>
                      setFilter((prev) => ({
                        ...prev,
                        fullTextSearch: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      console.log('eeeeeeeeee', e.key);
                      if (e.key === 'Enter') {
                        refetch();
                      }
                    }}
                  />
                </Col>
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

export default BookList;
