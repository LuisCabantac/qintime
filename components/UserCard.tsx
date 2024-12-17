import { useState } from "react";
import { format } from "date-fns";
import { Session } from "next-auth";
import { QRCodeSVG } from "qrcode.react";
import { UseMutateFunction } from "@tanstack/react-query";

import { IAdmin, IAttendee } from "@/lib/data-service";

export default function UserCard({
  user,
  session,
  onDeleteUser,
  deleteUserIsPending,
}: {
  user: IAttendee | IAdmin;
  session?: Session;
  onDeleteUser: UseMutateFunction<undefined, Error, string, unknown>;
  deleteUserIsPending: boolean;
}) {
  const [showQr, setShowQr] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleToggleShowQr() {
    setShowQr(!showQr);
  }

  function handleToggleShowConfirmation() {
    setShowConfirmation(!showConfirmation);
  }

  return (
    <>
      <li className="group mx-4 flex items-center gap-2 border-b border-[#dee2e6] py-2 hover:bg-[#f1f3f5] md:mx-2">
        <div
          onClick={handleToggleShowQr}
          className="flex w-full cursor-pointer items-center justify-between"
        >
          <div>
            <h4 className="font-medium group-hover:underline">{user.name}</h4>
            {"section" in user && <p className="text-sm">{user.section}</p>}
          </div>
          {"inTime" in user && "outTime" in user && (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">In time</p>
                <p className="text-sm">
                  {user.inTime
                    ? format(user.inTime, "MMMM dd, yyyy hh:mm a")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Out time</p>
                <p className="text-sm">
                  {user.outTime
                    ? format(user.outTime, "MMMM dd, yyyy hh:mm a")
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
        {session?.user?.id !== user.id && (
          <button
            type="button"
            disabled={deleteUserIsPending}
            onClick={handleToggleShowConfirmation}
            className="disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 stroke-[#e03131]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        )}
      </li>
      {showQr && "section" in user && (
        <li className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-[#f8f9fa]">
          <div className="grid gap-1">
            <QRCodeSVG
              fgColor="#212529"
              bgColor="#f8f9fa"
              size={180}
              value={`https://qintime.vercel.app/verify?attendee=${user.id}`}
            />
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-medium">{user.name}</h2>
              <p>{user.section}</p>
            </div>
            <button
              type="button"
              className="absolute right-3 top-4 md:right-4 md:top-4"
              onClick={handleToggleShowQr}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </li>
      )}
      {showConfirmation && (
        <li className="modal__container">
          <div className="flex h-[40%] max-w-[78%] items-center justify-center md:h-[60%] md:max-w-[40%]">
            <div className="rounded-lg bg-[#f8f9fa] p-4">
              <h2 className="font-bold">
                Are you sure you want to remove this user?
              </h2>
              <div className="mt-2 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={handleToggleShowConfirmation}
                  disabled={deleteUserIsPending}
                  className="font-medium text-[#212529] disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteUserIsPending}
                  onClick={() => {
                    onDeleteUser(user.id);
                    setShowConfirmation(false);
                  }}
                  className="rounded-lg bg-[#e03131] px-4 py-2 font-medium text-[#f8f9fa]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </li>
      )}
    </>
  );
}
