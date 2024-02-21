import Course from "./data/course"
import Exam from "./data/exam"
import Student from "./data/students"

//Hilfsfunktionen, die im Algorithmus verwendet werden. 

export function jsDateToString(date) {
    /*getFullYear()	Get year as a four digit number (yyyy)
      getMonth()	Get month as a number (0-11)
      getDate()	Get day as a number (1-31)
      getDay()	Get weekday as a number (0-6) */
    const d = date.getDay()
    var weekday = ""
    switch (d) {
        case 1:
            weekday = "Mo."
            break
        case 2:
            weekday = "Di."
            break
        case 3:
            weekday = "Mi."
            break
        case 4:
            weekday = "Do."
            break
        case 5:
            weekday = "Fr."
            break
        case 6:
            weekday = "Sa."
            break
        case 0:
            weekday = "So."
            break
        default:
            break
    }
    var month = date.getMonth() + 1
    var day = date.getDate()
    var year = date.getFullYear()

    return "" + weekday + " " + day + "." + month + "." + year
}

export function getWeekNumber(date) {
    const currentYear = date.getFullYear()
    const jan04 = new Date(currentYear, 0, 4)
    let firstMonday = new Date(currentYear, 0, 4)

    switch (jan04.getDay()) {
        case 1: //Mo
            firstMonday = new Date(currentYear, 0, 4)
            break
        case 2: //Di
            firstMonday = new Date(currentYear, 0, 3)
            break
        case 3: //Mi
            firstMonday = new Date(currentYear, 0, 2)
            break
        case 4: //Do
            firstMonday = new Date(currentYear, 0, 1)
            break
        case 5: //Fr
            firstMonday = new Date(currentYear - 1, 11, 31)
            break
        case 6: //Sa
            firstMonday = new Date(currentYear - 1, 11, 30)
            break
        case 0: //So
            firstMonday = new Date(currentYear - 1, 11, 29)
            break
        default:
            break
    }

    const days = Math.floor(
        (date.valueOf() - firstMonday.valueOf()) / (24 * 60 * 60 * 1000)
    )
    const week = Math.floor(days / 7)

    return week
}

//This JavaScript function always returns a random number between min (included) and max (excluded):
export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

export function getCourseConstraintMap(courses, constraints) {
    let courseMap = new Map()

    for (let index = 0; index < courses.length; index++) {
        const course = courses[index]
        let constraintArray = []
        for (let i = 0; i < constraints.length; i++) {
            const constraint = constraints[i]
            if (constraint.course.name === course.name) {
                constraintArray.push(constraint)
            }
        }
        courseMap.set(course, constraintArray)
    }

    return courseMap
}

export function sortBySubject(courses) {
    let map = new Map() // Map<subject, Course[]>
    for (let course of courses) {
        let subject = course.subject
        let array = map.get(subject)
        if (array === undefined) {
            array = [];
        }
        array.push(course)
        map.set(subject, array);
    }
    return map;
}

export function getNewCourses(courses) {//fasst Kurse mit gleichem Fach und gleicher Schiene zu einem Kurs zusammen
    let newCourses = [];
    let map = sortBySubject(courses)//Map<subject, Course[]>
    let subjects = Array.from(map.keys())

    for (let subject of subjects) {
        let courseArr = map.get(subject)
        if (!(courseArr === undefined)) {
            let schienen = [];
            for (let course of courseArr) {
                if (!schienen.includes(course.schiene)) {
                    newCourses.push(new Course(subject, course.schiene, subject, course.students, course.teacher))
                    schienen.push(course.schiene)
                } else {
                    for (let c of newCourses) {
                        if (c.name === subject && c.schiene === course.schiene) {
                            let arr = c.students.concat(course.students)
                            c.students = arr
                        }
                    }
                }
            }
        }

    }
    return newCourses
}

export function getExamsForOldCourses(newExams, oldCourses) {//trennt zusammengefasste Kurse wieder auf und erstellt Exams zu alten Kursen
    let oldExams = [];
    for (let exam of newExams) {
        let subject = exam.course.name
        let schiene = exam.course.schiene
        for (let course of oldCourses) {
            if (course.subject === subject && course.schiene === schiene) {
                oldExams.push(new Exam(course, exam.date, exam.rating))
            }
        }
    }
    return oldExams
}

