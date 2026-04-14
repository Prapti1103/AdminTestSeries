import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Table, message, Spin } from "antd";
import Swal from "sweetalert2";
import { LoadingOutlined , DeleteOutlined} from "@ant-design/icons";
import {
  createSection,
  getAllSections,
  updateSection,
  deleteSection,
} from "./TestSeriesAPI";

const CreateSection = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await getAllSections();
      setSections(response.data);
    } catch (error) {
      message.error("Failed to fetch sections");
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
      section: record.section,
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
        await updateSection(editingId, values);
        Swal.fire({
          title: "Success!",
          text: "Section updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        await createSection(values);
        Swal.fire({
          title: "Success!",
          text: "Section created successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchSections();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to save section"
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
        await deleteSection(id);
        Swal.fire(
          "Deleted!",
          "Your section has been deleted.",
          "success"
        );
        fetchSections();
      }
    } catch (error) {
      message.error("Failed to delete section");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
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
        Add Section
      </Button>

      <Table
        columns={columns}
        bordered
        size="small"
        dataSource={[...sections].reverse()}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? "Edit Section" : "Add Section"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="section"
            label="Section Name"
            rules={[{ required: true, message: "Please input the section name!" }]}
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

export default CreateSection;