import type { ComponentProps } from "react";
import { PersonalChapterPage } from "./PersonalChapterPage";

type PersonalSubchapterPageProps = Omit<ComponentProps<typeof PersonalChapterPage>, "variant"> & {
  parentTitle: string;
};

export const PersonalSubchapterPage = (props: PersonalSubchapterPageProps) => (
  <PersonalChapterPage {...props} variant="subchapter" />
);
