import Exam from "./data/exam";
import {
  arrayPairs,
  dateToEventString,
  getCourseConstraintMap,
  getRndInteger,
  getWeekNumber,
  getNewCourses,
  getExamsForOldCourses,
  getCopys,
  getPossibleDays,
  newPairs,
  cleanup,
  insertionSort,
} from "./helpFunctions";
import {
  testConstraints,
  testCourses,
  testStudents,
} from "./data/testdata";


import AppContext from "../../AppContext";
import React, { useState, useContext } from "react";

/*Implementierung der Verteilung der Schulaufgaben und deren Bewertung.*/

export function test() {
  let start = new Date("2023-12-01");
  let end = new Date("2024-03-31");
  let blocked = [
    new Date("2023-12-24"),
    new Date("2023-12-25"),
    new Date("2023-12-26"),
    new Date("2023-12-27"),
    new Date("2023-12-28"),
    new Date("2023-12-29"),
    new Date("2023-12-30"),
    new Date("2023-12-31"),
    new Date("2024-01-10"),
    new Date("2024-01-11"),
    new Date("2024-01-12"),
    new Date("2024-01-13"),
    new Date("2024-02-10"),
    new Date("2024-02-11"),
    new Date("2024-02-12"),
    new Date("2024-02-13"),
    new Date("2024-03-10"),
    new Date("2024-03-11"),
    new Date("2024-03-12"),
    new Date("2024-03-13"),
  ];

  const possibleDays = getPossibleDays(start, end, blocked);
  let result = initialDistribution(
    testCourses,
    testStudents,
    testConstraints,
    possibleDays
  );
  console.log(result);

  let i = 0;
  while (i < 20) {
    let next = iterationNextStep(
      result.Events,
      result.Exams,
      result.Students,
      testConstraints,
      possibleDays,
      3
    );
    console.log(i);
    console.log(next);
    result = next;
    i++;
  }
}

export function initialDistribution(
  courses,
  students,
  constraints,
  possibleDates
) {
  /*Erstellen und verteilen von Exams, Rating der Exams und Schüler 
returns result = {Events: Event[], Exams: Exam[], Students: Student[], OverallRating: int}*/ //let exams = newInitialDistribution(courses, possibleDates, constraints, students)

  //Kurse des gleichen Fachs und der gleichen Schiene zusammenfassen
  let newCourses = getNewCourses(courses);
  //Verteilung und Bewertung
  let newExams = [];
  let usedDays = [];

  for (let course of newCourses) {
    let favorites = [];
    let blocked = [];
    //Constraints, die diesen Kurs betreffen auf Favoriten und Geblockt verteilen
    for (let constraint of constraints) {
      if (
        constraint.course.subject === course.name &&
        constraint.course.schiene === course.schiene
      ) {
        if (constraint.isFavorite) {
          favorites.push(constraint.date);
        } else {
          blocked.push(constraint.date);
        }
      }
    }
    //Datum bestimmen, das entweder Favorit ist oder nicht gegen constraints widerspricht
    let dateCandidate;
    if (favorites.length > 0) {
      dateCandidate = favorites[0];
    } else {
      while (
        dateCandidate === undefined ||
        blocked.includes(dateCandidate) ||
        usedDays.includes(dateCandidate)
      ) {
        dateCandidate = possibleDates[getRndInteger(0, possibleDates.length)];
      }
    }
    //exam erstellen und hinzufügen
    newExams.push(new Exam(course, dateCandidate));
    usedDays.push(dateCandidate);
  }

  let exams = getExamsForOldCourses(newExams, courses);

  //Verteilen der Exams auf Schüler
  for (let student of students) {
    student.resetExamlist();
  }
  for (let exam of exams) {
    for (let student of exam.course.students) {
      student.addExam(exam);
    }
  }

  //Rating der Schüler
  for (let student of students) {
    let rating = rateStudentIndividually(student);
    student.rating = rating;
  }

  //Rating der Exams
  for (let exam of exams) {
    let rating = rateExamIndividually(exam, newExams, constraints);
    exam.rating = rating;
  }

  //Overall Rating
  let overallRating = 0;
  for (let exam of exams) {
    overallRating += exam.rating;
  }

  //Events erstellen
  let events = [];

  for (let i = 0; i < exams.length; i++) {
    let event = {
      title: exams[i].course.name,
      start: dateToEventString(exams[i].date),
      allDay: true,
      editable: true,
      id: i,
    };
    events.push(event);
  }

  //Result Objekt erstellen und zurückgeben
  const result = {
    Events: events,
    Exams: exams,
    Students: students,
    OverallRating: overallRating,
  };
  return result;
}

