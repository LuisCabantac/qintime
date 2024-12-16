"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addAttendee } from "@/lib/user-actions";

export default function UserForm({
  type,
  search,
  handleSetShowUserForm,
}: {
  type: "admin" | "attendee";
  search: string;
  handleSetShowUserForm: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  // const [showPassword, setShowPassword] = useState(false);

  const { mutate: handleAddAttendee, isPending: addAttendeesIsPending } =
    useMutation({
      mutationFn: addAttendee,
      onSuccess: () => {
        handleSetShowUserForm(false);
        queryClient.invalidateQueries({
          queryKey: ["attendees", search],
        });
      },
    });

  return (
    <form
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        handleAddAttendee(formData);
      }}
      className="mx-4 grid gap-2 md:mx-2"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Add {type}</h1>
        <button
          type="button"
          disabled={addAttendeesIsPending}
          onClick={() => handleSetShowUserForm(false)}
          className="font-medium text-[#212529] disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
      {type === "attendee" && (
        <div className="grid gap-1">
          <label className="text-sm font-medium">Name:</label>
          <input
            type="text"
            name="name"
            required
            disabled={addAttendeesIsPending}
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
      {type === "attendee" && (
        <div className="grid gap-1">
          <label className="text-sm font-medium">Section:</label>
          <input
            type="text"
            name="section"
            required
            disabled={addAttendeesIsPending}
            className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
            placeholder="Enter the user's section..."
          />
        </div>
      )}
      <button
        type="submit"
        disabled={addAttendeesIsPending}
        className="mt-2 rounded-lg bg-[#212529] px-4 py-2 font-medium text-[#f8f9fa] hover:bg-[#1e2125] disabled:cursor-not-allowed"
      >
        Add user
      </button>
    </form>
  );
}
