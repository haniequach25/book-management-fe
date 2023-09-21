import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Empty, Input, Popconfirm, Row, Table, message } from 'antd';
import { ColumnType } from 'antd/es/table';
import moment from 'moment';
import { bookApi, publisherApi } from '../../../apis';
import { Book, Publisher, SearchFilter } from '../../../utils/constants';
import { CreateEditModal } from '../CreateEditModal';
import { formatPhoneNumber } from '../../../utils';

export interface CreatePublisherDTO {
  name?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}

const PublisherList = () => {
  const [listData, setListData] = useState<Publisher[]>();
  const [currentId, setCurrentId] = useState<string>();
  const [isOpenCreateEdit, setIsOpenCreateEdit] = useState<boolean>(false);
  const [filter, setFilter] = useState<SearchFilter>({
    fullTextSearch: undefined,
  });

  const { data, refetch } = useQuery({
    queryKey: ['getList'],
    queryFn: () => publisherApi.publisherControllerGetAll({ params: filter }),
  });

  const createMutation = useMutation(
    (createDTO: CreatePublisherDTO) => publisherApi.publisherControllerCreate(createDTO),
    {
      onSuccess: ({ data }) => {
        refetch();
        onCancelModal();
      },
      onError: (error) => {
        message.error('create failed');
      },
    }
  );

  const editMutation = useMutation(
    (param: { id: string; updateDTO: CreatePublisherDTO }) =>
      publisherApi.publisherControllerUpdate(param.id, param.updateDTO),
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

  const deleteMutation = useMutation((id: string) => publisherApi.publisherControllerDelete(id), {
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

  const onFinishFormModal = (value: CreatePublisherDTO) => {
    if (!currentId) {
      createMutation.mutate(value);
    } else {
      editMutation.mutate({ id: currentId, updateDTO: value });
    }
  };

  const columns: ColumnType<Publisher>[] = [
    {
      align: 'center',
      dataIndex: '_id',
      key: 0,
      title: '#',
      render: (value) => <span>{value}</span>,
    },
    {
      align: 'center',
      dataIndex: 'name',
      key: 1,
      title: 'Name',
      render: (value) => <span>{value}</span>,
    },
    {
      align: 'center',
      dataIndex: 'address',
      key: 2,
      title: 'Address',
      render: (value) => <span>{value || '...'}</span>,
    },
    {
      align: 'center',
      dataIndex: 'phoneNumber',
      key: 3,
      title: 'Phone Number',
      render: (value) => <span>{value ? formatPhoneNumber(value) : '...'}</span>,
    },
    {
      align: 'center',
      dataIndex: 'email',
      key: 4,
      title: 'Email',
      render: (value) => <span>{value ? value : '...'}</span>,
    },
    {
      align: 'center',
      key: 8,
      render: (value, record: Publisher) => (
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
              <h3>Publisher Management</h3>
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

export default PublisherList;
