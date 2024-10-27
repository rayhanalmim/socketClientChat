import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ShortTextInput } from "@antopolis/admin-component-library/src/Components/Elements/Inputs/Inputs";
import { Button } from "@antopolis/admin-component-library/src/Components/ui/button";
import { FormWrapper } from '@antopolis/admin-component-library/src/Components/Form/Form';
import { useAxiosInstance } from "../../../Hooks/Instances/useAxiosInstance";
import { COURSE_CATEGORY_APIS } from "./CourseCategoryAPIS";

export function CreateOrUpdateCourseCategory({ id = null, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    name: '',
    description: '',
  });
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    if (id) {
      fetchCategoryData(id);
    }
  }, [id]);

  async function fetchCategoryData(id) {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`${COURSE_CATEGORY_APIS}/${id}`);
      if (response.status === 200) {
        setDefaultValues({
          name: response.data.name || '',
          description: response.data.description || '',
        });
      } else {
        console.error("Failed to fetch course category:", response.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);

    try {
      setIsLoading(true);

      const response = id
        ? await axiosInstance.put(`${COURSE_CATEGORY_APIS}/${id}`, formData)
        : await axiosInstance.post(COURSE_CATEGORY_APIS, formData);

      if (response.status === 200) {
        console.log(`Course category ${id ? 'updated' : 'created'} successfully:`, response.data);
      } else {
        console.error(`Failed to ${id ? 'update' : 'create'} course category:`, response.data);
      }
    } catch (error) {
      console.error("Operation error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  

  return (
    <FormWrapper
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      {...props}
    >
      <div className="grid gap-2">
        <ShortTextInput
          name="name"
          label="Name"
          placeholder="Enter category name"
          rules={{ required: "Name is required" }}
          className="space-y-1"
        />

        <ShortTextInput
          name="description"
          label="Description"
          placeholder="Enter category description"
          rules={{ required: "Description is required" }}
          className="space-y-1"
        />

        <Button className="mt-2" loading={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            id ? "Update Category" : "Create Category"
          )}
        </Button>
      </div>
    </FormWrapper>
  );
}
