import { set } from "date-fns";
import { useState, useContext } from "react";
//context api
import AppContext from "../AppContext";
import Course from "./algo/data/course";
import { Constraint } from "./algo/data/constraint";

//radio button
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

/**
 * Renders a form for adding parameters.
 * @param {Object} props - The component props.
 * @param {Function} props.onAdd - The function to be called when the form is submitted.
 * @returns {JSX.Element} The rendered form component.
 */
const AddParameter = ({ onAdd }) => {
  // state for file upload
  const [fileUploaded, setFileUploaded] = useState(false);

  // store in local storage to be displayed in forms even after closing it
  const initialIterations = Number(localStorage.getItem("iterations")) || 20;
  const initialComplexity = Number(localStorage.getItem("complexity")) || 2;
  const initialTargetRating = Number(localStorage.getItem("targetRating")) || 0;
  const initialMinDifference =
    Number(localStorage.getItem("minDifference")) || 0;

  //set initial state
  const [iterations, setIterations] = useState(initialIterations);
  const [complexity, setComplexity] = useState(initialComplexity);
  const [targetRating, setTargetRating] = useState(initialTargetRating);
  const [minDifference, setMinDifference] = useState(initialMinDifference);
  const [constraints, setConstraints] = useState([]); // Declare constraints state

  //tool tip hover
  const [showConstraintsTooltip, setShowConstraintsTooltip] = useState(false);
  const [showIterationsTooltip, setShowIterationsTooltip] = useState(false);
  const [showComplexityTooltip, setShowComplexityTooltip] = useState(false);
  const [showTargetRatingTooltip, setShowTargetRatingTooltip] = useState(false);
  const [showMinDifferenceTooltip, setShowMinDifferenceTooltip] =
    useState(false);

  //feedback after submit
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const { coursesApp } = useContext(AppContext);

  const onSubmit = (e) => {
    //form validation
    e.preventDefault();
    if (iterations === null || iterations === undefined) {
      alert("Bitte füge eine Iterationsanzahl hinzu");
      return;
    }

    if (complexity === null || complexity === undefined) {
      alert("Bitte füge eine Komplexität hinzu");
      return;
    }

    if (targetRating === null || targetRating === undefined) {
      alert("Bitte füge ein Zielrating hinzu");
      return;
    }

    if (minDifference === null || minDifference === undefined) {
      alert("Bitte füge eine Mindestdifferenz hinzu");
      return;
    }

    const updatedConstraints = [...constraints]; // Copy the constraints array without duplicating

    onAdd({
      iterations,
      complexity,
      targetRating,
      minDifference,
      constraints: updatedConstraints, // Pass the updated constraints array
    });

    // Store the last submitted values in the localStorage
    localStorage.setItem("iterations", iterations.toString());
    localStorage.setItem("complexity", complexity.toString());
    localStorage.setItem("targetRating", targetRating.toString());
    localStorage.setItem("minDifference", minDifference.toString());

    setShowFeedback(true);

    // Optionally, hide the feedback message after a few seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 5000);
  };

  /**
   * Resets the form by setting the iterations, complexity, target rating, and minimum difference to their default values.
   */
  const resetForm = () => {
    setIterations(20);
    setComplexity(2);
    setTargetRating(0);
    setMinDifference(0);
  };

  /**
   * Handles the change event of the file input element.
   * Reads the contents of the selected file, parses it as JSON,
   * and sets the parsed data as the constraint state.
   * Displays an error message if the file is not a valid JSON.
   * Does nothing if no file is selected or the wrong file.
   * Counts the number of constraints and displays it as a feedback message.
   * @param {Event} e - The change event object.
   */
  const handleFileChange = (e) => {
    //test if its called
    console.log("handleFileChange called");
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/json") {
        alert("Fehler: Die Datei muss im JSON-Format sein");
        setFileUploaded(false);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target.result);
            //Iterate through the courseApp to find the course object that matches the course.name string.
            //Create a contraint object from the Contraint class with the course object that you found add the date that was read as a Date object.
            //Set the isfavorite property of the contraint object to true or false based on the availability value. if it is not in courseApp dont include it
            const constraints = jsonData
              .map((item) => {
                const course = coursesApp.find(
                  (course) => course.name === item.courseID
                );
                if (!course) return null; // if course is not found, return null
                return new Constraint(
                  course,
                  new Date(item.startDate),
                  item.availability
                );
              })
              .filter(Boolean); // remove null values

            const constraintsCount = constraints.length;
            // Count the number of blocked and favorite constraints
            const blockedCount = constraints.filter(
              (constraints) => constraints.isFavorite === false
            ).length;
            const favoriteCount = constraints.filter(
              (constraints) => constraints.isFavorite === true
            ).length;
            //test if its called
            console.log("jsonData", jsonData);
            console.log("constraints", constraints);

            setConstraints(constraints);
            setFileUploaded(true);
            // Display the number of constraints as a feedback message
            if (constraintsCount === 0) {
              setFeedbackMessage(
                "⚠️ Einschränkungen passen nicht mit Kursen zusammen"
              );

              setFeedbackType("error");
            } else {
              setFeedbackMessage(
                `✅ ${constraintsCount} Einschränkungen
                (${blockedCount} blockiert und ${favoriteCount} favoriten)`
              );
              setFeedbackType("success");
            }
          } catch (error) {
            alert("Fehler beim Lesen der Datei: Ungültiges JSON-Format");
            setFileUploaded(false);
          }
        };

        reader.readAsText(file);
      }
    } else {
      // File is not selected
      setFileUploaded(false);
    }
  };

  return (
    <form
      className="add-form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border-2 border-gray-300"
      onSubmit={onSubmit}
    >
      {showFeedback && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
          role="alert"
        >
          <div>Eingabe wurde gespeichert</div>
        </div>
      )}
      <div className="mb-4 relative">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Constraint hochladen
          <span
            className="ml-2 inline-block bg-gray-200 rounded-full text-xs px-2 cursor-pointer hover:bg-gray-300 relative"
            onMouseEnter={() => setShowConstraintsTooltip(true)}
            onMouseLeave={() => setShowConstraintsTooltip(false)}
          >
            i
            {showConstraintsTooltip && (
              <div className="absolute left-full ml-2 top-0 p-2 w-80 bg-gray-800 text-white text-xs rounded shadow-lg">
                Hier kann die Datei mit Terminwünschen hochgeladen werden, die
                die Anwendung zur Eingabe der Terminwünsche zur Verfügung
                stellt. Die Datei muss im .json Format sein.
              </div>
            )}
          </span>
        </label>
        <label
          className={`w-64 px-2 py-1 border rounded cursor-pointer ${
            fileUploaded
              ? feedbackType === "success"
                ? "border-green-500 bg-green-100 text-green-800"
                : "border-red-500 bg-red-100 text-red-800"
              : "border-gray-400 bg-white text-gray-800"
          }`}
        >
          {fileUploaded ? feedbackMessage : "Datei auswählen"}
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <div className="mb-4 relative">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Iterationsanzahl
          <span
            className="ml-2 inline-block bg-gray-200 rounded-full text-xs px-2 cursor-pointer hover:bg-gray-300 relative"
            onMouseEnter={() => setShowIterationsTooltip(true)}
            onMouseLeave={() => setShowIterationsTooltip(false)}
          >
            i
            {showIterationsTooltip && (
              <div className="absolute left-full ml-2 top-0 p-2 w-80 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Diese Zahl gibt an, wie oft das Programm versucht die Verteilung
                der Schulaufgaben zu verbessern. Je größer die Iterationszahl
                ist, desto mehr Zeit braucht das Programm, ist sie jedoch zu
                klein wird möglicherweise nicht die beste Verteilung gefunden.
                Standard: 20
              </div>
            )}
          </span>
        </label>
        <input
          type="text"
          placeholder="Füge eine Iterationszahl hinzu"
          className="w-full px-4 py-2 border border-gray-400 rounded"
          value={iterations}
          onChange={(e) => setIterations(Number(e.target.value))}
        />
      </div>

      <div className="mb-4 relative">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Komplexität der Vertauschung
          <span
            className="ml-2 inline-block bg-gray-200 rounded-full text-xs px-2 cursor-pointer hover:bg-gray-300 relative"
            onMouseEnter={() => setShowComplexityTooltip(true)}
            onMouseLeave={() => setShowComplexityTooltip(false)}
          >
            i
            {showComplexityTooltip && (
              <div className="absolute left-full ml-2 top-0 p-2 w-60 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Diese Zahl gibt an, wie viele Tauschpartner an einer
                Vertauschung teilnehmen, also wie viele Termine in einem
                Verbesserungsschritt durchgemischt werden, um ein besseres
                Ergebnis zu finden. Diese Zahl sollte mindestens 2 sein und
                maximal so groß, wie die Anzahl der zu verteilenden Termine. Je
                größer sie ist, desto mehr Zeit braucht jedoch wiederum das
                Programm. Standard: 2
              </div>
            )}
          </span>
        </label>
        {/*
        <input
          type="text"
          placeholder="Füge eine Komplexität hinzu"
          className="w-full px-4 py-2 border border-gray-400 rounded"
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
        />
        */}
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          >
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="mb-4 relative">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Zielrating
          <span
            className="ml-2 inline-block bg-gray-200 rounded-full text-xs px-2 cursor-pointer hover:bg-gray-300 relative"
            onMouseEnter={() => setShowTargetRatingTooltip(true)}
            onMouseLeave={() => setShowTargetRatingTooltip(false)}
          >
            i
            {showTargetRatingTooltip && (
              <div className="absolute left-full ml-2 top-0 p-2 w-60 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Wenn die Bewertung der Verteilung diese Zahl erreicht oder
                unterschreitet wird das Programm beendet, auch wenn noch nicht
                alle durch die Iterationszahl festgelegten Durchläufe ausgenutzt
                wurden. Je kleiner das Rating, desto besser die Verteilung.
                Standard: 0
              </div>
            )}
          </span>
        </label>
        <input
          type="text"
          placeholder="Füge ein Zielrating hinzu"
          className="w-full px-4 py-2 border border-gray-400 rounded"
          value={targetRating}
          onChange={(e) => setTargetRating(e.target.value)}
        />
      </div>

      <div className="mb-4 relative">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Mindestdifferenz
          <span
            className="ml-2 inline-block bg-gray-200 rounded-full text-xs px-2 cursor-pointer hover:bg-gray-300 relative"
            onMouseEnter={() => setShowMinDifferenceTooltip(true)}
            onMouseLeave={() => setShowMinDifferenceTooltip(false)}
          >
            i
            {showMinDifferenceTooltip && (
              <div className="absolute left-full ml-2 top-0 p-2 w-80 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Diese Zahl bestimmt, wie groß der Unterschied zwischen den
                Bewertungen aufeinanderfolgender Verteilungen sein muss. Wenn
                der Unterschied kleiner als diese Zahl ist, wird das Programm
                beendet, auch wenn noch nicht alle vorgesehenen Durchläufe
                durchgeführt wurden. Der Standardwert ist 0, was bedeutet, dass
                das Programm erst dann beendet wird, wenn zwei
                aufeinanderfolgende Verteilungen genau die gleiche Bewertung
                haben. Standard: 0
              </div>
            )}
          </span>
        </label>
        <input
          type="text"
          placeholder="füge eine Mindestdifferenz hinzu"
          className="w-full px-4 py-2 border border-gray-400 rounded"
          value={minDifference}
          onChange={(e) => setMinDifference(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <input
          type="submit"
          value="Speichern"
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        />
        <button
          type="button"
          onClick={resetForm}
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          Zurücksetzen
        </button>
      </div>
    </form>
  );
};

export default AddParameter;
