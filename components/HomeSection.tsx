"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { useQuery } from "@tanstack/react-query";

import { IAttendie } from "@/lib/data-service";

import UserCard from "@/components/UserCard";
import UserForm from "@/components/UserForm";

export default function HomeSection({
  session,
  onGetAllAttendies,
}: {
  session: Session;
  onGetAllAttendies: (
    adminId: string,
    query: string,
  ) => Promise<IAttendie[] | null>;
}) {
  const [search, setSearch] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);

  const { data: attendies, isPending } = useQuery({
    queryKey: ["attendies", search],
    queryFn: () => onGetAllAttendies(session?.user?.id ?? "", search),
  });

  function handleToggleShowUserForm() {
    setShowUserForm(!showUserForm);
  }

  return (
    <div className="mt-4 md:mt-2">
      {showUserForm ? (
        <UserForm
          type="attendie"
          search={search}
          handleSetShowUserForm={setShowUserForm}
        />
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between px-4 md:px-2">
            <input
              type="search"
              placeholder="Search..."
              className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              type="button"
              onClick={handleToggleShowUserForm}
              className="rounded-md bg-[#212529] px-4 py-2 font-medium text-[#dee2e6]"
            >
              Add
            </button>
          </div>
          <ul>
            {isPending &&
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
            {attendies?.length
              ? attendies?.map((attendie) => (
                  <UserCard key={attendie.id} attendie={attendie} />
                ))
              : null}
            {isPending && !attendies ? (
              <li className="h-screen font-medium">
                No attendies have been added just yet.
              </li>
            ) : null}
          </ul>
        </>
      )}
    </div>
  );
}