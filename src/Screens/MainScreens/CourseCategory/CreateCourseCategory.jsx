import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ShortTextInput, } from "@antopolis/admin-component-library/src/Components/Elements/Inputs/Inputs";
import { Button } from "@antopolis/admin-component-library/src/Components/ui/button";
import { FormWrapper } from '@antopolis/admin-component-library/src/Components/Form/Form';
import { useAxiosInstance } from "../../../Hooks/Instances/useAxiosInstance";
import { COURSE_CATEGORY_APIS } from "./CourseCategoryAPIS";

export function CreateCourseCategory({
    ...props
}) {

    const [isLoading, setIsLoading] = useState(false);
    const axiosInstance = useAxiosInstance()


    async function handleSubmit(data) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        try {
            setIsLoading(true);
            const response = await axiosInstance.post(COURSE_CATEGORY_APIS, formData,);

            if (response.status === 200) {
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

    return (
        <FormWrapper onSubmit={handleSubmit} {...props}>
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
                        "Create Category"
                    )}
                </Button>
            </div>
        </FormWrapper>
    );
}
