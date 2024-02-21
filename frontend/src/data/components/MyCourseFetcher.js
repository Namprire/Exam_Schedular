import React, { useState, useContext, useRef, Fragment} from "react";
import { Dialog, Transition } from '@headlessui/react';
import * as XLSX from "xlsx";
import Student from "../../components/algo/data/students";
import Course from "../../components/algo/data/course";
import { WarnMessage, ErrorMessage } from "./MyAlertFunction";

//set const globally for calendar and algo
import AppContext from "../../AppContext";

/** Courses sammelt alle Kurse in einer Liste
 * @param courses die Liste aller Kurs-Objekte
 *
 */
class Courses {
  constructor() {
    this.courses = [];
  }
  /**addCourse fügt 'course' der Kursliste hinzu
   * @throws error Wenn der Kurs bereits vorhanden ist
   */
  addCourse(course) {
    const courseOfList = this.findCourse(course);
    if (courseOfList !== undefined) {
      error.errorMessage(
        '\nDer Kurs "' + course.name + '" ist doppelt vorhanden!',
        2
      );
      return -1;
    }
    this.courses.push(course);
    return 1;
  }

  //allCourses gibt die Liste aller Kurse, sortiert nach den Fächern, zurück
  get allCourses() {
    const sortedList = this.courses.sort((c1, c2) => {
      if (c1.subject === null || c2.subject === null) return 0;
      const course1 = c1.subject.toUpperCase();
      const course2 = c2.subject.toUpperCase();

      if (course1 < course2) {
        return -1;
      }

      if (course1 > course2) {
        return 1;
      }
      return 0;
    });
    return sortedList;
  }

  findCourse(course) {
    return this.courses.find((c) => c.name === course.name);
  }
}

/** Students enthält eine Liste aller Schueler
 * @property students Liste aller Schueler
 */
class Students {
  constructor() {
    this.students = [];
  }
  findStudent(student) {
    // takes a students name and searches this name in it's studentList,
    // return: student : null
    return this.students.find((s) => s.name === student.name);
  }
  addStudent(student) {
    this.students.push(student);
  }

  /** updateStudentCourse sucht einen Schueler 'student' in der Schuelerliste dieser Klasse
   * und und fuegt genau diesem Schueler den Kurs-Objekt mit der addCourse('course') Funktion hinzu.
   *
   * @param course der Kurs, der hinzugefuegt werden soll
   * @param student der Schueler, dem der Kurs hinzugefuegt werden soll
   */
  updateStudentCourse(student, course) {
    //assumption: every student has a unique name!
    const studentToUpdate = this.students.find((s) => s === student);
    studentToUpdate.addCourse(course);
  }

  /** allStudents gibt die Liste aller Schueler in sortierter Reihenfolge zurueck.
   * Dabei wird in folgender Priorität soritert:
   ** Erst wird nach Nachnamen soritert.
   * Bei gleich Nachnamen wird nach dem Vornamen sortiert
   * @return {[]} gibt die Liste aller Schueler in sortierter Reihenfolge zurück
   */
  get allStudents() {
    const sortedList = this.students.sort((s1, s2) => {
      const student1 = s1.name.split(" ");
      const student2 = s2.name.split(" ");

      const vorname1 = student1[0].toUpperCase();
      const vorname2 = student2[0].toUpperCase();

      const nachname1 = student1[student1.length - 1].toUpperCase();
      const nachname2 = student2[student2.length - 1].toUpperCase();

      if (nachname1 < nachname2) {
        return -1;
      }
      if (nachname1 > nachname2) {
        return 1;
      }
      if (vorname1 < vorname2) {
        return -1;
      }
      if (vorname1 > vorname2) {
        return 1;
      }
      return 0;
    });
    return sortedList;
  }
}

let courseList;
let studentList;

let warning;
let error;
let collected;

let fail;


/** Der CourseReader ließt die gebene Kursliste in Form einer Excel-Datei ein.
 *
 * @input Kursliste als Excel-Datei
 *
 * @throws error wenn die Excel-Datei nicht in der korrekter Struktur/Formatierung gegeben wird
 * @throws fail wenn der Fetcher einen Fehler oder eine Unvollständigkeit in der Kursliste entdeckt.
 * @throws warning wenn der Fetcher was auffälliges bemerkt, was jedoch nicht zwingend falsch sein muss.
 **  Entdeckt der Fetcher einen Fehler, so wird diese ausgegeben und bricht die Prozedur ab, ehe es
 * an den Kalender weitergeleitet wird. \
 *  Der Fehler muss behoben werden, ehe man fortsetzen kann.
 */
