import logo from "./logo.svg";
import "./App.css";

//context api
import React, { useState, useEffect } from "react";
import AppContext from "./AppContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Calendar from "./calendar/Calendar";
import Underheader from "./components/Underheader";

//reactour
import Tour from "reactour";

import * as Toast from "@radix-ui/react-toast";

/**
 * Array of steps for a guided tour.
 * @type {Array<{selector: string, content: string}>}
 */
const steps = [
  {
    selector: ".first-step",
    content:
      "Laden Sie zunächst die Schüler- und Kursdaten hoch. Achten Sie dabei darauf, die richtige Datei auszuwählen. Nach dem Hochladen der Dateien wird der Kalender angezeigt. Vor dem Hochladen der Dateien bleibt der Kalender ausgegraut/gesperrt. Hier können Sie auch die Ergebnisse des Schulaufgabenplaners einsehen und bearbeiten.",
  },
  {
    selector: ".second-step",
    content:
      "Unter dem Knopf “Konfigurieren” können Sie die Parameter des Programms einstellen. Näheres finden Sie im nächsten Fenster, das sich öffnet, wenn Sie auf diesen Knopf klicken.",
  },
  {
    selector: ".third-step",
    content:
      "Wenn Sie auf “Initialisieren” klicken, beginnt das Programm damit, die eingelesenen Daten zu initialisieren und ein erstes Ergebnis zu berechnen. Hierbei werden nur Ihre Constraints des Parameters in der Konfiguration berücksichtigt.",
  },
  {
    selector: ".fourth-step",
    content:
      "Hier wird der Algorithmus gestartet, in dem alle Parameter der Konfiguration berücksichtigt werden. Das Ergebnis wird im unteren Kalender angezeigt.",
  },
  {
    selector: ".fifth-step",
    content:
      "Mit “Next” wird der Algorithmus schrittweise ausgeführt, sodass Sie nur einzelne Änderungen sehen. Das bedeutet, dass nur einzelne Ereignisse im Kalender ausgetauscht werden.",
  },
  {
    selector: ".sixth-step",
    content:
      "Mit “Stop” können Sie den Algorithmus, den Sie bei Start ausgeführt haben, vorzeitig stoppen.",
  },
  {
    selector: ".seventh-step",
    content:
      "Hier wird das Rating der momentanen Platzierung der Schulaufgaben angezeigt. Je kleiner die Zahl, desto besser das Ergebnis.",
  },
  {
    selector: ".eight-step",
    content:
      "Der Kalender ist in Ihrem angegebenen Zeitraum des Schulhalbjahres einsehbar. Um zwischen den Monaten wechseln zu können, haben Sie hierfür Pfeil-Knöpfe. Ein Ereignis können Sie per “Drag and Drop” auf einen beliebigen Tag verschieben. Alternativ können Sie auch per Linksklick ein Ereignis löschen. Unter dem Kalender befinden sich zwei Buttons, um die fertige Schülerliste und Terminliste nach dem Ausführen des Algorithmus herunterzuladen.",
  },
  {
    selector: ".ninth-step",
    content: "Sie können jederzeit die Erläuterung erneut anzeigen lassen.",
  },
];

function App() {
  const [eventsApp, setEventsApp] = useState([]);
  const [coursesApp, setCoursesApp] = useState([]);
  const [studentsApp, setStudentsApp] = useState([]);
  const [examsApp, setExamsApp] = useState([]);
  const [possibleDatesApp, setPossibleDatesApp] = useState([]);
  const [overallRatingApp, setOverallRatingApp] = useState(0);
  //reactour
  const [isTourOpen, setIsTourOpen] = useState(false);

  // enable/disable the calendar
  const [isCalendarEnabled, setCalendarEnabled] = useState(false);

  // start/stop the algorithm
  const [isAlgorithmRunning, setAlgorithmRunning] = useState(false);

  //contraints for algo
  const [constraints, setConstraints] = useState([]);

  useEffect(() => {
    // Check if the tour has been shown before
    if (!localStorage.getItem("tourShown")) {
      // If not, open the tour and set the flag in localStorage
      setIsTourOpen(true);
      localStorage.setItem("tourShown", "true");
    }
  }, []);

  useEffect(() => {
    // Add or remove the style based on whether the tour is open
    if (isTourOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Clean up the style when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isTourOpen]);

  /**
   * Restarts the tour.
   */
  const restartTour = () => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
    // Function to restart the tour
    setIsTourOpen(true);
  };

  return (
    <div className="container">
      <Toast.Provider>
        <AppContext.Provider
          value={{
            eventsApp,
            setEventsApp,
            coursesApp,
            setCoursesApp,
            studentsApp,
            setStudentsApp,
            examsApp,
            setExamsApp,
            possibleDatesApp,
            setPossibleDatesApp,
            overallRatingApp,
            setOverallRatingApp,
            isCalendarEnabled,
            setCalendarEnabled,
            isAlgorithmRunning,
            setAlgorithmRunning,
            constraints,
            setConstraints,
          }}
        >
          <Header onClick={restartTour} />
          <Underheader />
          <Calendar />
          <div className="mt-5 mb-5">
            <p className="text-sm font-semibold text-black">
              Farberklärung für die Kalenderereignisse:
            </p>
            <div className="flex items-center space-x-5 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <p className="text-sm text-black">= Schlecht</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <p className="text-sm text-black">= OK</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-700 rounded-full"></div>
                <p className="text-sm text-black">= Gut</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-800 rounded-full"></div>
                <p className="text-sm text-black">= Ferien und Feiertage</p>
              </div>
            </div>
          </div>
          <Footer />
        </AppContext.Provider>
        <Tour
          steps={steps}
          isOpen={isTourOpen}
          onRequestClose={() => setIsTourOpen(false)}
        />
      </Toast.Provider>
    </div>
  );
}

export default App;
