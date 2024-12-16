import Image from "next/image";

import logo from "@/public/logo.png";

export default function Logo({ size = "w-14" }: { size: string }) {
  return (
    <div>
      <h1
        className={`flex items-center gap-0.5 font-bold ${size === "w-14" ? "text-4xl" : "text-2xl"}`}
      >
        <span>
          <Image
            src={logo}
            width={50}
            height={50}
            alt="logo"
            className={`${size}`}
          />
        </span>
        InTime
      </h1>
    </div>
  );
}