export function iterationNextStep(
  events,
  exams,
  students,
  constraints,
  possibleDates,
  complexity
) {
  /*Iterationsschritt mit einer Vertauschung*/ //Vergleich der Events mit den Exams auf Änderungen vom Nutzer
  let exArr = [];
  let courArr = [];
  for (let event of events) {
    let title = event.title;
    let date = new Date(event.start);
    for (let exam of exams) {
      if (exam.course.name === title) {
        exam.date = date;
        exArr.push(exam);
        courArr.push(exam.course);
      }
    }
  }

  //Erstellen der Kombinierten Exams für zusammengehörige Kurse
  let newCourses = getNewCourses(courArr);
  let newExams = [];
  let done = [];
  for (let course of newCourses) {
    let string = course.subject + course.schiene;
    for (let exam of exArr) {
      if (
        course.schiene === exam.course.schiene &&
        course.subject === exam.course.subject &&
        !done.includes(string)
      ) {
        let newExam = new Exam(course, exam.date, exam.rating);
        done.push(string);
        newExams.push(newExam);
      }
    }
  }
  done = undefined;

  //altes Rating für die zusammengefassten Exams
  let oldRating = 0;
  for (let exam of newExams) {
    let rating = rateExamIndividually(exam, newExams, constraints)
    exam.rating = rating
    oldRating += exam.rating;
  }

  //Erstellen der Kopien aller Exams und Schüler
  let copys = getCopys(students, newCourses, newExams);

  //Versuch alle Exams in ihrer näheren Umgebung zu verschieben und so zu verbessern
  for (let exam of copys.Exams) {
    let oldDate = exam.date;
    let oldRating = exam.rating;
    let bestDate = exam.date;
    let bestRating = exam.rating;
    let dateInArray = possibleDates.find((date) => {
      if (date.getDate() === exam.date.getDate() &&
        date.getMonth() === exam.date.getMonth() &&
        date.getFullYear() === exam.date.getFullYear()) {
        return true;
      } else {
        return false;
      }
    });
    let index = possibleDates.indexOf(dateInArray);

    for (let i = index - 4; i <= index + 4; i++) {
      if (i >= 0 && i < possibleDates.length) {
        exam.date = possibleDates[i];
        //Rating
        for (let student of exam.course.students) {
          let rating = rateStudentIndividually(student);
          student.rating = rating;
        }


        let rating = rateExamIndividually(exam, copys.Exams, constraints);
        //Vergleich
        if (rating < bestRating) {
          bestDate = exam.date;
          bestRating = rating;
        }
      }
    }

    //besten Tag setzen
    for (let realExam of newExams) {
      if (
        realExam.course.subject === exam.course.subject &&
        realExam.course.schiene === exam.course.schiene
      ) {
        realExam.date = bestDate;
      }
    }

    //reset
    exam.date = oldDate;
    exam.rating = oldRating;
  }
  copys = undefined;

  let helpexams = cleanup(newExams, constraints, possibleDates)
  newExams = helpexams
  helpexams = undefined

  //Finden des schlechtesten Exams
  let indexWorstExam = 0;
  let worstExam = newExams[0];
  for (let i = 0; i < newExams.length; i++) {
    if (newExams[i].rating > worstExam.rating) {
      worstExam = newExams[i];
      indexWorstExam = i;
    }
  }

  let pairs = newPairs(newExams.length, complexity, indexWorstExam)

  //Ausprobieren aller Vertauschungen mit dem schlechtesten Exam
  let ratingBestSwitch = 9999;
  let bestSwitch = [];

  for (let pair of pairs) {
    copys = getCopys(students, newCourses, newExams);

    if (pair.includes(indexWorstExam)) {
      //Tausch simulieren
      let dateAtIndex0 = copys.Exams[pair[0]].date;
      for (let index = 0; index < pair.length - 1; index++) {
        let nextIndex = index + 1;
        let date = copys.Exams[nextIndex].date;
        copys.Exams[index].date = date;
      }
      copys.Exams[pair[pair.length - 1]].date = dateAtIndex0;

      //Tausch bewerten
      //Rating der Schüler
      for (let student of copys.Students) {
        let rating = rateStudentIndividually(student);
        student.rating = rating;
      }
      //Rating der Exams
      for (let exam of copys.Exams) {

        let rating = rateExamIndividually(exam, copys.Exams, constraints);
        exam.rating = rating;
      }
      //Overall Rating
      let ratingSwitch = 0;
      for (let exam of copys.Exams) {
        ratingSwitch += exam.rating;
      }

      if (ratingSwitch < ratingBestSwitch) {
        ratingBestSwitch = ratingSwitch;
        bestSwitch = pair;
      }
    }

    copys = undefined;
  }
  //console.log("RatingBestSwitch: " + ratingBestSwitch);
  //console.log(bestSwitch)

  //Durchführen der besten Vertauschung mit den echten Daten

  //console.log("Vorher:")
  //console.log(newExams)
  if (ratingBestSwitch < oldRating) {
    let dateAtIndex0 = newExams[bestSwitch[0]].date;
    for (let index = 0; index < bestSwitch.length - 1; index++) {
      let nextIndex = index + 1;
      let date = newExams[nextIndex].date;
      newExams[index].date = date;
    }
    newExams[bestSwitch[bestSwitch.length - 1]].date = dateAtIndex0;
  }

  helpexams = cleanup(newExams, constraints, possibleDates)
  newExams = helpexams
  helpexams = undefined

  //console.log("Nachher")
  //console.log(newExams)

  //Auftrennen der kombinierten Exams und erstellen des Results
  let oldExams = getExamsForOldCourses(newExams, courArr);

  //Verteilen der Exams auf Schüler
  for (let student of students) {
    student.resetExamlist();
  }
  for (let exam of oldExams) {
    for (let student of exam.course.students) {
      student.addExam(exam);
    }
  }

  //Rating der Schüler
  for (let student of students) {
    let rating = rateStudentIndividually(student);
    student.rating = rating;
  }

  //Rating der Exams
  for (let exam of oldExams) {

    let rating = rateExamIndividually(exam, newExams, constraints);
    exam.rating = rating;
  }

  //Overall Rating
  let overallRating = 0;
  for (let exam of oldExams) {
    overallRating += exam.rating;
  }

  //Events erstellen
  let newEvents = [];

  for (let i = 0; i < oldExams.length; i++) {
    let event = {
      title: oldExams[i].course.name,
      start: dateToEventString(oldExams[i].date),
      allDay: true,
      editable: true,
      id: i,
    };
    newEvents.push(event);
  }

  //Result Objekt erstellen und zurückgeben
  const result = {
    Events: newEvents,
    Exams: oldExams,
    Students: students,
    OverallRating: overallRating,
  };


  return result;
}

