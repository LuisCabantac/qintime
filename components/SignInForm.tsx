"use client";

import { useFormStatus } from "react-dom";

export default function SignInForm() {
  const status = useFormStatus();

  return (
    <>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Email:</label>
        <input
          type="email"
          name="email"
          required
          disabled={status.pending}
          className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
          placeholder="Enter your email..."
        />
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium">Password:</label>
        <input
          type="password"
          name="password"
          required
          disabled={status.pending}
          className="rounded-lg border border-[#868e96] bg-transparent px-4 py-2 disabled:cursor-not-allowed"
          placeholder="Enter your password..."
        />
      </div>
      <button
        type="submit"
        disabled={status.pending}
        className="mt-2 rounded-lg bg-[#212529] px-4 py-2 font-medium text-[#f8f9fa] disabled:cursor-not-allowed"
      >
        Sign in
      </button>
    </>
  );
}
