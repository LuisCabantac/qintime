import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { IAttendie } from "@/lib/data-service";

export default function UserCard({ attendie }: { attendie: IAttendie }) {
  const [showQr, setShowQr] = useState(false);

  function handleToggleShowQr() {
    setShowQr(!showQr);
  }

  return (
    <>
      <li
        className="group flex cursor-pointer items-center justify-between border-b border-[#dee2e6] px-4 py-2 hover:bg-[#f1f3f5] md:px-2"
        onClick={handleToggleShowQr}
      >
        <div>
          <h4 className="font-medium group-hover:underline">{attendie.name}</h4>
          <p className="text-sm">{attendie.section}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">In time</p>
            <p className="text-sm">
              {attendie.inTime ? attendie.inTime : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Out time</p>
            <p className="text-sm">
              {attendie.outTime ? attendie.outTime : "N/A"}
            </p>
          </div>
        </div>
      </li>
      {showQr && (
        <li className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-[#f1f3f5]">
          <div className="grid gap-1">
            <QRCodeSVG
              fgColor="#212529"
              bgColor="#f1f3f5"
              size={180}
              value={`https://qintime.vercel.app/verify/${attendie.id}`}
            />
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-medium">{attendie.name}</h2>
              <p>{attendie.section}</p>
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
    </>
  );
}