export function algo(
  courses, //zu verteilende Kurse, Kursnamen sind unique
  students, //Schülerliste mit zugeordneten Kursen, die S besucht
  constraints, //alle zu berücksichtigenden constraints, keine Konflikte
  possibleDates, //nur zulässige Tage (Wochentage, keine Ferien, keine Feiertage, etc.)
  iterations, //anzahl durchläufe, nach denen der Algo stoppen soll
  complexity, //anzahl der Exams die gleichzeitig pro Iteration getauscht werden sollen
  targetRating, //wenn dieses gesamtrating erreicht ist, wird gestoppt
  minDifference, //wenn sich rating um weniger als das vom durchlauf vorher unterscheidet, wird gestoppt
  events,
  exams
) {
  let oldRating = 0;
  for (let exam of exams) {
    oldRating += exam.rating;
  }

  /*const {
    isAlgorithmRunning,
    setAlgorithmRunning,
  } = useContext(AppContext);*/


  let result = iterationNextStep(
    events,
    exams,
    students,
    constraints,
    possibleDates,
    complexity
  );
  let newRating = result.OverallRating;
  let difference = oldRating - newRating;
  oldRating = newRating;
  let i = 1;
  while (
    //isAlgorithmRunning &&
    i < iterations &&
    difference > minDifference &&
    newRating > targetRating
  ) {
    let next = iterationNextStep(
      result.Events,
      result.Exams,
      result.Students,
      constraints,
      possibleDates,
      complexity
    );
    newRating = next.OverallRating;
    difference = oldRating - newRating;
    oldRating = newRating;
    i++;
    result = next;
  }

  return result;

  /*let courseMap = getCourseConstraintMap(courses, constraints) //Map<Course, Constraint[]>

    let exams = []
    exams = oldInitialDistribution(courseMap, possibleDates)

    //Verteilung der Exams auf Schüler:
    for (let exam of exams) {
        for (let student of exam.course.students) {
            student.addExam(exam)
        }
    }

    //Rating der Initialen Verteilung
    rateExamDistribution(exams, courseMap, students)
    //console.log(exams)

    //Berechne Gesamtrating
    let overallRating = 0
    for (let exam of exams) {
        overallRating += exam.rating
    }

    //Tauschkombinationen ("Knoten") bestimmen: Array aus möglichen Kombinationen
    let pairs = [];//enthält später Arrays der Länge complexity mit den Indizes für Exams
    let arr = [];//enthält später so viele zahlen wie exams einträge hat
    let skip = false;
    for (let i = 0; i < exams.length; i++) {
        arr.push(i);
    }
    if (complexity < exams.length) {
        pairs = arrayPairs(arr, complexity);
        console.log(pairs);
    } else { skip = true; }

    //bisherige Durchläufe der Verbesserung
    let j = 0;
    //OverallRating des letzten durchgeführten Durchlaufs, initialisiert mit unendlich
    let lastRating = overallRating;
    //Differenz zwischen aktuellem und letztem Rating
    let difference = 2147483647;

    //Iterative Verbesserung:
    while (!skip && j < iterations /*&& overallRating > targetRating && difference > minDifference) {
        /*
        Bedingungen:
        * overallRating muss immer kleiner als LastRating sein!
         */
  //TODO: Iteratives Verbessern der Verteilung!
  /*
        * "knoten" bestimmen
            - alle möglichen vertauschungen mit "complexität" vielen Exams durchführen
        * Rating für Knoten berechnen
        * Besten Knoten auswählen
        */

  //Finden des am schlechtesten bewertete Exam
  /*let indexWorstExam = 0;
        let worstExam = exams[0];
        for (let i = 0; i < exams.length; i++) {
            if (exams[i].rating > worstExam.rating) {
                worstExam = exams[i];
                indexWorstExam = i;
            }
        }

        let ratingBestSwitch = 2147483647;
        let bestSwitch = [];
        for (let pair of pairs) {
            if (pair.includes(indexWorstExam)) {
                //Echte Kopien der Exams udn Schüler erstellen
                let clonedExams = []
                for (let exam of exams) {
                    //clonedExams.push({...exam});
                    let newCourse = new Course(exam.course.name, exam.course.schiene, exam.course.subject, exam.course.students, exam.course.teacher)
                    let newDate = new Date(exam.date.getFullYear(), exam.date.getMonth(), exam.date.getDate())
                    let newExam = new Exam(newCourse, newDate, exam.rating);
                    clonedExams.push(newExam)
                }
                let clonedStudents = [];
                for (let student of students) {
                    clonedStudents.push({ ...student });
                }
                //Tausch simuliert
                let dateAtIndex0 = clonedExams[pair[0]].date;
                for (let index = 0; index < pair.length - 1; index++) {
                    let nextIndex = index + 1;
                    let date = clonedExams[nextIndex].date;
                    clonedExams[index].date = date;
                }
                clonedExams[pair[pair.length - 1]].date = dateAtIndex0;
                //Verteilung bewerten
                rateExamDistribution(clonedExams, courseMap, clonedStudents)
                let ratingSwitch = 0;
                for (let exam of clonedExams) {
                    ratingSwitch += exam.rating
                }
                //vergleichen ob tausch besser war als der bisherige beste beste.
                if (ratingSwitch < ratingBestSwitch) {
                    ratingBestSwitch = ratingSwitch;
                    bestSwitch = pair;
                }
            }
        }
        //console.log("RatingBestSwitch: " + ratingBestSwitch);
        //console.log(bestSwitch)
        //Echten Tausch durchführen und bewerten
        let dateAtIndex0 = exams[bestSwitch[0]].date;
        for (let index = 0; index < bestSwitch.length - 1; index++) {
            let nextIndex = index + 1;
            let date = exams[nextIndex].date;
            exams[index].date = date;
        }
        exams[bestSwitch[bestSwitch.length - 1]].date = dateAtIndex0;
        rateExamDistribution(exams, courseMap, students)

        //Schleifenende:
        overallRating = 0;
        for (let exam of exams) {
            overallRating += exam.rating
        }

        console.log(exams)
        console.log(students)
        console.log("OverallRating: " + overallRating)
        console.log("Differenz: " + difference)
        console.log("Durchlauf: " + j)

        j++;
        difference = lastRating - overallRating;
        lastRating = overallRating;
    }

    //Erstellen der Kalender-Events
    let events = []

    for (let i = 0; i < exams.length; i++) {
        let event = {
            title: exams[i].course.name,
            start: dateToEventString(exams[i].date),
            allDay: true,
            editable: true,
            id: i
        }
        events.push(event);
    }
    {
            title: "Tag der Deutschen Einheit",
            start: "2023-10-03",
            allDay: true,
            editable: false,
            id: 1000
        }, 

    const result = {
        Events: events,
        Exams: exams,
        Students: students,
        OverallRating: overallRating
    }
    console.log(result)
    return result;*/
}

