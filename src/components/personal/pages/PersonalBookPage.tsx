import type { ReactNode } from "react";

interface PersonalBookPageProps {
  children: ReactNode;
}

export const PersonalBookPage = ({ children }: PersonalBookPageProps) => (
  <main className="space-y-6" data-page="book-detail">
    {children}
  </main>
);
