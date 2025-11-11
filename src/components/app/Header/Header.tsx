"use client";

import { useIsMobile } from "@/hooks";

import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";

interface HeaderProps {
  navigation: Navigation;
}

export const Header = ({ navigation }: HeaderProps) => {
  const isMobile = useIsMobile();

  if (isMobile) return <MobileHeader navigation={navigation} />;

  return <DesktopHeader navigation={navigation} />;
};
