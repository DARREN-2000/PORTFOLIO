import {
  ODSStandardGlobalHeader,
  ODSBadgeIcon,
} from "@telekom-ods/react-ui-kit";
import React from "react";
import "./header.css";

const Header: React.FC = () => {
  return (
    <ODSStandardGlobalHeader
      applicationName="Application Name"
      languageSelectionItems={[
        {
          "aria-label": "English",
          href: "#en",
          label: "EN",
          selected: true,
        },
        {
          "aria-label": "German",
          href: "#de",
          label: "DE",
        },
      ]}
      logoProps={{
        "aria-label": "Telekom Home",
        href: "https://www.telekom.com/",
        target: "_blank",
        title: "Telekom Home",
        type: "primary",
      }}
      menuAriaLabel="Primary"
      menuItems={[
        {
          href: "https://www.telekom.de/",
          label: "Topic 1",
          selected: true,
        },
        {
          href: "https://www.telekom.de/",
          label: "Topic 2",
        },
        {
          href: "https://www.telekom.de/",
          label: "Topic 3",
        },
      ]}
      primaryLinkItems={[
        {
          external: true,
          href: "https://example.com",
          icon: "navigation-external-link-type-standard",
          linkText: "Link 1",
        },
        {
          external: true,
          href: "https://example.com",
          icon: "navigation-external-link-type-standard",
          linkText: "Link 2",
        },
      ]}
      secondaryLinkItems={[
        {
          external: false,
          href: "/",
          linkText: "Link 1",
        },
        {
          external: false,
          href: "/",
          linkText: "Link 2",
        },
      ]}
      secondaryMenuAriaLabel="Secondary"
      secondaryMenuItems={[
        {
          icon: "search-type-standard",
          label: "Search",
          selected: true,
        },
        {
          icon: "shopping-cart-type-standard",
          label: "Shop",
        },
        {
          badge: <ODSBadgeIcon type="success" />,
          icon: "user-type-standard",
          label: "Profile",
        },
        {
          icon: "menu-type-standard",
          label: "Menu",
        },
      ]}
      showApplicationName
      showLanguageSelection
      showMainIconMenu
      showPrimaryLinks
      showSecondaryLinks
      showTools
    />
  );
};

export default Header;
