/** Student enthält Informationen eines individuellen Schuelers
 * @property name der Name des Schuelers
 * @property course Liste der Kurse, an die der Schueler teilnimmt
 * @property exams Liste der Pruefungen, die der Schueler hat
 * @property rating sein Termin-Bewertung, welches von Algo bestimmt wird
 */
export class Student {
    constructor(name, courses, exams, rating) {
        this.name = name
        if (courses === undefined) {
            this.courses = []
        } else {
            this.courses = courses
        }
        if (exams === undefined) {
            this.exams = []
        } else {
            this.exams = exams
        }
        if (rating === undefined) {
            this.rating = 999
        } else {
            this.rating = rating
        }

    }

    setCourselist(newCourseArray) {
        this.courses = newCourseArray
    }

    //addCourse fuegt seiner Kursliste den Kurs 'newCourse' hinzu
    addCourse(newCourse) {
        this.courses.push(newCourse)
    }

    setExamlist(newExamArray) {
        this.exams = newExamArray
    }

    //addExam fuegt seiner Pruefungsliste die Prüfung 'newExam' hinzu
    addExam(newExam) {
        this.exams.push(newExam)
    }

    //resetExamlist leert die akutelle Pruefungsliste des Schuelers und setzt sie auf 0
    resetExamlist() {
        this.exams = []
    }

    setRating(newRating) {
        this.rating = newRating
    }
}

export default Student;