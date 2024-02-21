import Button from "./Button";
import React from "react";

/**
 * Renders the header component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to be displayed in the header.
 * @param {function} props.onClick - The function to be called when the button is clicked.
 * @returns {JSX.Element} The rendered header component.
 */
const Header = ({ title, onClick }) => {
  return (
    <header className="header">
      <h1 className="text-2xl font-bold text-black-500">{title}</h1>
      <Button
        color="blue"
        text="Erläuterung anzeigen"
        onClick={onClick}
        className={"ninth-step"}
      />
    </header>
  );
};

Header.defaultProps = {
  title: "Schulaufgabenplaner",
};

export default Header;
