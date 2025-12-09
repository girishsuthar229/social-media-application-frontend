"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IApiError } from "@/models/common.interface";
import { STATUS_CODES } from "@/util/constanst";
import { createPost } from "@/services/post-service.service";
import AddEditPost, { AddEditPostData } from "./components/addEditPost";

const CreatePost = () => {
  const router = useRouter();
  const [postLoading, setPostLoading] = useState(false);

  const handleSubmit = async (values: AddEditPostData) => {
    setPostLoading(true);
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof AddEditPostData];
      if (value !== null && value !== undefined) {
        if (key === "post_image") {
          if (value instanceof File) {
            formData.append(key, value);
          }
          return;
        } else {
          formData.append(key, String(value));
        }
      }
    });
    try {
      const response = await createPost(formData);
      if (response?.statusCode === STATUS_CODES.success) {
        toast.success(response.message);
        router.push("/home");
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message || "Failed to create post");
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <AddEditPost onAddPostClick={handleSubmit} postLoading={postLoading} />
  );
};

export default CreatePost;
