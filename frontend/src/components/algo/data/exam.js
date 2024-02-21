import { jsDateToString } from "../helpFunctions"
export class Exam {
    constructor(course, date, rating) {
        //Kurs-Objekt zu dem die Prüfung gehört
        this.course = course
        //Zugeordnetes Datum (js date)
        this.date = date
        // Bewertung der Zuordnung, default: maximal schlecht, 999 wird nie vom algo vergeben
        if(rating === undefined){
            this.rating = 999
        }else{
            this.rating = rating
        }
        
    }

    setDate(newDate) {
        this.date = newDate
    }

    setRating(newRating) {
        this.rating = newRating
    }

    toString() {
        const d = jsDateToString(this.date)
        return (
            "Kurs: " + this.course.name + ", Datum: " + d + ", Rating: " + this.rating
        )
    }

}

export default Exam