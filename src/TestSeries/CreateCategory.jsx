import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Table, message } from "antd";
import Swal from "sweetalert2";
import { DeleteOutlined} from "@ant-design/icons";
import {
  createVTCategory,
  getAllVTCategories,
  updateVTCategory,
  deleteVTCategory,
} from "./TestSeriesAPI";

const CreateCategory = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllVTCategories();
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    setEditingId(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setIsModalOpen(true);
    setEditingId(record.id);
    form.setFieldsValue({
      category: record.category,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const onFinish = async (values) => {
    try {
      if (editingId) {
        await updateVTCategory(editingId, values);
        Swal.fire({
          title: "Success!",
          text: "Category updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        await createVTCategory(values);
        Swal.fire({
          title: "Success!",
          text: "Category created successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to save category"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteVTCategory(id);
        Swal.fire(
          "Deleted!",
          "Your category has been deleted.",
          "success"
        );
        fetchCategories();
      }
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record) => (
        <a onClick={() => handleEdit(record)}>{text}</a>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Add Category
      </Button>

      <Table
        columns={columns}
        bordered
        size="small"
        dataSource={[...categories].reverse()}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="category"
            label="Category Name"
            rules={[{ required: true, message: "Please input the category name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateCategory;