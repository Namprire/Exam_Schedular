import React, {useContext} from "react";
import * as XLSX from "xlsx";
import {compareAsc, parse} from "date-fns";
import AppContext from "../../AppContext";

//der downloadbutton
import DownloadButton from "../../components/DownloadButton";

const ExportStudentToExcel = () => {
        const {
            studentsApp,
        } = useContext(AppContext);

        // In data werden die Studenteninformationen gesammelt
        const data = [];
        for (let indStu = 0; indStu < studentsApp.length; indStu++) {
            // Dabei hat ein student array einen namen 'student' und ein array aller Prüfung 'exams'
            const student = {
                student: studentsApp[indStu].name,
                exams: [],
            }
            let exams = [];
            for (let indExa = 0; indExa < studentsApp[indStu].exams.length; indExa++) {
                // Anschließend wird ein weiteres array exam mit 'subject' und 'date'
                const exam = {
                    subject: studentsApp[indStu].exams[indExa].course.name,
                    date: studentsApp[indStu].exams[indExa].date,
                };
                // Das Ergebnis der indExa-Schleife wird in exams gepusht
                exams.push(exam);
            }
            // und das Ergebnis indStu-Schleife wird in data gepusht
            student.exams = exams;
            data.push(student);
            // Alles darunter ist die Vorbereitung und Export des arrays 'data'
        }

        //(Vorbereitung) Sortiert die Schüler nach ihrem Nach- & Vornamen
        data.sort((a, b) => {
            const [aLastName, aFirstName] = a.student.split(" ");
            const [bLastName, bFirstName] = b.student.split(" ");

            // Vergleicht die Nachnamen (alternativ Vorname)
            if (aLastName !== bLastName) return bLastName.localeCompare(aLastName);
            else return bFirstName.localeCompare(aFirstName);
        });

        //(Vorbereitung) Dieser Stream sortiert die Klausuren der jeweiligen Schüler nach dem Datum.

        data.forEach((student) => {
            student.exams.sort((a, b) =>
                compareAsc(
                    a.date,
                    b.date
                )
            );
        });

        //(Export) Diese Funktion erstellt die Struktur der Excel Datei und exportiert sie
        const exportToExcel = () => {
            // Hier wird das WorkSheet erstellt. Die Struktur wird unten in den Kommentaren (hoffentlich gut) erklärt
            const ws = XLSX.utils.aoa_to_sheet([
                //die Headerzeile (straight forward)
                ["Schüler", "Prüfung", "Datum"],
                ...data.flatMap(({student, exams}) => [
                    [student, "", ""], // der Schüler mit jeweils zwei leeren Zeilen
                    ...exams.map(({subject, date}) => ["", subject, date]), // die Prüfung und das Datum
                    ["", "", ""], // leere Zeilen Trennung (gibt etwas mehr Übersicht, kann aber auch entfernt werden
                ]),
            ]);
            //hier wird abschließend das WorkBook erstellt, wo das oben erstellte WorkSheet eingebunden wird
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

            //export
            XLSX.writeFile(wb, "Schüler_Klausurtermine.xlsx");
        };

        return (
            <DownloadButton
                text="Schüler Herunterladen"
                onClick={exportToExcel}
            ></DownloadButton>
        );
    }
;

export default ExportStudentToExcel;