const CourseReader = () => {
  //relevant für mehrmaliges hochladen derselben Datei
  const fileInputRef = useRef(null);

  //stundent and courses for calendar
  const { coursesApp, setCoursesApp, studentsApp, setStudentsApp } =
    useContext(AppContext);

  //button modification
  const [fileUploaded, setFileUploaded] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");


  //pop-up messages
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState("❕WARNUNG❕");

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const displayMessages = (errorArray) => {
    if (errorArray.length > 0) {
      const message = errorArray;
      let messageTitle = "❕WARNUNG❕";
      if (error !== undefined)
        messageTitle = error.fail ? "❗FEHLER❗" : "❕WARNUNG❕";
      setErrorMessage(message);
      setShowErrorModal(true);
      setMessageTitle(messageTitle);
    }
  };

  const handleCourseFile = (e) => {
    courseList = new Courses();
    studentList = new Students();
    let file = e.target.files[0];
    if (file) {
      const fileName = file.name;

      //um sicher zu gehen, dass der Fetcher auch die richtige Datei einließt, muss dieser Überprüfung vorgenommen werden
      const regex = /kurs/i;
      if (!regex.test(fileName.replace(/\.xlsx$/, ""))) {
        displayMessages("Der Name Ihrer Excel-Datei '" +
            fileName +
            "' enthält nicht das Wort 'kurs'.\n\n" +
            "Bitte achten Sie darauf die richtige Datei hochzuladen.\n" +
            "Achten Sie auch darauf, dass ihre Datei das Wort 'Kurs' enthält (egal in welcher Form, z.B. 'Kursliste'), " +
            "sodass das Programm auch richtig arbeiten kann.\n\n" +
            "Um einen kritischen Fehler zu vermeiden wird das Hochladen an dieser Stelle abgebrochen..")
        return;
      }

      //reset fail
      fail = false;

      //file reader to load the xlsx file
      const reader = new FileReader();
      reader.onload = (e) => {
        // resetet den Input Wert, sodass man auch mehrmals dieselbe Datei hochladen kann
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, { type: "array" });
        // Assuming the first sheet is the one you want to read
        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(sheet["!ref"]);

        warning = new WarnMessage();
        error = new ErrorMessage();
        collected = [];

        /** Diese Syntax Funktion ließt eine Zeile der Excel-Datei und überprüft
         *  diese auf Vollständigkeit und richtige Schreibweise.
         *  Enthält die Zeile einen Fehler, so wird eine Warnmeldung geschrieben
         *
         * @param row   Zeile, in der sich der einzulesende Header befindet
         * @param names Korrekte Bezeichnung der Spalten zur Überprüfung
         */
        function syntaxHeader(row, names) {
          let header = [];
          for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            const rowIndex = range.s.r + (row - 1);
            const cellAddress = XLSX.utils.encode_cell({
              r: rowIndex,
              c: colIndex,
            });
            const cellValue = sheet[cellAddress] ? sheet[cellAddress].v : null;
            if (cellValue !== null) header.push(cellValue);
          }

          // Bezeichnung der Spalte A
          let colA = "";
          if (header[0] !== undefined)
            colA = header[0].replace(/\s/g, "").toLowerCase();

          // Bezeichnung der Spalte B
          let colB = "";
          if (header[1] !== undefined)
            colB = header[1].replace(/\s/g, "").toLowerCase();

          // Bezeichnung der Spalte C
          let colC = "";
          if (header[2] !== undefined)
            colC = header[2].replace(/\s/g, "").toLowerCase();

          // Bezeichnung der Spalte D
          let colD = "";
          if (header[3] !== undefined)
            colD = header[3].replace(/\s/g, "").toLowerCase();

          // Bezeichnung der Spalte E
          let colE = "";
          if (header[4] !== undefined)
            colE = header[4].replace(/\s/g, "").toLowerCase();

          if (
            colA !== names[0].replace(/\s/g, "").toLowerCase() ||
            colB !== names[1].replace(/\s/g, "").toLowerCase() ||
            colC !== names[2].replace(/\s/g, "").toLowerCase() ||
            colD !== names[3].replace(/\s/g, "").toLowerCase() ||
            colE !== names[4].replace(/\s/g, "").toLowerCase()
          ) {
            warning.warnMessage(
              "\nAchtung, die Zeile." +
                row +
                " ist unvollständig!\n" +
                "Bitte achten Sieauf folgende Notation:\n" +
                "Spalte A → " +
                names[0] +
                "\nSpalte B → " +
                names[1] +
                "\nSpalte C → " +
                names[2] +
                "\nSpalte D → " +
                names[3] +
                "\nSpalte E → " +
                names[4] +
                "\nBitte passen Sie die Bezeichnung dieser Zeile richtig an!\n\n",
              0
            );
          }
        }

        /* Mit einer Schleife kann man durch die einzelnen Zellen iterieren
         * und die dann auch anschließend in einem String speichern.
         * In diesem Sinne wird ein Array verwendet.
         * Der Header und der eigentliche Inhalt der Excel Datei
         * werden in zwei unterschiedliche Schleife abgearbeitet
         */

        let header = [];
        header.push("Kurs");
        header.push("Lehrer");
        header.push("Fach");
        header.push("Schiene");
        header.push("Schülerliste");
        syntaxHeader(1, header);

        //Schleife.2: Bearbeitung des Inhaltes der Excel Datei
        for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex++) {
          let rowArray = [];
          let colIndex;
          for (colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            const cellAddress = XLSX.utils.encode_cell({
              r: rowIndex,
              c: colIndex,
            });
            const cellValue = sheet[cellAddress] ? sheet[cellAddress].v : null;
            rowArray.push(cellValue);
          }

          /* rowArray[0]: course name
           * rowArray[1]: course teacher
           * rowArray[2]: course subject
           * rowArray[3]: course schiene
           * rowArray[4..max]: course students
           */

          const courseName = rowArray[0];
          const courseTeacher = rowArray[1];
          const courseSubject = rowArray[2];
          const courseSchiene = rowArray[3];

          if (
            courseName === null ||
            courseTeacher === null ||
            courseSubject === null ||
            courseSchiene === null
          ) {
            errUser(rowIndex, "\nFolgende Zeile ist unvollständig: ", 2);
          }
          //compare with constructor in course.js
          const course = new Course(
            courseName,
            courseSchiene,
            courseSubject,
            [],
            courseTeacher
          );
          let spalte = [];
          let missingStudent = false;
          let warnUserBool = true;
          for (let k = range.s.c + 4; k <= range.e.c; k++) {
            //break the iteration if the student cell is empty!
            //in case a cell is empty
            const curStudent = rowArray[k];
            if (curStudent === null) {
              //safe notification*
              spalte.push(k);
              missingStudent = true;
              continue;
            } else if (missingStudent) {
              warnUserBool = true;
            }
            // Da Schüler in der Liste fehlen wird eine Warn Nachricht weitergeleitet
            if (warnUserBool) {
              for (let i = 0; i < spalte.length; i++) {
                warnUser(rowIndex, spalte.pop(), "\n(Siehe: ", 3);
                missingStudent = false;
                warnUserBool = false;
              }
            }
            // Erstelle den aktuell Schüler
            let student = new Student(curStudent, undefined);
            /* Folgende Dinge müssen beachtet werden:
                - existiert der Schüler bereits im Kurs?
                 → Nein? Füge ihn in den Kurs hinzu
                 → Ja? Duplikat!
                - existiert der Schüler in der studentList?
             */
            let studentName = null;
            //Ist der Schüler bereits in der studentList (return student or null)
            if (studentList.allStudents.length !== 0) {
              studentName = studentList.findStudent(student);
            }
            //case1: student doesn't exist (easy to handle)
            if (studentName === undefined || studentName === null) {
              //add the current course to the student (this iteration)
              student.addCourse(course);
              //add student to the current course and the studentList
              studentList.addStudent(student);
              course.addStudent(student);
            }
            //case2: student does exist (harder to handle)
            else {
              //add the current course to the student in the studentList (this iteration)
              studentList.updateStudentCourse(studentName, course);
              if (
                course.addStudent(studentList.findStudent(studentName)) === -1
              )
                error.errorMessage(
                  '\nSchüler: "' +
                    studentName.name +
                    '"' +
                    " (Siehe Zeile: " +
                    rowIndex +
                    ")",
                  3
                );
            }
          }
          if (courseList.addCourse(course) === -1) {
            error.errorMessage(" Siehe Zeile: " + (rowIndex + 1), 2);
          }
        }
        //printe die Warn-/ErrorNachrichten von den jeweiligen Klassen aus
        collected.push(error.displayMessage().join(" "));
        collected.push(warning.displayMessage().join(" "));
        if (error.fail)
          collected.push("\nBitte passen Sie ihre Excel-Liste nochmal an und versuchen Sie die Datei dann nochmal hochzuladen");
        if (error.fail === true || warning.warning === true) {
          displayMessages(collected);
        }

        /*console.log(
          'Die Kursliste der Datei: "' +
            fileName +
            '"\nSortiert nach den Fächern'
        );*/
        //console.log(courseList.allCourses);

        /*console.log(
          'Die Schülerliste der Datei: "' +
            fileName +
            '"\nSortiert nach dem Namen der Schüler'
        );*/
        //console.log(studentList.allStudents);
        //wenn der Aufruf der Excel-Datei einen schweren Fehler hat, dann soll an dieser Stelle abgebrochen werden
        if (fail) {
          return;
        }

        //update the button
        setFileUploaded(true);
        setFeedbackMessage(
          `${courseList.allCourses.length} Kurse und ${studentList.allStudents.length} Schüler eingelesen`
        );
      };

      //wenn der Aufruf der Excel-Datei einen schweren Fehler hat, dann soll an dieser Stelle abgebrochen werden
      if (fail) {
        return;
      }

      //set the courses and students for calendar (globale Variablen)
      setCoursesApp(courseList.allCourses);
      setStudentsApp(studentList.allStudents);

      reader.readAsArrayBuffer(file);
      file = null;
    }
  };

  /** Diese Funktion vereinfacht die Nachricht-Weiterleitung mit Zeilen und Spaltenangabe.
   * Im Index wird die Art der Warnmeldung angegeben.
   *
   * @param row Zeilenangabe der Excel Datei
   * @param col Spaltenangabe der Excel Datei
   * @param message Warnnachricht
   * @param index     0 → header,
                      1 → duplicate,
                      2 → course,
                      3 → student
                      4 → calendar
   */
  function warnUser(row, col, message, index) {
    const msg = message + "(" + (row + 1) + "|" + (col + 1) + ")";
    warning.warnMessage(msg, index);
  }
  /** Diese Funktion vereinfacht die Nachricht-Weiterleitung mit Zeilen und Spaltenangabe.
   *  Im Index wird die Art der Fehlermeldung angegeben.
   *
   * @param row Zeilenangabe der Excel Datei
   * @param message Warnnachricht
   * @param index     0 → header,
                      1 → duplicate,
                      2 → course,
                      3 → student
                      4 → calendar
   */
  function errUser(row, message, index) {
    const msg = message + +(row + 1);
    error.errorMessage(msg, index);
  }

  return (
    <div className="flex items-center justify-center bg-grey-lighter">
      <label
        className={`h-20 w-52 flex flex-col items-center px-2 py-3 rounded-lg shadow-lg tracking-wide uppercase cursor-pointer ${
          fileUploaded
            ? "bg-green-500 text-green-100"
            : "bg-[#0000FF] hover:bg-blue-900 text-white border border-blue-900"
        }`}
      >
        {fileUploaded ? (
          <span className="w-6 h-6">✅</span>
        ) : (
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
              d="M19 14l-7-7-7 7"
            />
          </svg>
        )}
        <span className="mt-1 text-sm leading-normal">
          {fileUploaded ? feedbackMessage : "Kurse hochladen"}
        </span>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleCourseFile}
        />
      </label>
      <Transition.Root show={showErrorModal} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setShowErrorModal}>
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="mt-3 text-center sm:mt-5">
              <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                {messageTitle}
              </Dialog.Title>
              <div className="mt-2">
                {/* Use a div instead of a p tag */}
                <div className="text-sm text-gray-500" style={{ whiteSpace: 'pre-line' }}>
                  {errorMessage}
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                    onClick={handleCloseErrorModal}
                >
                  Schließen
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default CourseReader;
