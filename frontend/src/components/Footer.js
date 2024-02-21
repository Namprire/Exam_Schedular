import ExportStudentToExcel from "../data/components/MyStudentExporter";
import ExportCourseToExcel from "../data/components/MyExamExporter";

/**
 * Renders the Footer component.
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer = () => {
  return (
    <div className="flex space-x-4">
      <ExportStudentToExcel />
      <ExportCourseToExcel />
    </div>
  );
};

Footer.defaultProps = {
  title: "",
};

export default Footer;
