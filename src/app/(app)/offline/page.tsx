import { Metadata } from "next";

import { PageHeading } from "@/components/app";
import { APP_NAME } from "@/consts";

import { OfflineRecipes } from "./OfflineRecipes";

export const metadata: Metadata = {
  title: `Available offline - ${APP_NAME}`,
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="w-full">
      <PageHeading
        title="Available offline"
        description="Recipes you've opened or saved on this device. They open without a connection."
      />
      <OfflineRecipes />
    </div>
  );
}
