"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { deleteAdmin } from "@/lib/user-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IAdmin } from "@/lib/data-service";

import UserCard from "@/components/UserCard";
import UserForm from "@/components/UserForm";

export default function AdminsSection({
  session,
  onGetAllAdmins,
}: {
  session: Session;
  onGetAllAdmins: (adminId: string) => Promise<IAdmin[] | null>;
}) {
  const queryClient = useQueryClient();

  const [showUserForm, setShowUserForm] = useState(false);

  const { data: admins, isPending: adminsIsPending } = useQuery({
    queryKey: ["admins"],
    queryFn: () => onGetAllAdmins(session?.user?.id ?? ""),
  });

  const { mutate: handleDeleteAdmin, isPending: deleteAdminIsPending } =
    useMutation({
      mutationFn: deleteAdmin,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["admins"],
        });
      },
    });

  function handleToggleShowUserForm() {
    setShowUserForm(!showUserForm);
  }

  return (
    <div className="mt-4 md:mt-2">
      {showUserForm ? (
        <UserForm type="admin" handleSetShowUserForm={setShowUserForm} />
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between px-4 md:px-2">
            <h1 className="text-2xl font-medium">All admins</h1>
            <button
              type="button"
              onClick={handleToggleShowUserForm}
              className="rounded-md bg-[#212529] px-4 py-2 font-medium text-[#dee2e6]"
            >
              Add
            </button>
          </div>
          <ul>
            {adminsIsPending &&
              Array(6)
                .fill(undefined)
                .map((_, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border-b border-[#dee2e6] px-4 py-2 md:px-2"
                  >
                    <div className="grid gap-1">
                      <div className="h-4 w-14 animate-pulse rounded-md bg-[#f1f3f5]"></div>
                      <div className="h-[0.875rem] w-8 animate-pulse rounded-md bg-[#f1f3f5]"></div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="grid gap-1">
                        <div className="h-[0.875rem] w-8 animate-pulse rounded-md bg-[#f1f3f5]"></div>
                        <div className="h-[0.875rem] w-16 animate-pulse rounded-md bg-[#f1f3f5]"></div>
                      </div>
                      <div className="grid gap-1">
                        <div className="h-[0.875rem] w-8 animate-pulse rounded-md bg-[#f1f3f5]"></div>
                        <div className="h-[0.875rem] w-16 animate-pulse rounded-md bg-[#f1f3f5]"></div>
                      </div>
                    </div>
                  </li>
                ))}
            {admins?.length
              ? admins?.map((admin) => (
                  <UserCard
                    key={admin.id}
                    user={admin}
                    onDeleteUser={handleDeleteAdmin}
                    deleteUserIsPending={deleteAdminIsPending}
                  />
                ))
              : null}
            {!adminsIsPending && !admins?.length ? (
              <li className="flex items-center justify-center py-10 font-medium">
                No admins have been added just yet.
              </li>
            ) : null}
          </ul>
        </>
      )}
    </div>
  );
}
