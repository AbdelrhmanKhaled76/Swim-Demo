import type { ReactNode } from "react";

interface IntroductionCard {
  title: string;
  description: string;
  icon?: string | ReactNode;
  type: "primary" | "secondary";
}

export type { IntroductionCard };