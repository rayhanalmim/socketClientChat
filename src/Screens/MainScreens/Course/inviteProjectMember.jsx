/* eslint-disable react/prop-types */
import { FormWrapper } from "@antopolis/admin-component-library/dist/form";
import { Loader2 } from "lucide-react";
import { Button } from "@antopolis/admin-component-library/dist/ui";
import { useState, useEffect } from "react";
import axiosChannelInstance from "../../../Hooks/Instances/useAxiosCourseInstance";
import { toast } from "sonner";
import Select from "react-select";
import { CMS_USER_API, PROJECT_MEMBERS_API } from "../Course/Utils/Apis";
import axios from "axios";

export default function InviteProjectMemberModal({ onClose, toggleFetch, id }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#888",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f0f0f0" : "#fff",
      color: "#000",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000",
    }),
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!searchTerm) {
        setProjects([]);
        return;
      }

      try {
        setLoadingMembers(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}api/employeeApp/search`,
          {
            params: { search: searchTerm },
          }
        );

        console.log(response.data);

        const formattedOptions = response.data.map((org) => ({
          value: org._id,
          label: org.name,
        }));

        console.log(formattedOptions);

        setProjects(response.data);
      } catch (error) {
        toast.error("Failed to load members. Please try again.");
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchProjects();
  }, [searchTerm, axiosChannelInstance]);

  const handleMemberSelect = (selectedOption) => {
    console.log("selected option", selectedOption);
    setSelectedMemberId(selectedOption?.value || null);
  };

  async function handleSubmit(data) {
    const toastId = toast.loading("Sending Invitation");

    try {
      setIsLoading(true);
      const payload = {
        ...data,
        channelId: id,
        cmsUser: selectedMemberId,
      };

      console.log(payload);

        const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}api/channel/addChannelMember`, payload);

        if (response.data) {
          toast.success('Invitation sent successfully', { id: toastId });
          toggleFetch();
          onClose();
        }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send invitation",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Select
          options={projects}
          placeholder="Search and select a member"
          isLoading={loadingMembers}
          onInputChange={(inputValue) => setSearchTerm(inputValue)}
          onChange={handleMemberSelect} // Fixed: `handleMemberSelect` is now defined.
          isDisabled={isLoading}
          styles={customStyles}
          isClearable
          isSearchable
        />

        <Button
          className="mt-2"
          loading={isLoading}
          disabled={!selectedMemberId}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Send Invitation"
          )}
        </Button>
      </div>
    </FormWrapper>
  );
}
