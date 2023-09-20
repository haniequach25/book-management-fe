import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import moment from 'moment';

const BookList = () => {
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
      render: (value) => <span>{value}</span>,
    },
    {
      align: 'center',
      dataIndex: 'page_number',
      key: 2,
      title: 'Page Number',
      render: (value) => <span>{new Intl.NumberFormat('ja-JP').format(value)}</span>,
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
      render: (value) => <span>{moment(value).format('DD/MM/YYYY')}</span>,
    },
    {
      align: 'center',
      dataIndex: 'author',
      key: 5,
      title: 'Author',
      render: (value, record) => <span>{`${record.author.firstName} ${record.author.lastName}`}</span>,
    },
    {
      align: 'center',
      dataIndex: 'category',
      key: 6,
      title: 'Category',
      render: (value, record) => <span>{record.category.name}</span>,
    },
    {
      align: 'center',
      dataIndex: 'publisher',
      key: 7,
      title: 'Publisher',
      render: (value, record) => <span>{record.publisher.name.toUpperCase()}</span>,
    },
    {
      align: 'center',
      key: 8,
      render: (value, record) => (
        <Row>
          <Col span={12}>
            <Button type="primary">
              <EditOutlined /> Edit
            </Button>
          </Col>
          <Col span={12}>
            <Button danger>
              <DeleteOutlined /> Delete
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  const dataSource = [
    {
      _id: 1,
      title: 'Thiên tài bên trái, kẻ điên bên phải',
      page_number: 44156,
      price: 179000,
      published_date: '2023-09-15',
      author: {
        firstName: 'Cao',
        lastName: 'Minh',
      },
      category: {
        name: 'Trinh thám',
      },
      publisher: {
        name: 'nhà xuất bản thế giới',
      },
    },
  ];

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Row align="middle" justify="space-between" wrap>
          <Col span={12}>
            <h3>Book Manager</h3>
          </Col>

          <Col span={12}>
            <Row justify="end">
              <Col>
                <Button type="primary">
                  <PlusOutlined /> Add A Book
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
          dataSource={dataSource}
        />
      </Col>
    </Row>
  );
};

export default BookList;