function oldInitialDistribution(courseMap, dates) {
  let exams = [];
  let usedDays = [];

  courseMap.forEach((constraints, course) => {
    let dateCandidate = dates[getRndInteger(0, dates.length)];
    let blockedDays = usedDays;
    let hasFavorite = false;
    for (let i = 0; i < constraints.length; i++) {
      let currentConstraint = constraints[i];
      if (currentConstraint.isFavorite) {
        dateCandidate = currentConstraint.date;
        hasFavorite = true;
        break;
      } else {
        blockedDays.push(currentConstraint.date);
      }
    }
    if (hasFavorite) {
    } else {
      let j = 0;
      while (blockedDays.includes(dateCandidate)) {
        if (j === dates.length) {
          break;
        }
        dateCandidate = dates[getRndInteger(0, dates.length)];
        j++;
      }
    }
    usedDays.push(dateCandidate);
    exams.push(new Exam(course, dateCandidate));
  });

  return exams;
}

export function rateExamDistribution(exams, courseMap, students) {
  //rate Students individually
  for (let student of students) {
    //reset
    student.rating = 999;
    /*
        Ablauf:
        * Abstand zwischen den einzelnen Klausuren
            - sortieren nach Datum
            - Differenz in Tagen zwischen je zwei aufeinander folgenden Klausuren
        * Rating basierend auf dem Abstand => je größer der Abstand, desto kleiner das Rating
            - ca. 100 Tage in einem Schulhalbjahr
            - Abstände aufaddieren und anschließend von 100 abziehen
            - Überprüfen ob Rating <o, falls ja, auf 0 setzen
        * Folgen:
            - Rating kann nicht <0 werden
            - Rating vermutlich auch für sehr gute Verteilungen ziemlich hoch...
            - Durchschnittliches Rating ermitteln und 100 auswechseln
        */

    //sortieren mit insertionsort
    for (let i = 1; i < student.exams.length; i++) {
      let zuSortierendesExam = student.exams[i];
      let j = i;
      while (j > 0 && student.exams[j - 1].date > zuSortierendesExam.date) {
        student.exams[j] = student.exams[j - 1];
        j = j - 1;
      }
      student.exams[j] = zuSortierendesExam;
    }

    //Abstand zwischen den Exams
    let overallDifference = 0;
    let conflict = false;
    for (let i = 0; i < student.exams.length - 1; i++) {
      let differenceInDays = Math.round(
        (student.exams[i + 1].date - student.exams[i].date) /
        (1000 * 60 * 60 * 24)
      );
      if (differenceInDays === 0) {
        conflict = true;
      }
      overallDifference = overallDifference + differenceInDays;
    }
    let rating = 100 - overallDifference;
    if (rating < 0) {
      rating = 0;
    }
    if (conflict) {
      rating = 500;
    } //Tödliches Rating, falls zwei exams am gleichen Tag
    student.rating = rating;
  }

  //rate Exams
  for (let exam of exams) {
    let rating = 0;
    let examDate = exam.date;
    let subject = exam.course.subject;
    let numberExamsInWeek = 1;

    //check constraints
    let hasFavorite = false;
    let favoriteDate = new Date();
    let forbiddenDates = [];
    let constraints = courseMap.get(exam.course);
    if (constraints === undefined) {
    } else {
      for (let c of constraints) {
        if (c.isFavorite) {
          hasFavorite = true;
          favoriteDate = c.date;
        } else {
          forbiddenDates.push(c.date);
        }
      }
      if (hasFavorite && exam.date !== favoriteDate) {
        rating += 50; // Verstoß gegen Favorit
      } else if (forbiddenDates.includes(exam.date)) {
        rating += 50; //Verstoß gegen constraint
      }
    }

    //check klausuren am gleichen Tag
    for (let i = 0; i < exams.length; i++) {
      let currentExam = exams[i];
      if (currentExam !== exam) {
        if (getWeekNumber(examDate) === getWeekNumber(currentExam.date)) {
          numberExamsInWeek++;
        }

        if (
          currentExam.course.subject === subject &&
          currentExam.date === examDate
        ) {
          //gleiches Fach, gleicher Tag => rating bleibt gleich
          numberExamsInWeek--;
        } else if (
          currentExam.course.subject === subject &&
          currentExam.date !== examDate
        ) {
          rating += 30; // gleiches Fach, unterschiedlicher Tag
        } else if (
          currentExam.course.subject !== subject &&
          currentExam.date === examDate
        ) {
          rating += 30; // ungleiches Fach, gleicher Tag
        }
      }
    }

    //Anzahl pro Woche
    if (numberExamsInWeek > 2) {
      rating += 20;
    } else if (numberExamsInWeek > 1) {
      rating += 10;
    }

    //Student Rating berücksichtigen: Durchschnitt aller Studentratings zum examrating hinzufügen
    let currentStudents = exam.course.students;
    let sum = 0;
    for (let student of currentStudents) {
      sum = sum + student.rating;
    }
    let avg = Math.round(sum / currentStudents.length);
    rating += avg;

    exam.rating = rating;
  }
}