export function getCopys(students, courses, exams) {
    let copiedExams = []
    let copiedCourses = []
    let copiedStudents = []

    for (let student of students) {
        let name = student.name
        let rating = student.rating
        let newStudent = new Student(name, undefined, undefined, rating)
        copiedStudents.push(newStudent)
    }

    for (let course of courses) {
        let name = course.name
        let schiene = course.schiene
        let subject = course.subject
        let teacher = course.teacher
        let schueler = []
        let newCourse = new Course(name, schiene, subject, schueler, teacher)
        for (let s of course.students) {
            for (let copyS of copiedStudents) {
                if (s.name === copyS.name) {
                    newCourse.addStudent(copyS)
                    copyS.addCourse(newCourse)
                }
            }
        }
        copiedCourses.push(newCourse)
    }

    for (let exam of exams) {
        let coursename = exam.course.name
        let schiene = exam.course.schiene
        let date = exam.date
        let rating = exam.rating
        for (let course of copiedCourses) {
            if (course.name === coursename && course.schiene === schiene) {
                let newExam = new Exam(course, date, rating)
                copiedExams.push(newExam)
                for (let student of course.students) {
                    student.addExam(newExam)
                }
                break
            }
        }
    }

    const result = { Students: copiedStudents, Courses: copiedCourses, Exams: copiedExams }
    return result
}

export function getDateWeeknrMap(dates) {
    let map = new Map()
    for (let index = 0; index < dates.length; index++) {
        const element = dates[index]
        const week = getWeekNumber(element)
        map.set(element, week)
    }
    return map
}

export function getSubjectsFromExams(exams) {
    let map = new Map()

    for (let exam of exams) {
        let subject = exam.course.subject
        let currentExams = map.get(subject)
        if (!(currentExams === undefined)) {
            map.delete(subject)
            currentExams.push(exam)
            map.set(subject, currentExams)
        } else {
            map.set(subject, [exam])
        }
    }
    return map
}

export function getSubjectsFromCourses(courses) {
    let map = new Map()
    for (let c of courses) {
        let subject = c.subject
        let currentCourses = map.get(subject)
        if (!(currentCourses === undefined)) {
            map.delete(subject)
            currentCourses.push(c)
            map.set(subject, currentCourses)
        } else {
            map.set(subject, [c])
        }
    }
    return map
}

export function dateToEventString(date) {
    /*getFullYear()	Get year as a four digit number (yyyy)
        getMonth()	Get month as a number (0-11)
        getDate()	Get day as a number (1-31)
        getDay()	Get weekday as a number (0-6) */
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month
    }
    let year = date.getFullYear();
    let string = "" + year + "-" + month + "-" + day;
    return string
}

export function newPairs(examLength, complexity, indexWorstExam) {
    //Funktion, die die Tauschpartner der Komplexität erstellt, die indesWorstExam enthalten
    let pairs = []
    //0te Iteration: Pairs enthalten 1 element
    if (complexity === 2) {
        pairs = [[indexWorstExam]]
    }
    else {
        for (let i = 0; i < examLength; i++) {
            pairs.push([i])
        }
    }
    //1. bis vorletzte Iteration: es wird jeder mit jedem verpaart
    for (let i = 1; i < complexity - 1; i++) {
        let newPairs = []
        for (let pair of pairs) {
            for (let j = 0; j < examLength; j++) {
                if (!pair.includes(j)) {
                    let newPair = [...pair, j]
                    newPairs.push(newPair)
                }

            }
        }
        pairs = newPairs
    }
    //letzte Iteration: letzter Durchgang jeder mit jedem und rauswurf von pairs ohne indexWorstExam
    let newPairs = []
    for (let pair of pairs) {
        for (let j = 0; j < examLength; j++) {
            if (pair.includes(indexWorstExam) && !pair.includes(j)) {
                let newPair = [...pair, j]
                newPairs.push(newPair)
            } else if (j === indexWorstExam && !pair.includes(j)) {
                let newPair = [...pair, j]
                newPairs.push(newPair)
            }

        }
    }
    pairs = newPairs
    return pairs
}

