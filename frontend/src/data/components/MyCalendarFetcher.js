import React, { useRef, useState, useContext, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react';
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import { ErrorMessage, WarnMessage } from "./MyAlertFunction";
import { DateCollector } from "./MyDateCollector";

//set const globally for calendar and algo
import AppContext from "../../AppContext";

/** Event sammelt Informationen bezüglich einer Veranstaltung, die an einem Tag belegt wird.
 * Da diese aus einem Kalender gelesen wird ist es in der Regel entweder ein Feiertag oder Ferientage.

 * @property {string} title Name der Veranstaltung
 * @property {Date} start Tag, an dem die Veranstaltung beginnt
 * @property {Date} end Tag, an dem die Veranstaltung beendet (kann auch leer sein → Feiertag)
 * @property {string} id zufällig generierte ID (erstellt mit nanoID, size: 5)

 *  Ansonsten hat Event auch zwei Variablen mit einem festen Defaultwert:
 * @property {boolean} allDay 'true' → Veranstaltung ist ganztägig
 * @property {boolean} editable 'false' → Veranstaltung ist nicht veränderbar (z.B. 'Drag & Drop' oder 'delete')

 * Zusätzlich hat Event eine weite boolean Variable (für die Syntaxueberpruefung hilfreich):
 * @property {boolean} holiday gibt an, ob diese Veranstaltung ein Feiertag ist oder Ferien sind.
 */
class Event {
  constructor(title, start, end) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.allDay = true;
    this.editable = false;

    //für Christians Syntaxüberprüfung (eine Idee)
    if (this.end === null) this.holiday = false;
    if (this.end !== null) this.holiday = true;

    this.id = nanoid(5);
  }
}

/** Die Klasse Events beinhaltet ein Array aller Events aus der Kalendar-Excel
 *  Datei, als auch den die Zeitspanne, in der die Events stattfinden (Halbjahr Beginn & Ende)
 *  diese sind
 *  @property begin Beginn des Schulhalbjahres
 *  @property end Ende des Schulhalbjahres
 *  @property events Liste aller Veranstaltungen
 */
class Events {
  begin;
  end;
  constructor() {
    this.events = [];
  }

  /** setTimeZone legt den Anfang und das Ende des Schulhalbjahres fest
   * @param begin Anfang des Schulhalbjahres
   * @param end Ende des Schulhabjahres
   */
  setTimeZone(begin, end) {
    this.begin = begin;
    this.end = end;
  }

  //addEvent
  addEvent(event) {
    this.events.push(event);
  }

  /** getEvents sortiert die aktuelle Kalenderliste und gibt diese zurück
   *  in Form eines Arrays. Das Array hat die Form:
   **  events = [ [begin, end],
   *             event 1,
   *             event 2,
   *             event 3,...
   *           ]
   *   wobei [begin, end] die Zeitspanne des Schulhalbjahres ist
   */
  get getEvents() {
    /*console.log(
      "Das ist die gegebene Zeitspanne für das Halbjahr:\n" +
        this.begin +
        " - " +
        this.end
    );*/
    let events = this.events.sort((e1, e2) => {
      if (e1.holiday === false && e2.holiday === false) {
        if (e1.start < e2.start) {
          return -1;
        }
        if (e1.start > e2.start) {
          return 1;
        }
        return 0;
      }
      if (e1.holiday === true && e2.holiday === true) {
        if (e1.start < e2.start) {
          return -1;
        }
        if (e1.start > e2.start) {
          return 1;
        }
        return 0;
      }
      if (e1.holiday) return 1;
      if (e2.holiday) return -1;
      console.log("Da stimmt was nicht beim Sortieren der Events! (Kalendar)");
      return 0;
    });

    let eventList = [];
    const timezone = [this.begin, this.end];
    eventList.push(timezone);
    for (let e = 0; e < events.length; e++) {
      const ev = events[e];
      let event = {
        title: ev.title,
        start: ev.start,
        end: ev.end,
        allDay: ev.allDay,
        editable: ev.editable,
        id: ev.id,
      };
      eventList.push(event);
    }
    return eventList;
  }
}

//Globale Variable für die Funktion CalendarReader (down bellow)
let eventList;
let warning;
let error;
let dateCollector;
let collected;

let fail;

/** Der CalendarReader ließt die gebene Kalenderliste in Form einer Excel-Datei ein.
 *
 * @input Kalenderliste als Excel-Datei
 *
 * @throws error wenn die Excel-Datei nicht in der korrekter Struktur/Formatierung gegeben wird
 * @throws fail wenn der Fetcher einen Fehler oder eine Unvollständigkeit in der Kursliste entdeckt.
 * @throws warning wenn der Fetcher was auffälliges bemerkt, was jedoch nicht zwingend falsch sein muss.
 **  Entdeckt der Fetcher einen Fehler, so wird diese ausgegeben und bricht die Prozedur ab, ehe es
 * an den Kalender weitergeleitet wird. \
 *  Der Fehler muss behoben werden, ehe man fortsetzen kann.
 */
