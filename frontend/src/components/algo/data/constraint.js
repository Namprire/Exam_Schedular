export class Constraint {
    constructor(course, date, isFavorite) {
        //Kurs für den der Konstraint gilt
        this.course = course
        //Date Objekt mit Tag und Monat
        this.date = date
        //Boolean true falls Datum Favorit, false falls Datum nich möglich
        this.isFavorite = isFavorite
    }
}
