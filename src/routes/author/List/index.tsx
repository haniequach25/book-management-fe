import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Empty, Input, Popconfirm, Row, Table, message } from 'antd';
import { ColumnType } from 'antd/es/table';
import moment from 'moment';
import { authorApi, bookApi } from '../../../apis';
import { Author, Book, SearchFilter } from '../../../utils/constants';
import { CreateEditModal } from '../CreateEditModal';

export interface CreateAuthorDTO {
  firstName?: string;
  lastName?: string;
  dob?: Date;
  description?: string;
}

const AuthorList = () => {
  const [listData, setListData] = useState<Author[]>();
  const [currentId, setCurrentId] = useState<string>();
  const [isOpenCreateEdit, setIsOpenCreateEdit] = useState<boolean>(false);
  const [filter, setFilter] = useState<SearchFilter>({
    fullTextSearch: undefined,
  });

  const { data, refetch } = useQuery({
    queryKey: ['getList'],
    queryFn: () => authorApi.authorControllerGetAll({ params: filter }),
  });

  const createMutation = useMutation((createDTO: CreateAuthorDTO) => authorApi.authorControllerCreate(createDTO), {
    onSuccess: ({ data }) => {
      refetch();
      onCancelModal();
    },
    onError: (error) => {
      message.error('create failed');
    },
  });

  const editMutation = useMutation(
    (param: { id: string; updateDTO: CreateAuthorDTO }) => authorApi.authorControllerUpdate(param.id, param.updateDTO),
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

  const deleteMutation = useMutation((id: string) => authorApi.authorControllerDetele(id), {
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

  const onFinishFormModal = (value: CreateAuthorDTO) => {
    if (!currentId) {
      createMutation.mutate(value);
    } else {
      editMutation.mutate({ id: currentId, updateDTO: value });
    }
  };

  const columns: ColumnType<Author>[] = [
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
      title: 'Name',
      render: (value, record) => <span>{record.firstName + ' ' + record.lastName}</span>,
    },
    {
      align: 'center',
      dataIndex: 'dob',
      key: 4,
      title: 'Date of birth',
      render: (value) => <span>{value ? moment(value).format('DD/MM/YYYY') : '...'}</span>,
    },
    {
      align: 'center',
      dataIndex: 'description',
      key: 7,
      title: 'Description',
      render: (value, record) => <span>{value}</span>,
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
              <h3>Author Management</h3>
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

export default AuthorList;
