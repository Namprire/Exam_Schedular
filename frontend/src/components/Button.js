import PropTypes from "prop-types";

/**
 * Button component.
 *
 * @param {string} color - The background color of the button.
 * @param {string} text - The text displayed on the button.
 * @param {function} onClick - The function to be called when the button is clicked.
 * @param {string} className - Additional CSS class name for the button.
 * @returns {JSX.Element} The rendered button component.
 */
const Button = ({ color, text, onClick, className }) => {
  return (
    <button
      style={{ backgroundColor: color }}
      className={`btn  ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  color: "blue",
};

Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
