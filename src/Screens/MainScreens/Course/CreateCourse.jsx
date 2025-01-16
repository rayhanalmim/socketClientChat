import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  SelectInput,
  ShortTextInput,
} from "@antopolis/admin-component-library/dist/inputs";
import { FormWrapper } from "@antopolis/admin-component-library/dist/form";
import { useAxiosInstance } from "../../../Hooks/Instances/useAxiosInstance";
import { COURSE_APIS } from "./CourseAPIs";
import { COURSE_CATEGORY_APIS } from "../CourseCategory/CourseCategoryAPIS";
import { COURSE_SUB_CATEGORY_APIS } from "../CourseSubCategory/CourseSubCategoryAPIS";

import { Button } from "@antopolis/admin-component-library/dist/ui";

export default function CreateCourse({
  setCreateModal,
  toggleFetch,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);

  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    async function fetchData() {
      const { data: categoriesData } = await axiosInstance.get(
        `${COURSE_CATEGORY_APIS}?filter=active`
      );
      setCategories(categoriesData);

      if (category) {
        const { data: subcategoriesData } = await axiosInstance.get(
          `${COURSE_SUB_CATEGORY_APIS}?filter=active&category=${category}`
        );
        setSubcategories(subcategoriesData);
      }
    }
    fetchData();
  }, [category]);

  async function handleSubmit(data) {
    const formData = new FormData();

    formData.append("courseName", data.courseName);
    formData.append("platform", data.platform);
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(COURSE_APIS, formData);

      if (response.status === 200) {
        toggleFetch();
        setCreateModal(false);
        console.log("Course category created successfully:", response.data);
      } else {
        console.error("Failed to create course category:", response.data);
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleSubcategoryChange = (value) => {
    setSubcategory(value);
  };

  console.log(category);

  return (
    <FormWrapper onSubmit={handleSubmit} {...props}>
      <div className="grid gap-2">
        <ShortTextInput
          name="courseName"
          label="Channel Name"
          placeholder="Enter Channel name"
          rules={{ required: "Name is required" }}
          className="space-y-1"
        />
        <SelectInput
          name={"Type"}
          label={"Channel Type"}
          placeholder={"Select Channel Type"}
          options={[
            { value: "group", label: "Group Chat" },
            { value: "private", label: "Private Chat" },
          ]}
          onChange={handleCategoryChange}
          rules={{ required: "Room type is required" }}
        />

        <Button className="mt-2" loading={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Channel"
          )}
        </Button>
      </div>
    </FormWrapper>
  );
}
