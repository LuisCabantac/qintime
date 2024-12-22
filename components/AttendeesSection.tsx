"use client";

import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IAttendee } from "@/lib/data-service";
import { clearAllAttendeesDates, deleteAttendee } from "@/lib/user-actions";

import UserCard from "@/components/UserCard";
import UserForm from "@/components/UserForm";

export default function AttendeesSection({
  session,
  onGetAllAttendees,
}: {
  session: Session;
  onGetAllAttendees: (
    adminId: string,
    query: string,
  ) => Promise<IAttendee[] | null>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data: attendees, isPending: attendeesIsPending } = useQuery({
    queryKey: ["attendees", search],
    queryFn: () => onGetAllAttendees(session?.user?.id ?? "", search),
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", filter);
    router.push(`${pathname}?${params.toString()}`);
  }, [filter, pathname, router, searchParams]);

  const { mutate: handleDeleteAttendee, isPending: deleteAttendeeIsPending } =
    useMutation({
      mutationFn: deleteAttendee,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["attendees", search],
        });
      },
    });

  const {
    mutate: handleClearAllAttendeesDates,
    isPending: clearAllAttendeesDatesIsPending,
  } = useMutation({
    mutationFn: clearAllAttendeesDates,
    onSuccess: () => {
      setShowConfirmation(false);
      queryClient.invalidateQueries({
        queryKey: ["attendees", search],
      });
    },
  });

  function handleToggleShowUserForm() {
    setShowUserForm(!showUserForm);
  }

  function handleToggleShowConfirmation() {
    setShowConfirmation(!showConfirmation);
  }

  return (
    <div className="mt-4 md:mt-2">
      {showUserForm ? (
        <UserForm
          type="attendee"
          search={search}
          handleSetShowUserForm={setShowUserForm}
        />
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between gap-4 px-4 md:px-2">
            <select
              className="cursor-pointer bg-transparent p-0 text-xl font-medium"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All</option>
              {attendees &&
                [...new Set(attendees?.map((attendee) => attendee.section))]
                  .sort()
                  .map((section) => <option key={section}>{section}</option>)}
            </select>
            <button
              type="button"
              onClick={handleToggleShowUserForm}
              className="rounded-md bg-[#212529] px-4 py-2 font-medium text-[#dee2e6]"
            >
              Add
            </button>
          </div>
          <div className="mb-2 flex items-center justify-between gap-4 px-4 md:px-2">
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              type="button"
              onClick={handleToggleShowConfirmation}
              disabled={!attendees?.length ? true : false}
              className="w-[50%] rounded-md bg-[#e03131] px-4 py-2 font-medium text-[#dee2e6] disabled:cursor-not-allowed"
            >
              Clear dates
            </button>
          </div>
          <ul>
            {attendeesIsPending &&
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
            {attendees?.length
              ? attendees
                  ?.filter(
                    (attendee) =>
                      attendee.section === filter || filter === "all",
                  )
                  .map((attendee) => (
                    <UserCard
                      key={attendee.id}
                      user={attendee}
                      onDeleteUser={handleDeleteAttendee}
                      deleteUserIsPending={deleteAttendeeIsPending}
                    />
                  ))
              : null}
            {!attendeesIsPending && !attendees?.length ? (
              <li className="flex items-center justify-center py-10 font-medium">
                No attendees have been added just yet.
              </li>
            ) : null}
          </ul>
        </>
      )}
      {showConfirmation && (
        <div className="modal__container">
          <div className="flex h-[40%] max-w-[78%] items-center justify-center md:h-[60%] md:max-w-[40%]">
            <div className="rounded-lg bg-[#f8f9fa] p-4">
              <h2 className="font-bold">
                Are you sure you want clear all the users&apos; in and out
                dates/times?
              </h2>
              <div className="mt-2 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={handleToggleShowConfirmation}
                  disabled={clearAllAttendeesDatesIsPending}
                  className="font-medium text-[#212529] disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={clearAllAttendeesDatesIsPending}
                  onClick={() => {
                    handleClearAllAttendeesDates(session?.user?.id ?? "");
                  }}
                  className="rounded-lg bg-[#e03131] px-4 py-2 font-medium text-[#f8f9fa]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
