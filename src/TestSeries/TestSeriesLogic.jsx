// TestSeriesLogic.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getAllVTCategories,
  getAllTestSeries,
  createTestSeries,
  updateTestSeries,
  deleteTestSeries,
  getTestPapersByTestSeries,
  uploadTestSeriesImage,
  updateTestSeriesImage,
} from "./TestSeriesAPI";

export function useTestSeries() {
  const [testSeries, setTestSeries] = useState({
    examTitle: "",
    description: "",
    pricing: "",
    mrp: "",
    status: false,
    validity: "",
    testFeatureOne: "",
    testFeatureTwo: "",
    testFeatureThree: "",
    category: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [selectedTestSeries, setSelectedTestSeries] = useState(null);
  const [createdTestSeriesId, setCreatedTestSeriesId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [testPapers, setTestPapers] = useState([]);
  const [showTestPapers, setShowTestPapers] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");


  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getAllVTCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch test series
  const fetchTestSeries = async () => {
    try {
      const response = await getAllTestSeries();
      setTestSeriesList(response.data);
    } catch (error) {
      console.error("Error fetching test series:", error);
    }
  };

  // Fetch test papers for a test series
  const fetchTestPapers = async (testSeriesId) => {
    try {
      const response = await getTestPapersByTestSeries(testSeriesId);
      const papers = Array.isArray(response.data) ? response.data : [];
      setTestPapers(papers);
      setShowTestPapers(true);
    } catch (error) {
      console.error("Error fetching test papers:", error);
      Swal.fire("Error", "Failed to fetch test papers", "error");
      setTestPapers([]); // set empty on error
      setShowTestPapers(true);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setTestSeries((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  // Submit create or update test series
  const handleSubmit = async () => {
    try {
      let response;
      if (selectedTestSeries) {
        response = await updateTestSeries(selectedTestSeries.id, testSeries);
      } else {
        response = await createTestSeries(testSeries);
      }
      Swal.fire(
        "Success",
        selectedTestSeries ? "Test Series Updated!" : "Test Series Created!",
        "success"
      );
      await fetchTestSeries();
      setCreatedTestSeriesId(response.data.id);
      resetForm();
      setShowForm(false);
    } catch (error) {
      Swal.fire("Error", "Failed to process request", "error");
    }
  };

  // Delete test series
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTestSeries(id);
          setTestSeriesList((prev) => prev.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Test series has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete test series.", "error");
        }
      }
    });
  };

  // Handle update (populate form)
  const handleUpdate = (test) => {
    setSelectedTestSeries(test);
    setTestSeries(test);
    setShowForm(true);
  };

  const resetForm = () => {
    setTestSeries({
      examTitle: "",
      description: "",
      pricing: "",
      mrp: "",
      status: false,
      validity: "",
      testFeatureOne: "",
      testFeatureTwo: "",
      testFeatureThree: "",
      category: "",
      image: null,
    });
    setSelectedTestSeries(null);
  };

  // Upload image for new test series
  const uploadImage = async (id, isUpdate = false) => {
    if (!testSeries.image) {
      Swal.fire("Error", "Please select an image to upload", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", testSeries.image);

    try {
      if (isUpdate) {
        await updateTestSeriesImage(id, formData);
      } else {
        await uploadTestSeriesImage(id, formData);
      }
      Swal.fire(
        "Success",
        isUpdate
          ? "Image updated successfully!"
          : "Image uploaded successfully!",
        "success"
      );
      await fetchTestSeries();
    } catch (error) {
      Swal.fire("Error", "Failed to process image", "error");
    }
  };

  return {
    testSeries,
    setTestSeries,
    categories,
    testSeriesList,
    fetchCategories,
    fetchTestSeries,
    fetchTestPapers,
    handleChange,
    handleSubmit,
    handleDelete,
    handleUpdate,
    resetForm,
    showForm,
    setShowForm,
    selectedTestSeries,
    setSelectedTestSeries,
    testPapers,
    setTestPapers,
    showTestPapers,
    setShowTestPapers,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    uploadImage,
    createdTestSeriesId,
  };
}