const CalendarReader = () => {
  //Nams section
  //relevant für mehrmaliges hochladen derselben Datei
  const fileInputRef = useRef(null);

  //events for calendar
  const { eventsApp, setEventsApp } = useContext(AppContext);

  //button modification
  const [fileUploaded, setFileUploaded] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

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

  const handleCalendarFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;

      //um sicher zu gehen, dass der Fetcher auch die richtige Datei einließt, muss dieser Überprüfung vorgenommen werden
      const regex = /kalender/i;
      if (!regex.test(fileName.replace(/\.xlsx$/, ""))) {
        displayMessages(
          "Der Name Ihrer Excel-Datei '" +
            fileName +
            "' enthält nicht das Wort 'kalender'.\n\n" +
            "Bitte achten Sie darauf die richtige Datei hochzuladen.\n" +
            "Achten Sie auch darauf, dass ihre Datei das Wort 'Kalender' enthält (egal in welcher Form, z.B. 'Kalenderliste'), " +
            "sodass das Programm auch richtig arbeiten kann.\n\n" +
            "Um einen kritischen Fehler zu vermeiden wird das Hochladen an dieser Stelle abgebrochen.."
        );
        return;
      }

      //reset fail
      fail = false;

      //FileReader, der die Excel-Datei einließt
      const reader = new FileReader();
      reader.onload = (e) => {
        /* Resetet den Input Wert, sodass man auch mehrmals dieselbe Datei hochladen kann.
         * Wird gerade dann aufgerufen, wenn die 'zuletzt eingelesene Datei' = 'aktuell eingelesene Datei' ist
         */
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {type: "array", cellDates: "true"});
        // Assuming the first sheet is the one you want to read
        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(sheet["!ref"]);

        eventList = new Events();
        warning = new WarnMessage();
        error = new ErrorMessage();
        collected = [];

        /** Diese Syntax Funktion ließt eine Header-Zeile der Excel-Datei und überprüft
         *  diese auf Vollständigkeit und richtige Schreibweise.
         *  Enthält die Zeile einen Fehler, so wird eine Warnungmeldung geschrieben.
         **  Wichtig: Trotz Fehlers in der Headerzeile, kann das Programm fortgesetzt werden.
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

          if (
              colA !== names[0].replace(/\s/g, "").toLowerCase() ||
              colB !== names[1].replace(/\s/g, "").toLowerCase() ||
              colC !== names[2].replace(/\s/g, "").toLowerCase()
          ) {
            warning.warnMessage(
                "\nAchtung, die Zeile." +
                row +
                " ist unvollständig!\n" +
                "Bitte achten Sie auf die folgende Notation:\n" +
                "Spalte A → " +
                names[0] +
                "\nSpalte B → " +
                names[1] +
                "\nSpalte C → " +
                names[2] +
                "\nBitte passen Sie die Bezeichnung dieser Zeile richtig an!\n\n",
                0
            );
          }
        }

        /** validateDate prüft, ob das gegebene Datum auch wirklich ein Datum ist
         *
         * @param date das Datum, welches validiert werden soll
         * @return {number|null} 1: wenn es ein Datum Objekt ist
         * @return               null: wenn es leer ist (endTag)
         * @return               -1: wenn es kein gültiges Dautm ist
         */
        function validateDate(date) {
          if (date instanceof Date) return 1;
          if (date === null) {
            return null;
          }
          return -1;
        }

        /* Mit einer Schleife kann man durch die einzelnen Zellen iterieren
         * und die dann auch anschließend in einem String speichern.
         * In diesem Sinne wird ein Array verwendet.
         * Der Header und der eigentliche Inhalt der Excel Datei
         * werden in zwei unterschiedliche Schleife abgearbeitet
         */

        //Schleife.1: Header (Zeile 1)
        let header1 = [];
        header1.push("Schulhalbjahr (Zeitspanne)");
        header1.push("Halbjahr - Beginn");
        header1.push("Halbjahr - Ende");
        syntaxHeader(1, header1);

        //Schleife.2: Header (Zeile 4)
        let header2 = [];
        header2.push("Name der Veranstaltung");
        header2.push("Beginn");
        header2.push("Ende");
        syntaxHeader(4, header2);

        //Schleife.3: Einlesen des Halbjahr - Beginn und End Datum
        //(+1, da die erste Zelle nicht eingelesen wird)
        let rowArray = [];
        for (let colIndex = range.s.c + 1; colIndex < range.e.c; colIndex++) {
          const rowIndex = range.s.r + 1;
          const cellAddress = XLSX.utils.encode_cell({
            r: rowIndex,
            c: colIndex,
          });
          const cellValue = sheet[cellAddress] ? sheet[cellAddress].v : null;
          rowArray.push(cellValue);
        }

        let tzBegin = rowArray[0];
        let tzEnd = rowArray[1];

        //validate short-function
        const corBegin = validateDate(tzBegin);
        const corEnd = validateDate(tzEnd);

        //Falls das Datum ungültig ist
        if (corBegin !== -1 || corEnd !== -1)
          dateCollector = new DateCollector(tzBegin, tzEnd);
        else {
          tzBegin = "0000-00-00";
          tzEnd = "0000-00-00";
          dateCollector = new DateCollector(
              new Date(0, 0, 0),
              new Date(0, 0, 0)
          );
        }

        eventList.setTimeZone(
            format(tzBegin, "yyyy-MM-dd"),
            format(tzEnd, "yyyy-MM-dd")
        );

        //Schleife.4: Bearbeitung des Inhaltes der Excel Datei
        for (let rowIndex = range.s.r + 4; rowIndex <= range.e.r; rowIndex++) {
          let rowArray = [];
          let colIndex;
          for (colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            const cellAddress = XLSX.utils.encode_cell({
              r: rowIndex,
              c: colIndex,
            });
            const cellValue = sheet[cellAddress] ? sheet[cellAddress].v : null;
            rowArray.push(cellValue);
            /* rowArray[0]: title of the event
             * rowArray[1]: start day
             * rowArray[2]: end day
             */
          }

          const eventName = rowArray[0];
          let startDay = rowArray[1];
          let endDay = rowArray[2];

          //Event Namen Prüfen
          const eventSyntax = eventList.events.find(
              (e) => e.name === eventName
          );
          if (eventSyntax !== undefined) {
            error.errorMessage(
                "\n(Siehe Zeile: " +
                rowIndex +
                ') Der Name der Veranstaltung "' +
                eventName +
                '" kommt doppelt vor!',
                4
            );
          }

          if (eventName === null) continue;

          const correctStart = validateDate(startDay);
          const correctEnd = validateDate(endDay);

          const collect = dateCollector.collectDate(startDay, endDay);

          if (collect === -1) {
            error.errorMessage(
                "\n(Siehe Zeile: " +
                rowIndex +
                '): Die Veranstaltung: "' +
                eventName +
                '" befindet sich außerhalb des Schulhalbjahres!',
                4
            );
          }
          if (collect === -2) {
            error.errorMessage(
                "\n(Siehe Zeile: " +
                rowIndex +
                '): Der Tag der Veranstaltung: "' +
                eventName +
                '" ist bereits belegt!',
                4
            );
            //return -2;
          }
          if (collect === -3) {
            error.errorMessage(
                "\n(Siehe Zeile: " +
                rowIndex +
                '): Die Veranstaltung "' +
                eventName +
                '" überschneidet sich mit einer der anderen Ferien!',
                4
            );
            //return -3
          }
          if (collect === -4) {
            error.errorMessage(
                '\n(Siehe "' +
                eventName +
                '", Zeile: ' +
                rowIndex +
                "): " +
                'Der "Ende" Tag ist vor dem "Begin" Tag',
                4
            );
          }
          if (collect === -5) {
            error.errorMessage(
                "\n(Siehe Zeile: " +
                rowIndex +
                '): Die Veranstaltung: "' +
                eventName +
                '" besitzt keinen "Beginn" Tag!',
                4
            );
          }
          if (collect === -6) {
            error.errorMessage(
                "\n(Siehe Zeile: " +
                rowIndex +
                '): Die Veranstaltung: "' +
                eventName +
                '" hat ein ungültiges Datum!',
                4
            );
          }

          if (startDay instanceof Date)
            startDay = format(startDay, "yyyy-MM-dd");
          if (endDay instanceof Date) endDay = format(endDay, "yyyy-MM-dd");

          const event = new Event(eventName, startDay, endDay);

          if (!(collect < 0)) eventList.addEvent(event);
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
          'Die Kalendarliste der Datei: "' +
            fileName +
            '"\n Aufsteigend sortiert'
        );*/
        //console.log(eventList.getEvents);
        //console.log(dateCollector.getCollector);

        //wenn der Fetcher einen schweren Fehler hat, dann soll an dieser Stelle abgebrochen werden
        if (error.fail) {
          return;
        }
        //update the button
        setFileUploaded(true);
        //set the feedback message in german date format
        setFeedbackMessage(
          `${eventList.getEvents.length - 1} Events vom ${new Date(
            eventList.getEvents[0][0]
          ).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })} bis ${new Date(eventList.getEvents[0][1]).toLocaleDateString(
            "de-DE",
            { day: "2-digit", month: "2-digit", year: "2-digit" }
          )} eingelesen`
        );



        /**set the courses and students for calendar (da kannst du ran, Nam :)
         * Die Funktion gibt dir einen Array mit allen events und der Zeitspanne
         * Die Zeitspanne findest du im Index 0 → dort befindet sich ein weiteres
         * Array der Form: timezone = [begin, end]
         * Wenn du es hast, dann kannst du diesen Kommentar löschen +1
         */

        //console.log(eventList.getEvents);
        setEventsApp(eventList.getEvents);
      };

      reader.readAsArrayBuffer(file);
    }
  };

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
          {fileUploaded ? feedbackMessage : "Kalender hochladen"}
        </span>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleCalendarFile}
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

export default CalendarReader;
