import React from "react";
import "./header.css";

const Header: React.FC = () => {
  return (
    <header className="global-header">
      <div className="global-header-inner">
        <a
          className="global-header-logo"
          href="https://www.telekom.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Telekom Home"
          title="Telekom Home"
        >
          Telekom
        </a>
        <span className="global-header-app-name">Application Name</span>
        <nav className="global-header-nav" aria-label="Primary">
          <a href="https://www.telekom.de/">Topic 1</a>
          <a href="https://www.telekom.de/">Topic 2</a>
          <a href="https://www.telekom.de/">Topic 3</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
