"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IAdmin, IAttendee } from "@/lib/data-service";
import { addAdmin, addAttendee, editAttendee } from "@/lib/user-actions";

export default function UserForm({
  type,
  edit = false,
  user,
  search,
  handleSetShowUserForm,
}: {
  type: "admin" | "attendee";
  edit?: boolean;
  user?: IAttendee | IAdmin;
  search?: string;
  handleSetShowUserForm: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();

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

  const { mutate: handleAddAdmin, isPending: addAdminIsPending } = useMutation({
    mutationFn: addAdmin,
    onSuccess: () => {
      handleSetShowUserForm(false);
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
    },
  });

  const { mutate: handleEditAttendee, isPending: editAttendeeIsPending } =
    useMutation({
      mutationFn: editAttendee,
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
        if (type === "attendee" && edit) {
          handleEditAttendee(formData);
        }
        if (type === "attendee") {
          handleAddAttendee(formData);
        }
        if (type === "admin") {
          handleAddAdmin(formData);
        }
      }}
      className="mx-4 grid gap-2 md:mx-2"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">
          {edit ? "Edit" : "Add"} {type}
        </h1>
        <button
          type="button"
          disabled={
            addAttendeesIsPending || addAdminIsPending || editAttendeeIsPending
          }
          onClick={() => handleSetShowUserForm(false)}
          className="font-medium text-[#212529] disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
      <input type="hidden" name="id" defaultValue={user?.id} />
      <input
        type="hidden"
        name="type"
        defaultValue={"email" in (user ?? {}) ? "admin" : "attendee"}
      />
      <div className="grid gap-1">
        <label className="text-sm font-medium">Name:</label>
        <input
          type="text"
          name="name"
          required
          disabled={addAttendeesIsPending || addAdminIsPending}
          className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
          placeholder="Enter the user's name..."
          defaultValue={user?.name}
        />
      </div>
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
              defaultValue={user && "email" in user ? user.email : ""}
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
              defaultValue={user && "password" in user ? user.password : ""}
            />
          </div>
        </>
      )}
      {type === "attendee" && (
        <>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Student Number:</label>
            <input
              type="text"
              name="studentNumber"
              required={!edit}
              disabled={addAttendeesIsPending || addAdminIsPending}
              className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
              placeholder="Enter the user's student number..."
              defaultValue={
                user && "studentNumber" in user ? user.studentNumber : ""
              }
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Section:</label>
            <input
              type="text"
              name="section"
              required
              disabled={addAttendeesIsPending || addAdminIsPending}
              className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
              placeholder="Enter the user's section..."
              defaultValue={user && "section" in user ? user.section : ""}
            />
          </div>
        </>
      )}
      <button
        type="submit"
        disabled={
          addAttendeesIsPending || addAdminIsPending || editAttendeeIsPending
        }
        className="mt-2 rounded-lg bg-[#212529] px-4 py-2 font-medium text-[#f8f9fa] hover:bg-[#1e2125] disabled:cursor-not-allowed"
      >
        {edit ? "Edit" : "Add"} user
      </button>
    </form>
  );
}
