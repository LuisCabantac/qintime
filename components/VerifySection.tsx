"use client";

import { verifyAttendee } from "@/lib/user-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function VerifySection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attendee = searchParams.get("attendee");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  if (!attendee) router.push("/");

  const onSubmit = useCallback(() => {
    verifyAttendee(attendee ?? "").then((data) => {
      setIsLoading(false);
      setSuccess(data.success);
      setMessage(data.message);
    });
  }, [attendee]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <section
      className={`${success ? "text-[#2f9e44]" : "text-[#e03131]"} flex flex-col items-center justify-center gap-4 py-52 md:py-44`}
    >
      {success && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      )}
      {success === false && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      )}
      <h2 className="text-center text-xl font-medium">{message}</h2>
      {isLoading && (
        <h2 className="text-center text-xl font-medium text-[#212529]">
          Verifying...
        </h2>
      )}
    </section>
  );
}
