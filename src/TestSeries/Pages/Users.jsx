import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  message,
  Card,
} from "antd";
import { getAllUsers, createUser } from "../../API/AllApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  // ================= FILTER STATES =================
  const [searchText, setSearchText] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [boardFilter, setBoardFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  // ================= LOAD USERS =================
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();

      console.log("API RESPONSE 👉", res);
      console.log("DATA 👉", res.data);

      const userData =
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.content || [];

      console.log("FINAL USERS 👉", userData);

      setUsers(userData);

    } catch (err) {
      console.error(err);
      message.error("Failed to load users");
    }
  };

  useEffect(() => {
    // Fetch users on component mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  // ================= FILTER LOGIC =================
  const filteredUsers = users.filter((user) => {

    const matchesSearch =
      user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user?.mobNo?.includes(searchText);

    const matchesGender =
      !genderFilter || user?.gender === genderFilter;

    const matchesGroup =
      !groupFilter || user?.groupType === groupFilter;

    const matchesMedium =
      !mediumFilter || user?.medium === mediumFilter;

    const matchesBoard =
      !boardFilter || user?.board === boardFilter;

    const matchesClass =
      !classFilter ||
      String(user?.studentClass) === String(classFilter);

    const matchesDistrict =
      !districtFilter || user?.district === districtFilter;

    return (
      matchesSearch &&
      matchesGender &&
      matchesGroup &&
      matchesMedium &&
      matchesBoard &&
      matchesClass &&
      matchesDistrict
    );
  });

  // ================= CREATE USER =================
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      if (values.password !== values.confirmPassword) {
        message.error("Passwords do not match");
        return;
      }

      const payload = {
        name: values.name,
        mobNo: values.mobNo,
        password: values.password,
        gender: values.gender,
        groupType: values.groupType,
        medium: values.medium,
        board: values.board,
        studentClass: values.studentClass,
        district: values.district,
        school: "Admin Added"
      };

      console.log("CREATE PAYLOAD 👉", payload);

      await createUser(payload);

      message.success("User Created Successfully");

      setOpen(false);
      form.resetFields();
      fetchUsers();

    } catch (err) {
      console.error("CREATE ERROR 👉", err?.response?.data || err);
      message.error("Error creating user");
    }
  };

  // ================= TABLE =================
  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "Name", dataIndex: "name" },
    { title: "Mobile", dataIndex: "mobNo" },
    { title: "Gender", dataIndex: "gender" },
    { title: "Group", dataIndex: "groupType" },
    { title: "Medium", dataIndex: "medium" },
    { title: "Board", dataIndex: "board" },
    { title: "Class", dataIndex: "studentClass" },
    { title: "District", dataIndex: "district" },
    {
      title: "Amount",
      dataIndex: "paidAmount",
      render: (val) => `₹${val || 0}`
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      render: (text) => (
        <span
          style={{
            color:
              text === "SUCCESS"
                ? "green"
                : text === "FAILED"
                ? "red"
                : "orange",
            fontWeight: 600,
          }}
        >
          {text || "PENDING"}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>

      {/* TOP BUTTON */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <Button
          type="primary"
          onClick={() => setOpen(true)}
          style={{ minWidth: 150 }}
        >
          + Add User
        </Button>
      </div>

   {/* FILTERS */}
<Card
  style={{
    marginBottom: 16,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  }}
>

  <Row gutter={[8, 8]} align="middle">

    <Col flex="180px">
      <Input
        size="small"
        placeholder="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
      />
    </Col>

    <Col flex="95px">
      <Select
        size="small"
        placeholder="Gender"
        style={{ width: "100%" }}
        allowClear
        value={genderFilter || undefined}
        onChange={(value) => setGenderFilter(value || "")}
        options={[
          { value: "MALE", label: "Male" },
          { value: "FEMALE", label: "Female" },
          { value: "OTHER", label: "Other" },
        ]}
      />
    </Col>

    <Col flex="95px">
      <Select
        size="small"
        placeholder="Group"
        style={{ width: "100%" }}
        allowClear
        value={groupFilter || undefined}
        onChange={(value) => setGroupFilter(value || "")}
        options={[
          { value: "GROUP_A", label: "Group A" },
          { value: "GROUP_B", label: "Group B" },
        ]}
      />
    </Col>

    <Col flex="110px">
      <Select
        size="small"
        placeholder="Medium"
        style={{ width: "100%" }}
        allowClear
        value={mediumFilter || undefined}
        onChange={(value) => setMediumFilter(value || "")}
        options={[
          { value: "English", label: "English" },
          { value: "Marathi", label: "Marathi" },
          { value: "Semi English", label: "Semi English" },
        ]}
      />
    </Col>

    <Col flex="100px">
      <Select
        size="small"
        placeholder="Board"
        style={{ width: "100%" }}
        allowClear
        value={boardFilter || undefined}
        onChange={(value) => setBoardFilter(value || "")}
        options={[
          { value: "State Board", label: "State Board" },
          { value: "CBSE", label: "CBSE" },
          { value: "ICSE", label: "ICSE" },
        ]}
      />
    </Col>

    <Col flex="80px">
      <Select
        size="small"
        placeholder="Class"
        style={{ width: "100%" }}
        allowClear
        value={classFilter || undefined}
        onChange={(value) => setClassFilter(value || "")}
        options={[4,5,6,7,8,9,10].map(c => ({
          value: c,
          label: `${c}th`
        }))}
      />
    </Col>

    <Col flex="110px">
      <Select
        size="small"
        placeholder="District"
        style={{ width: "100%" }}
        allowClear
        value={districtFilter || undefined}
        onChange={(value) => setDistrictFilter(value || "")}
        options={[
          { value: "Pune", label: "Pune" },
          { value: "Mumbai", label: "Mumbai" },
          { value: "Nagpur", label: "Nagpur" },
          { value: "Nashik", label: "Nashik" },
        ]}
      />
    </Col>

    <Col flex="75px">
      <Button
        size="small"
        onClick={() => {
          setSearchText("");
          setGenderFilter("");
          setGroupFilter("");
          setMediumFilter("");
          setBoardFilter("");
          setClassFilter("");
          setDistrictFilter("");
        }}
        style={{ width: "100%" , backgroundColor: "#2f76c2", borderColor: "#d9d9d9",color:"white" }}
      >
        Reset
      </Button>
    </Col>

  </Row>
</Card>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{ pageSize: 8 }}
      />

      {/* MODAL */}
      <Modal
        title="Create User"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical">

          <Row gutter={[16, 16]}>

            <Col xs={24} md={12}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="mobNo" label="Mobile" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                <Select options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" }
                ]}/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="groupType" label="Group" rules={[{ required: true }]}>
                <Select options={[
                  { value: "GROUP_A", label: "Group A" },
                  { value: "GROUP_B", label: "Group B" }
                ]}/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="medium" label="Medium" rules={[{ required: true }]}>
                <Select options={[
                  { value: "English", label: "English" },
                  { value: "Marathi", label: "Marathi" },
                  { value: "Semi English", label: "Semi English" }
                ]}/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="board" label="Board" rules={[{ required: true }]}>
                <Select options={[
                  { value: "State Board", label: "State Board" },
                  { value: "CBSE", label: "CBSE" },
                  { value: "ICSE", label: "ICSE" }
                ]}/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="studentClass" label="Class" rules={[{ required: true }]}>
                <Select options={[4,5,6,7,8,9,10].map(c => ({
                  value: c,
                  label: `${c}th`
                }))}/>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="district" label="District" rules={[{ required: true }]}>
                <Select
                  showSearch
                  options={[
                    { value: "Pune", label: "Pune" },
                    { value: "Mumbai", label: "Mumbai" },
                    { value: "Nagpur", label: "Nagpur" },
                    { value: "Nashik", label: "Nashik" }
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="confirmPassword" label="Confirm Password">
                <Input.Password />
              </Form.Item>
            </Col>

          </Row>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexWrap: "wrap"
          }}>
            <Button type="primary" onClick={handleCreate}>
              Create
            </Button>

            <Button onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>

        </Form>
      </Modal>

    </div>
  );
}