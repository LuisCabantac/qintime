"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addAttendies } from "@/lib/user-actions";

export default function UserForm({
  type,
  search,
  handleSetShowUserForm,
}: {
  type: "admin" | "attendie";
  search: string;
  handleSetShowUserForm: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  // const [showPassword, setShowPassword] = useState(false);

  const { mutate: handleAddAttendies, isPending: addAttendiesIsPending } =
    useMutation({
      mutationFn: addAttendies,
      onSuccess: () => {
        handleSetShowUserForm(false);
        queryClient.invalidateQueries({
          queryKey: ["attendies", search],
        });
      },
    });

  return (
    <form
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        handleAddAttendies(formData);
      }}
      className="mx-4 grid gap-2 md:mx-2"
    >
      <h1 className="text-2xl font-medium">Add {type}</h1>
      {type === "attendie" && (
        <div className="grid gap-1">
          <label className="text-sm font-medium">Name:</label>
          <input
            type="text"
            name="name"
            required
            disabled={addAttendiesIsPending}
            className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
            placeholder="Enter the user's name..."
          />
        </div>
      )}
      {type === "admin" && (
        <>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Email:</label>
            <input
              type="email"
              name="email"
              required
              className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
              placeholder="Enter the user's email..."
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Password:</label>
            <input
              type="password"
              name="password"
              required
              className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
              placeholder="Enter the user's password..."
            />
          </div>
        </>
      )}
      {type === "attendie" && (
        <div className="grid gap-1">
          <label className="text-sm font-medium">Section:</label>
          <input
            type="text"
            name="section"
            required
            disabled={addAttendiesIsPending}
            className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
            placeholder="Enter the user's section..."
          />
        </div>
      )}
      <button
        type="submit"
        disabled={addAttendiesIsPending}
        className="mt-2 rounded-lg bg-[#212529] px-4 py-2 font-medium text-[#f8f9fa] hover:bg-[#1e2125] disabled:cursor-not-allowed"
      >
        Add user
      </button>
    </form>
  );
}