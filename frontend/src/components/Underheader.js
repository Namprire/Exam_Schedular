import React, { useState, useContext, useEffect } from "react";
import Button from "./Button";
import { algo, initialDistribution, iterationNextStep } from "./algo/algo";
import {
  testCourses,
  testStudents,
  testConstraints,
  testDays,
} from "./algo/data/testdata";
import Popup from "./Popup";
import ParameterForm from "./ParameterForm";

import MyCourseFetcher from "../data/components/MyCourseFetcher";
import MyCalendarFetcher from "../data/components/MyCalendarFetcher";

//context api
import AppContext from "../AppContext";

//ui component
import MyToast from "./MyToast";
import { set } from "date-fns";

/**
 * Represents the Underheader component.
 * This component is responsible for rendering the Underheader section of the application.
 * It includes buttons for configuring parameters, initializing the application, starting the algorithm,
 * executing the next step in the iteration process, and stopping the algorithm.
 * It also displays the overall rating of the schedule.
 */
const Underheader = () => {
  const [openPopup, setOpenPopup] = useState(false);

  const [iterations, setIterations] = useState(20);
  const [complexity, setComplexity] = useState(2);
  const [targetRating, setTargetRating] = useState(0);
  const [minDifference, setMinDifference] = useState(0);

  //gray out buttons
  const [isInitialEnabled, setInitialEnabled] = useState(false);
  const [isUploaded, setUploaded] = useState(false);

  //display toast
  const [toastOpen, setToastOpen] = useState(false);

  // Define a state variable to store the rating from two calls ago
  const [ratingTwoCallsAgo, setRatingTwoCallsAgo] = useState(null);

  //event fuer kalender
  const {
    eventsApp,
    setEventsApp,
    coursesApp,
    setCoursesApp,
    studentsApp,
    setStudentsApp,
    examsApp,
    setExamsApp,
    possibleDatesApp,
    overallRatingApp,
    setOverallRatingApp,
    isAlgorithmRunning,
    setAlgorithmRunning,
    constraints,
    setConstraints,
  } = useContext(AppContext);

  useEffect(() => {
    if (coursesApp.length === 0 || eventsApp.length === 0) {
      setUploaded(false);
    } else {
      setUploaded(true);
    }
  }, [coursesApp, eventsApp]);

  /**
   * Updates the events by combining the new events with the previous events, filtering out any duplicates.
   * @param {Array} prevEvents - The array of previous events.
   * @param {Array} newEvents - The array of new events.
   * @returns {Array} - The updated array of events.
   */
  function updateEvents(prevEvents, newEvents) {
    // Assuming newEvents is an array of new events and each event has an 'id' property
    const newIds = newEvents.map((event) => event.id);

    // Filter out the old events that have the same id as the new events
    const filteredEvents = prevEvents.filter(
      (event) => !newIds.includes(event.id)
    );

    // Log the events
    console.log("New Events:", newEvents);
    console.log("Filtered Events:", filteredEvents);

    // Combine the filtered events with the new events
    return [...filteredEvents, ...newEvents];
  }

  /**
   * Initializes the start of the application by performing initial distribution of courses, students, constraints, and test days.
   * Updates the events, exams, students, and overall rating in the application state.
   */
  const initialStart = () => {
    setAlgorithmRunning(true);
    const result = initialDistribution(
      coursesApp,
      studentsApp,
      constraints,
      possibleDatesApp
    );

    setEventsApp((prevEvents) => updateEvents(prevEvents, result.Events));
    setExamsApp(result.Exams);
    setStudentsApp(result.Students);
    setOverallRatingApp(result.OverallRating);
    console.log(result);

    setAlgorithmRunning(false);
  };

  /**
   * Starts the algorithm to generate a schedule based on the provided inputs.
   */
  async function start() {
    setAlgorithmRunning(true);
    // const result = await algo(
    //   coursesApp,
    //   studentsApp,
    //   constraints,
    //   possibleDatesApp,
    //   iterations,
    //   complexity,
    //   targetRating,
    //   minDifference,
    //   eventsApp,
    //   examsApp
    // );

    let oldRating = 0;
    for (let exam of examsApp) {
      oldRating += exam.rating;
    }

    let result = await iterationNextStep(
      eventsApp,
      examsApp,
      studentsApp,
      constraints,
      possibleDatesApp,
      complexity
    );
    let newRating = result.OverallRating;
    let difference = oldRating - newRating;
    oldRating = newRating;
    let i = 1;
    while (
      isAlgorithmRunning &&
      i < iterations &&
      difference > minDifference &&
      newRating > targetRating
    ) {
      console.log("iteration", i);
      let next = await iterationNextStep(
        result.Events,
        result.Exams,
        result.Students,
        constraints,
        possibleDatesApp,
        complexity
      );
      newRating = next.OverallRating;
      difference = oldRating - newRating;
      oldRating = newRating;
      i++;
      result = next;
    }
    setEventsApp((prevEvents) => updateEvents(prevEvents, result.Events));
    setExamsApp(result.Exams);
    setStudentsApp(result.Students);
    setOverallRatingApp(result.OverallRating);
    console.log(result);
    setAlgorithmRunning(false);
    //oeffne toast
    setToastOpen(true);
  }

  /**
   * Executes the next step in the iteration process.
   * Updates the state variables with the result of the iteration.
   */
  const next = () => {
    console.log("next");
    setAlgorithmRunning(true);
    const oldRating = overallRatingApp;
    const result = iterationNextStep(
      eventsApp,
      examsApp,
      studentsApp,
      constraints,
      possibleDatesApp,
      complexity
    );
    setEventsApp((prevEvents) => updateEvents(prevEvents, result.Events));
    setExamsApp(result.Exams);
    setStudentsApp(result.Students);
    setOverallRatingApp(result.OverallRating);

    // If the rating from two calls ago is the same as the current rating, display a toast
    if (result.OverallRating === ratingTwoCallsAgo) {
      setToastOpen(true);
    }

    // Update the rating from two calls ago
    setRatingTwoCallsAgo(overallRatingApp);
  };

  const stop = () => {
    console.log("stop");
    setAlgorithmRunning(false);
  };

  //Set Parameter
  const addParameter = (parameter) => {
    setIterations(parameter.iterations);
    setComplexity(parameter.complexity);
    setTargetRating(parameter.targetRating);
    setMinDifference(parameter.minDifference);
    setConstraints(parameter.constraints);
    console.log(parameter);
    console.log(testCourses);
    console.log(testStudents);
    console.log(testConstraints);
    console.log(testDays);
  };

  return (
    <header className="bg-white text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="first-step flex space-x-4">
          <div>
            <MyCourseFetcher />
          </div>
          <div>
            <MyCalendarFetcher />
          </div>
        </div>

        <Button
          color="blue"
          text="Konfigurieren"
          onClick={() => setOpenPopup(true)}
          className="second-step h-19"
        />
        <div>
          <div
            className={`inline-flex ${
              isUploaded ? "" : "opacity-50 pointer-events-none"
            }`}
          >
            <Button
              color="blue"
              text="Initialisieren"
              onClick={() => {
                if (coursesApp.length === 0 || eventsApp.length === 0) {
                  return;
                }
                initialStart();
                setInitialEnabled(true);
              }}
              className="third-step h-19"
            />
          </div>

          <div
            className={`inline-flex ${
              isInitialEnabled ? "" : "opacity-50 pointer-events-none"
            }`}
          >
            <Button
              color="blue"
              text="Start"
              onClick={start}
              className="fourth-step h-19"
            />
            <Button
              color="blue"
              text="Next"
              onClick={next}
              className="fifth-step h-19"
            />
            <Button
              color="blue"
              text="Stop"
              onClick={stop}
              className="sixth-step h-19"
            />
          </div>
        </div>
      </div>

      <MyToast
        open={toastOpen}
        setOpen={setToastOpen}
        title="🎉 Algorithmus abgeschlossen 🎉"
        description="📚 Die Prüfungen wurden fertig gesetzt. Das Rating wird sich nicht mehr ändern. 🏁"
      />

      <div className="seventh-step flex items-center space-x-5">
        <p className="text-lg font-semibold text-black">Rating:</p>
        <span className="text-xl font-bold text-black">{overallRatingApp}</span>
      </div>

      <Popup
        title="Parameter Einstellen"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <ParameterForm onAdd={addParameter} />
      </Popup>
    </header>
  );
};

export default Underheader;