function rateStudentIndividually(student) {
  /*
    Ablauf:
    * Abstand zwischen den einzelnen Klausuren
        - sortieren nach Datum
        - Differenz in Tagen zwischen je zwei aufeinander folgenden Klausuren
    * Rating basierend auf dem Abstand => je größer der Abstand, desto kleiner das Rating
        - ca. 100 Tage in einem Schulhalbjahr
        - Abstände aufaddieren und anschließend von 100 abziehen
        - Überprüfen ob Rating <o, falls ja, auf 0 setzen
    * Folgen:
        - Rating kann nicht <0 werden
        - Rating vermutlich auch für sehr gute Verteilungen ziemlich hoch...
        - Durchschnittliches Rating ermitteln und 100 auswechseln
    */

  //sortieren mit insertionsort
  for (let i = 1; i < student.exams.length; i++) {
    let zuSortierendesExam = student.exams[i];
    let j = i;
    while (
      j > 0 &&
      student.exams[j - 1].date.getTime() > zuSortierendesExam.date.getTime()
    ) {
      student.exams[j] = student.exams[j - 1];
      j = j - 1;
    }
    student.exams[j] = zuSortierendesExam;
  }

  //Abstand zwischen den Exams
  let overallDifference = 0;
  let conflict = false;
  for (let i = 0; i < student.exams.length - 1; i++) {
    let differenceInDays = Math.round(
      (student.exams[i + 1].date.getTime() - student.exams[i].date.getTime()) /
      (1000 * 60 * 60 * 24)
    );
    if (differenceInDays === 0) {
      conflict = true;
    }
    overallDifference = overallDifference + differenceInDays;
  }
  let rating = 200 - overallDifference;
  if (rating < 0) {
    rating = 0;
  }
  if (conflict) {
    rating += 500;
  } //Tödliches Rating, falls zwei exams am gleichen Tag

  return rating;
}

