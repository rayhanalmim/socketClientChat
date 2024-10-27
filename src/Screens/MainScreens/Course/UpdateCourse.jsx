// UpdateCourse.jsx

import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  SelectInput,
  ShortTextInput,
} from "@antopolis/admin-component-library/src/Components/Elements/Inputs/Inputs";
import { Button } from "@antopolis/admin-component-library/src/Components/ui/button";
import { FormWrapper } from "@antopolis/admin-component-library/src/Components/Form/Form";
import { useAxiosInstance } from "../../../Hooks/Instances/useAxiosInstance";
import { COURSE_APIS } from "./CourseAPIs";
import { COURSE_CATEGORY_APIS } from "../CourseCategory/CourseCategoryAPIS";
import { COURSE_SUB_CATEGORY_APIS } from "../CourseSubCategory/CourseSubCategoryAPIS";

export default function UpdateCourse({ id = null, setEditModal, toggleFetch, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  const axiosInstance = useAxiosInstance();

  // Default form values
  const [defaultValues, setDefaultValues] = useState({
    courseName: '',
    platform: '',
    category: '',
    subCategory: '',
  });

  /**
   * Fetch Existing Course Data
   */
  useEffect(() => {
    if (id) {
      fetchCourseData(id);
    }
  }, [id]);

  async function fetchCourseData(id) {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`${COURSE_APIS}/${id}`);
      if (response.status === 200) {
        const courseData = response.data;
        setDefaultValues({
          courseName: courseData.courseName || '',
          platform: courseData.platform || '',
          category: courseData.category._id || '',
          subCategory: courseData.subCategory._id || '',
        });
        setSelectedCategory(courseData.category._id || '');
      } else {
        console.error("Failed to fetch course:", response.data);
        setError("Failed to fetch course data.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("An error occurred while fetching course data.");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Fetch Categories on Component Mount
   */
  useEffect(() => {
    fetchCategories();
  }, []); // Empty dependency array ensures this runs once on mount

  async function fetchCategories() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${COURSE_CATEGORY_APIS}?filter=active`
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories.");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Fetch Subcategories when Selected Category Changes
   */
  useEffect(() => {
    // Reset subcategories when category changes
    setSubcategories([]);
    setDefaultValues((prevValues) => ({
      ...prevValues,
      subCategory: '',
    }));

    if (!selectedCategory) return;

    fetchSubcategories(selectedCategory);
  }, [selectedCategory]);

  async function fetchSubcategories(categoryId) {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${COURSE_SUB_CATEGORY_APIS}?filter=active&category=${categoryId}`
      );
      setSubcategories(response.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError("Failed to fetch subcategories.");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handle Form Submission
   */
  async function handleSubmit(data) {
    const formData = new FormData();
    formData.append("courseName", data.courseName);
    formData.append("platform", data.platform);
    formData.append("category", data.category);
    formData.append("subcategory", data.subCategory); // Ensure consistency

    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(`${COURSE_APIS}/${id}`, formData);

      if (response.status === 200) {
        toggleFetch();
        setEditModal(false);
        console.log(`Course updated successfully:`, response.data);
      } else {
        console.error(`Failed to update course:`, response.data);
        setError(`Failed to update course.`);
      }
    } catch (error) {
      setError("An error occurred while updating the course.");
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handle Category Selection Change
   */
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };



  return (
    <FormWrapper
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      {...props}
    >
      <div className="grid gap-2">
        {/* Course Name Input */}
        <ShortTextInput
          name="courseName"
          label="Name"
          placeholder="Enter course name"
          rules={{ required: "Name is required" }}
          className="space-y-1"
        />

        {/* Platform Input */}
        <ShortTextInput
          name="platform"
          label="Platform"
          placeholder="Enter course platform"
          rules={{ required: "Platform is required" }}
          className="space-y-1"
        />

        {/* Category Select */}
        <SelectInput
          name="category"
          label="Category"
          placeholder="Select Category"
          rules={{ required: "Category is required" }}
          options={categories.map((item) => ({
            value: item._id,
            label: item.name,
          }))}
          onChange={handleCategoryChange}
        />

        {/* Subcategory Select */}
        <SelectInput
          name="subCategory" // Ensure name matches form data
          label="Subcategory"
          placeholder="Select Subcategory"
          rules={{ required: "Subcategory is required" }}
          options={subcategories.map((item) => ({
            value: item._id,
            label: item.name,
          }))}
          disabled={!selectedCategory} // Disable until category is selected

        />

        {/* Display Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Submit Button */}
        <Button className="mt-2" loading={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Update Course"
          )}
        </Button>
      </div>
    </FormWrapper>
  );
}
