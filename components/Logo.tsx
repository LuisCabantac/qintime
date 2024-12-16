import Image from "next/image";

import logo from "@/public/logo.png";

export default function Logo() {
  return (
    <div>
      <h1 className="flex items-center gap-0.5 text-4xl font-bold">
        <span>
          <Image
            src={logo}
            width={50}
            height={50}
            alt="logo"
            className="w-14"
          />
        </span>
        InTime
      </h1>
    </div>
  );
}
