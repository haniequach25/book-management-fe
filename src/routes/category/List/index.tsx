import React, { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Col, Empty, Popconfirm, Row, Table, message } from 'antd';
import { ColumnType } from 'antd/es/table';
import moment from 'moment';
import { bookApi, categoryApi } from '../../../apis';
import { Book, Category } from '../../../utils/constants';
import { CreateEditModal } from '../CreateEditModal';

export interface CreateCategoryDTO {
  name?: string;
}

const CategoryList = () => {
  const [listData, setListData] = useState<Category[]>();
  const [currentId, setCurrentId] = useState<string>();
  const [isOpenCreateEdit, setIsOpenCreateEdit] = useState<boolean>(false);

  const { data, refetch } = useQuery({
    queryKey: ['getList'],
    queryFn: () => categoryApi.categoryControllerGetAll(),
  });

  const createMutation = useMutation(
    (createDTO: CreateCategoryDTO) => categoryApi.categoryControllerCreate(createDTO),
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
    (param: { id: string; updateDTO: CreateCategoryDTO }) =>
      categoryApi.categoryControllerUpdate(param.id, param.updateDTO),
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

  const deleteMutation = useMutation((id: string) => categoryApi.categoryControllerDelete(id), {
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

  const onFinishFormModal = (value: CreateCategoryDTO) => {
    if (!currentId) {
      createMutation.mutate(value);
    } else {
      editMutation.mutate({ id: currentId, updateDTO: value });
    }
  };

  const columns: ColumnType<Category>[] = [
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
      title: 'Title',
      render: (value) => <span>{value}</span>,
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

  return (
    <div className="container">
      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Row align="middle" justify="space-between" wrap>
            <Col span={12}>
              <h3>Category Management</h3>
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

export default CategoryList;