function rateExamIndividually(exam, exams, constraints) {
  let rating = 0;
  let examDate = exam.date;
  let subject = exam.course.subject;
  let numberExamsInWeek = 1;
  //get constraints
  let constraintsForExam = [];
  for (let constraint of constraints) {
    if (
      constraint.course.subject === exam.course.subject &&
      constraint.course.schiene === exam.course.schiene
    ) {
      constraintsForExam.push(constraint);
    }
  }

  //check constraints
  let hasFavorite = false;
  let favoriteDate = new Date();
  let forbiddenDates = [];

  for (let c of constraintsForExam) {
    if (c.isFavorite) {
      hasFavorite = true;
      favoriteDate = c.date;
    } else {
      forbiddenDates.push(c.date);
    }
  }
  if (hasFavorite && exam.date.getTime() !== favoriteDate.getTime()) {
    rating += 200; // Verstoß gegen Favorit
  } else if (forbiddenDates.includes(exam.date)) {
    rating += 200; //Verstoß gegen constraint
  }

  //check klausuren am gleichen Tag
  for (let i = 0; i < exams.length; i++) {
    let currentExam = exams[i];
    if (!(currentExam.course.name === exam.course.name && currentExam.course.schiene === exam.course.schiene)) {
      if (getWeekNumber(examDate) === getWeekNumber(currentExam.date)) {
        numberExamsInWeek++;
      }

      if (
        currentExam.course.subject === subject &&
        currentExam.date.getTime() === examDate.getTime()
      ) {
        //gleiches Fach, gleicher Tag => rating bleibt gleich
        numberExamsInWeek--;
      } else if (
        currentExam.course.subject === subject &&
        currentExam.date !== examDate
      ) {
        rating += 30; // gleiches Fach, unterschiedlicher Tag
      } else if (
        currentExam.course.subject !== subject &&
        currentExam.date === examDate
      ) {
        rating += 300; // ungleiches Fach, gleicher Tag
      }
    }
  }

  //Anzahl pro Woche
  if (numberExamsInWeek > 2) {
    rating += 20;
  } else if (numberExamsInWeek > 1) {
    rating += 10;
  }

  //Abstand zu anderen Klausuren
  /*exams = insertionSort(exams)
  let i = exams.indexOf(exam)
  if (i > 0 && i < exams.length - 1) {
    let differenceInDays = Math.round((exams[i].date.getTime() - exams[i - 1].date.getTime()) / (1000 * 60 * 60 * 24)) +
      Math.round((exams[i + 1].date.getTime() - exams[i].date.getTime()) / (1000 * 60 * 60 * 24));
    let distance = 14 - differenceInDays
    if (distance < 0) { distance = 0 }
    rating += distance * 20
  }*/



  //Student Rating berücksichtigen: Durchschnitt aller Studentratings zum examrating hinzufügen
  let currentStudents = exam.course.students;
  let sum = 0;
  for (let student of currentStudents) {
    sum = sum + student.rating;
  }
  let avg = Math.round(sum / currentStudents.length);
  rating += avg;

  return rating;
}
