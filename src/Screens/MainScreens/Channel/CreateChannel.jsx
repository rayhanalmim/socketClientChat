import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  SelectInput,
  ShortTextInput,
  TextAreaInput,
} from "@antopolis/admin-component-library/dist/inputs";
import { FormWrapper } from "@antopolis/admin-component-library/dist/form";
import axiosChannelInstance from "../../../Hooks/Instances/useAxiosCourseInstance";
import { COURSE_APIS } from "./APIs/CourseAPIs";

import { Button } from "@antopolis/admin-component-library/dist/ui";

// eslint-disable-next-line react/prop-types
export default function CreateChannel({ setCreateModal, toggleFetch, ...props }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data) {
    console.log('data', data);

    try {
      setIsLoading(true);
      toggleFetch(false);

      const response = await axiosChannelInstance.post(COURSE_APIS, data);

      if (response.status === 201) {
        console.log("Channel created successfully:", response.data);
        toggleFetch(true); // Refetch the data after successful creation
        setCreateModal(false); // Close the modal
      } else {
        console.error("Failed to create channel:", response.data);
      }
    } catch (error) {
      console.error("Error during channel creation:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormWrapper onSubmit={handleSubmit} {...props}>
      <div className="grid gap-2">
        <ShortTextInput
          name="name"
          label="Channel Name"
          placeholder="Enter Channel name"
          rules={{ required: "Name is required" }}
          className="space-y-1"
        />

        <TextAreaInput
          name="description"
          label="Channel Description"
          placeholder="Enter Channel Description"
          rules={{ required: "Channel Description is required" }}
          className="space-y-1"
        />

        <SelectInput
          name="isPrivate"
          label="Channel Category"
          placeholder="Select Channel Category"
          options={[
            { value: false, label: "Public Chat" },
            { value: true, label: "Private Chat" },
          ]}
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