export function arrayPairs(exams, complexity) {
    //Quelle: https://www.geeksforgeeks.org/print-all-possible-combinations-of-r-elements-in-a-given-array-of-size-n/
    // Javascript program to print all
    // combination of size r in an array of size n   
    let result = [];
    /* arr[]  ---> Input Array
    data[] ---> Temporary array to store current combination
    start & end ---> Starting and Ending indexes in arr[]
    index  ---> Current index in data[]
    r ---> Size of a combination to be printed */
    function combinationUtil(arr, data, start, end, index, r) {

        // Current combination is ready to be printed, print it
        if (index === r) {
            let miniArray = []
            for (let j = 0; j < r; j++) {
                miniArray.push(data[j]);
                //document.write(data[j]+" ");
            }
            result.push(miniArray);
            //document.write("<br>")
        }

        // replace index with all possible elements. The condition
        // "end-i+1 >= r-index" makes sure that including one element
        // at index will make a combination with remaining elements
        // at remaining positions
        for (let i = start; i <= end && end - i + 1 >= r - index; i++) {
            data[index] = arr[i];
            combinationUtil(arr, data, i + 1, end, index + 1, r);
        }
    }

    // The main function that prints all combinations of size r
    // in arr[] of size n. This function mainly uses combinationUtil()
    function printCombination(arr, n, r) {

        // A temporary array to store all combination one by one
        let data = new Array(r);

        // Print all combination using temporary array 'data[]'
        combinationUtil(arr, data, 0, n - 1, 0, r);
    }

    /*Driver function to check for above function*/
    let arr = exams;
    let r = complexity;
    let n = arr.length;
    printCombination(arr, n, r);


    // This code is contributed by rag2127
    return result;
}

export function getPossibleDays(
    start, //Start des Semesters als date
    end, //Ende des Semesters als date
    blockedDays //date[] mit Ferien und Feiertagen
) {
    let possibleDays = []
    let day = start
    while (day.getDate() !== end.getDate() || day.getMonth() !== end.getMonth() || day.getFullYear() !== end.getFullYear()) {
        if (day.getDay() !== 6 //Tag ist nicht Samstag
            && day.getDay() !== 0 //Tag ist nicht Sonntag
            //folgenden Kommentar braucht es, sonst mag es meine find() funktion nicht:
            // eslint-disable-next-line no-loop-func 
            && blockedDays.find(d => { //Tag ist nicht in blocked Days enthalten
                if (d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear()) {
                    return true
                } else { return false }
            }) === undefined
        ) {
            possibleDays.push(day)
        }
        //Tag hochzählen
        day = new Date(day.getTime() + (24 * 60 * 60 * 1000))
    }

    return possibleDays;

}

export function insertionSort(array) {
    for (let i = 1; i < array.length; i++) {
        let zuSortierendesExam = array[i];
        let j = i;
        while (
            j > 0 &&
            array[j - 1].date.getTime() > zuSortierendesExam.date.getTime()
        ) {
            array[j] = array[j - 1];
            j = j - 1;
        }
        array[j] = zuSortierendesExam;
    }
    return array
}

function nextPossibleDay(today, possibleDays) {

    let dateInArray = possibleDays.find((date) => {
        if (date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()) {
            return true;
        } else {
            return false;
        }
    });
    let index = possibleDays.indexOf(dateInArray);
    let nextDay = new Date()

    if (index < possibleDays.length - 2) {
        nextDay = possibleDays[index + 1]
    } else {
        nextDay = possibleDays[0]
    }
    /*let nextDay = new Date(today.getTime() + (24 * 60 * 60 * 1000))
    // eslint-disable-next-line no-loop-func
    while (undefined !== possibleDays.find((d) => {
        if (d.getDate() === nextDay.getDate()
            && d.getMonth() === nextDay.getMonth()
            && d.getFullYear() === nextDay.getFullYear()) {
            return true
        } else { return false }
    })) {
        let helpday = new Date(nextDay.getTime() + (24 * 60 * 60 * 1000))
        nextDay = helpday
    }*/
    return nextDay
}

