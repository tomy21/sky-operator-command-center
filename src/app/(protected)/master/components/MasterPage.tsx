import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: string;
};

export default function MasterPage({ children, title }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-blue-600 text-white font-bold">
        {title || "Dashboard"}
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
