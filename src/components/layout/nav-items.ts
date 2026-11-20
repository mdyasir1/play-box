import {
  ChartColumn,
  Gamepad2,
  House,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/stats", label: "Stats", icon: ChartColumn },
  { href: "/achievements", label: "Achievements", icon: Trophy },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}