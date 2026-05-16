// ==============================
// ✅ CreateSection.jsx
// ==============================

import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Table, message } from "antd";
import Swal from "sweetalert2";
import { DeleteOutlined } from "@ant-design/icons";

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

  // ================= FETCH =================
  const fetchSections = async () => {
    try {
      setLoading(true);

      console.log("Fetching sections...");

      const response = await getAllSections();

      console.log("Sections fetched:", response.data);

      setSections(response.data || []);
    } catch (error) {
      console.error("Error fetching sections:", error);

      message.error("Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  // ================= OPEN MODAL =================
  const showModal = () => {
    setIsModalOpen(true);

    setEditingId(null);

    form.resetFields();
  };

  // ================= EDIT =================
  const handleEdit = (record) => {
    setIsModalOpen(true);

    setEditingId(record.id);

    form.setFieldsValue({
      section: record.name,
    });
  };

  // ================= CLOSE MODAL =================
  const handleCancel = () => {
    setIsModalOpen(false);

    form.resetFields();

    setEditingId(null);
  };

  // ================= SAVE =================
  const onFinish = async (values) => {
    try {
      console.log(
        "Saving section:",
        values,
        "Edit mode:",
        editingId
      );

      // UPDATE
      if (editingId) {
        await updateSection(editingId, {
          name: values.section,
        });

        Swal.fire({
          title: "Success!",
          text: "Section updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      }

      // CREATE
      else {
        await createSection({
          name: values.section,
        });

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
      console.error("Error saving section:", error);

      message.error(
        error.response?.data?.message ||
          "Failed to save section"
      );
    }
  };

  // ================= DELETE =================
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
        console.log("Deleting section:", id);

        await deleteSection(id);

        Swal.fire(
          "Deleted!",
          "Your section has been deleted.",
          "success"
        );

        fetchSections();
      }
    } catch (error) {
      console.error("Error deleting section:", error);

      message.error("Failed to delete section");
    }
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },

    {
      title: "Section",
      dataIndex: "name",
      key: "name",

      render: (text, record) => (
        <a onClick={() => handleEdit(record)}>{text}</a>
      ),
    },

    {
      title: "Action",
      key: "action",
      width: 120,

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
      {/* ================= ADD BUTTON ================= */}

      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        Add Section
      </Button>

      {/* ================= TABLE ================= */}

      <Table
        columns={columns}
        bordered
        size="small"
        dataSource={[...sections].reverse()}
        rowKey="id"
        loading={loading}
        pagination={{
          placement: "bottomRight",
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [
            "1",
            "10",
            "25",
            "50",
            "100",
            "500",
            "1000",
          ],

          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />

      {/* ================= MODAL ================= */}

      <Modal
        title={
          editingId
            ? "Edit Section"
            : "Add Section"
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="section"
            label="Section Name"
            rules={[
              {
                required: true,
                message:
                  "Please input the section name!",
              },
            ]}
          >
            <Input placeholder="Enter section name" />
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