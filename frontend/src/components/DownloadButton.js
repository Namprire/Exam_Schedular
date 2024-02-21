import PropTypes from "prop-types";

/**
 * DownloadButton component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.text - The text to display on the button.
 * @param {function} props.onClick - The function to be called when the button is clicked.
 * @param {string} props.className - Additional CSS class name for the button.
 * @returns {JSX.Element} The DownloadButton component.
 */
const DownloadButton = ({ text, onClick, className }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md text-white bg-[#0000FF] hover:bg-[#000080] transition-colors duration-200 ease-in-out flex items-center ${className}`}
      onClick={onClick}
    >
      {/*
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-5 w-5 mr-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7 7 7-7"
        />
      </svg>
      */}
      <svg
        className="w-6 h-6"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M9 13l-3-3h2V8h2v2h2l-3 3zm-3.17 1h6.34c1.1 0 1.26-1.16 1.26-1.75V5H4.75v6.42c0 .92.08 1.58 1.08 1.58z" />
      </svg>
      {text}
    </button>
  );
};

DownloadButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default DownloadButton;
