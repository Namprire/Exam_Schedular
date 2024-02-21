import React, {useContext} from "react";
import * as XLSX from "xlsx";
import { compareAsc, parse } from "date-fns";

//der downloadbutton
import DownloadButton from "../../components/DownloadButton";
import AppContext from "../../AppContext";

const ExportCourseToExcel = () => {
  const {
    examsApp,
  } = useContext(AppContext);

  //console.log(examsApp)

  // In data werden die Klausur-/Prüfungsinformationen gesammelt
  const data = [];
  for (let indExa = 0; indExa < examsApp.length; indExa++) {
    // Dabei enthält das array 'data' eine Sammlung an mehrerer exams
    const exam = {
      date: examsApp[indExa].date,
      course: examsApp[indExa].course.name,
    }
    // Das Ergebnis der indExa-Schleife wird in data gepusht
    data.push(exam);
  }
  // Fortsetzend wird 'data' vorbereitet und schlussendlich exportiert

  //(Vorbereitung) sortieren der Prüfungen nach dem Datum
  data.sort((a, b) => compareAsc(a.date, b.date));

  //console.log(data);

  //(Export) Diese Funktion erstellt die Struktur der Excel Datei und exportiert sie
  const exportToExcel = () => {
    // Hier wird das WorkSheet erstellt. Die Struktur wird unten in den Kommentaren (hoffentlich gut) erklärt
    const ws = XLSX.utils.aoa_to_sheet([
      // das ist die Headerzeile. Bin mir noch nicht so sicher, wie sinnvoll die dritte leere '' Spalte ist
      ["Kurs", "Datum der Prüfung", ""],
      ...data.flatMap(({ date, course }) => [
        [course, date, ""],
      ]),
    ]);

    //hier wird abschließend das WorkBook erstellt, wo das oben erstellte WorkSheet eingebunden wird
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    //export
    XLSX.writeFile(wb, "Kurs_Terminliste.xlsx");
  };

  return (
    <DownloadButton
      text="Termine Herunterladen"
      onClick={exportToExcel}
    ></DownloadButton>
  );
};

export default ExportCourseToExcel;
