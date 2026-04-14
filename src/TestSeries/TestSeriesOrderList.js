import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Spin,
  message,
  Tag,
  Input,
  DatePicker,
  Row,
  Col,
  Space,
  Select,
  Modal,
} from "antd";
import { getAllTestSeriesOrders } from "./TestSeriesAPI";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const TestSeriesOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const [pageSize, setPageSize] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getAllTestSeriesOrders();
        const sortedData = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedData);
        setFilteredOrders(sortedData);
      } catch (error) {
        message.error("Failed to load test series orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply Search + Date Filters
  useEffect(() => {
    let data = [...orders];

    // Search by name, email, or phone
    if (searchText) {
      data = data.filter(
        (item) =>
          (item.customerName &&
            item.customerName.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.customerEmail &&
            item.customerEmail.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.customerPhone &&
            item.customerPhone.toString().includes(searchText))
      );
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      data = data.filter((item) => {
        const orderDate = dayjs(item.createdAt);
        return (
          orderDate.isAfter(start.startOf("day")) &&
          orderDate.isBefore(end.endOf("day"))
        );
      });
    }

    setFilteredOrders(data);
  }, [searchText, dateRange, orders]);

  // Table Columns
  const columns = [
    {
      title: "Sr. No",
      key: "srNo",
      render: (_, __, index) => index + 1,
    },
    {
      title: "User Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "User Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 140,
    },
    {
      title: "Contact",
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `₹ ${text}`,
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        if (!status) return <Tag color="default">UNKNOWN</Tag>;
        const upperStatus = status.toUpperCase();
        const color = upperStatus === "PAID" ? "green" : "volcano";
        return <Tag color={color}>{upperStatus}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Test Series Name",
      dataIndex: ["testSeries", "examTitle"],
      key: "testSeriesName",
    },
{
  title: "Description",
  key: "description",
  align: "center",
  render: (_, record) => (
    <Typography.Link
      onClick={() => {
        setSelectedDescription(
          record?.testSeries?.description ||
            "<p>No description available.</p>"
        );
        setDescModalOpen(true);
      }}
    >
      View
    </Typography.Link>
  ),
},

  ];

  return (
    <div style={{ margin: "10px" }}>
      {/* Filters Row */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Input.Search
              placeholder="Search by Name, Email, or Phone"
              allowClear
              onSearch={(val) => setSearchText(val)}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <RangePicker onChange={(values) => setDateRange(values)} />
          </Space>
        </Col>
        <Col>
          <Typography.Text >
            Total Records: {filteredOrders.length}
          </Typography.Text>
        </Col>
      </Row>

      {loading ? (
        <Spin tip="Loading Test Series Orders..." size="large" />
      ) : (
        <Table
          size="small"
          columns={columns}
          dataSource={filteredOrders}
          rowKey="orderId"
          bordered
          pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
        />
      )}

      <div style={{ textAlign: "left", marginBottom: 10 }}>
        <span style={{ fontSize: "13px", color: "#666", marginRight: 8 }}>
          Rows per page:
        </span>
        <Select
          value={pageSize}
          onChange={(value) => {
            setPageSize(value);
            setCurrentPage(1);
          }}
          style={{ width: 80 }}
        >
          <Select.Option value={1000}>1000</Select.Option>
          <Select.Option value={5000}>5000</Select.Option>
          <Select.Option value={10000}>10000</Select.Option>
        </Select>
      </div>
      <Modal
  open={descModalOpen}
  title="Test Series Description"
  onCancel={() => setDescModalOpen(false)}
  footer={null}
  width={700}
>
  <div
    style={{
      fontSize: "14px",
      lineHeight: 1.7,
      maxHeight: "60vh",
      overflowY: "auto",
    }}
    dangerouslySetInnerHTML={{ __html: selectedDescription }}
  />
</Modal>

    </div>
  );
};

export default TestSeriesOrderList;
