/** Course enthält Informationen von einem individuellen Kurs
 * @property name Name des Kurses (z.B. '1b1')
 * @property schiene die zugewiesene Schiene des Kurses
 * @property subject der Fach des Kurses
 * @property student Liste der Schüler, die an dem Kurs teilnehmen
 * @property teacher der Lehrer, der diesen Kurs unterrichtet
 */
export class Course {
    constructor(name, schiene, subject, students, teacher) {
        //Kursname als String
        this.name = name
        //realisiert Schieneneinteilung
        this.schiene = schiene
        //Schulfach
        this.subject = subject
        // Array mit Schülernamen
        this.students = students
        // Lehrername
        this.teacher = teacher
    }
    /*addStudent fügt einen Studenten in den Kurs hinzu
     * und berücksichtigt dabei keine doppelten Schüler einzufügen
     */
    addStudent(student){
        //Funktion von Christian (für MyCourseFetcher.js)
        /* diese If-Abfrage soll den CourseReader davon
         * abhalten null-Objekte in die Liste zu pushen
        */
        if(!(student === null))
            if(this.students.find((s) => s.name === student.name)) {
                return -1;
            }
            this.students.push(student);
        return 1;
    }

}

export default Course;