export function cleanup(exams, constraints, possibleDays) {
    /*for (let exam of exams) {
        let subject = exam.course.subject
        let schiene = exam.course.schiene
        let date = exam.date

        //check auf exams am gleichen tag und verschiebe auf den nächsten möglichen tag
        for (let e of exams) {
            if (date.getTime() === e.date.getTime() &&
                (subject !== e.course.subject || schiene !== e.course.schiene)) {
                let nextday = nextPossibleDay(date, possibleDays)
                for (let constraint of constraints) {
                    if (constraint.course.subject === subject &&
                        constraint.course.schiene === schiene &&
                        constraint.isFavorite === false) {
                        while (constraint.date.getTime() === nextday.getTime()) {
                            nextday = nextPossibleDay(date, possibleDays)
                        }
                    }
                }
                date = nextday
            }
        }
        exam.date = date
    }*/

    //sortieren mit insertionsort
    for (let i = 1; i < exams.length; i++) {
        let zuSortierendesExam = exams[i];
        let j = i;
        while (
            j > 0 &&
            exams[j - 1].date.getTime() > zuSortierendesExam.date.getTime()
        ) {
            exams[j] = exams[j - 1];
            j = j - 1;
        }
        exams[j] = zuSortierendesExam;
    }

    let examsPerWeek = new Map() // Map<Number, Exam[]> die exams pro woche
    let firstWeek = getWeekNumber(exams[0].date)
    let lastWeek = getWeekNumber(exams[exams.length - 1].date)
    for (let exam of exams) {
        let week = getWeekNumber(exam.date)
        let array = examsPerWeek.get(week)
        if (array === undefined) {
            array = [exam]
        } else {
            array = [...array, exam]
        }
        examsPerWeek.set(week, array)
    }
    console.log(examsPerWeek)
    console.log("First Week: " + firstWeek)
    console.log("Last Week: " + lastWeek)

    examsPerWeek.forEach((value, key) => {
        //nichts, wenn länge = 1 ist, da nur eine Klausur
        if (value.length === 2 && value[0].date.getTime() === value[1].date.getTime())
        //wenn 2 Klausuren in einer Woche sind und beide am gleichen Tag liegen, wenn nicht ist alles ok
        {
            let date0 = value[0].date
            if (!date0.getDay() === 1) {//wenn die nullte klausur nicht am Montag ist, auf einen früheren möglichen Tag legen
                let newDate = new Date(date0.getTime() - (24 * 60 * 60 * 1000))
                let dateInArray = possibleDays.find((date) => {
                    if (date.getDate() === newDate.getDate() &&
                        date.getMonth() === newDate.getMonth() &&
                        date.getFullYear() === newDate.getFullYear()) {
                        return true;
                    } else {
                        return false;
                    }
                });
                let daynr = newDate.getDay()
                while (dateInArray === undefined) {
                    if (daynr === 1) { break }
                    let d = new Date(newDate.getTime() - (24 * 60 * 60 * 1000))
                    newDate = d
                    // eslint-disable-next-line no-loop-func
                    dateInArray = possibleDays.find((date) => {
                        if (date.getDate() === newDate.getDate() &&
                            date.getMonth() === newDate.getMonth() &&
                            date.getFullYear() === newDate.getFullYear()) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    daynr = newDate.getDay()
                }
                date0 = newDate
            }

            let date1 = value[1].date
            if (!date1.getDay() === 5) {//wenn die nullte klausur nicht am Freitag ist, auf einen späteren möglichen Tag legen
                let newDate = new Date(date1.getTime() + (24 * 60 * 60 * 1000))
                let dateInArray = possibleDays.find((date) => {
                    if (date.getDate() === newDate.getDate() &&
                        date.getMonth() === newDate.getMonth() &&
                        date.getFullYear() === newDate.getFullYear()) {
                        return true;
                    } else {
                        return false;
                    }
                });
                let daynr = newDate.getDay()
                while (dateInArray === undefined) {
                    if (daynr === 5) { break }
                    let d = new Date(newDate.getTime() + (24 * 60 * 60 * 1000))
                    newDate = d
                    // eslint-disable-next-line no-loop-func
                    dateInArray = possibleDays.find((date) => {
                        if (date.getDate() === newDate.getDate() &&
                            date.getMonth() === newDate.getMonth() &&
                            date.getFullYear() === newDate.getFullYear()) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    daynr = newDate.getDay()
                }
                date1 = newDate
            }
            if (date0.getTime() === date1.getTime()) {
                let nextDate = nextPossibleDay(date1, possibleDays)
                let newWeek = getWeekNumber(nextDate)
                value[1].date = nextDate
                let newArray = examsPerWeek.get(newWeek)
                if (newArray === undefined) {
                    newArray = [value[1]]
                } else {
                    newArray = [...newArray, value[1]]
                }
                examsPerWeek.set(newWeek, newArray)
                value.splice(1, 1)
            } else {
                value[0].date = date0
                value[1].date = date1
            }

        }

        if (value.length >= 3) {
            for (let i = 1; i <= value.length - 2; i++) {
                let date1 = value[i].date
                let newDate = new Date(date1.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 Tage später
                let dateInArray = possibleDays.find((date) => {
                    if (date.getDate() === newDate.getDate() &&
                        date.getMonth() === newDate.getMonth() &&
                        date.getFullYear() === newDate.getFullYear()) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (dateInArray === undefined) {
                    newDate = nextPossibleDay(newDate, possibleDays)
                }
                let newWeek = getWeekNumber(newDate)
                value[i].date = newDate
                let newArray = examsPerWeek.get(newWeek)
                if (newArray === undefined) {
                    newArray = [value[i]]
                } else {
                    newArray = [...newArray, value[i]]
                }
                examsPerWeek.set(newWeek, newArray)
                value.splice(1, 1)
            }


        }

        console.log("Week: " + key)
        console.log("Exams that Week: " + value)
    })
    return exams
}
