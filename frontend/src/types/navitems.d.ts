import type { IconType } from "react-icons";

interface NavItem {
  key: string;
  icon: IconType;
  route?: string;
  isAction?: boolean;
}
