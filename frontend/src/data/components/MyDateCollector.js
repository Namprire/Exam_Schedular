import { compareAsc, eachDayOfInterval, getTime } from "date-fns";

/** Diese Klasse soll alle belegte Tage in einem Array sammeln
 * und neu hinzufügte Tage auf Verfügbarkeit überprüfen
 */

export class DateCollector {
    /**
     * @param begin Beginn des Schulhalbjahres
     * @param end Ende des Schulhalbjahres
     */
    constructor(begin, end) {
        this.begin = begin;
        this.end   = end;

        this.dayCollector       = [];
        this.holidayCollector   = [];
    }

    /** Diese Funktion fügt den Tag in den Day-Collector hinzu.
     *
     * Der Parameter ist ein Date Objekt.
     * @param day der Feiertag
     * @returns {number} return 1, wenn die Operation erfolgreich war,
     * sonst -1, wenn der Tag außerhalb des Schulhalbjahres liegt,
     * sonst -2 wenn der Tag bereits belegt ist
     */
    addDay(day){
        //console.log(day);
        if(this.dayCollector.length === 0) {
            this.dayCollector.push(day);
            return 1;
        }
        if(compareAsc(day, this.begin) === -1 || compareAsc(day, this.end) === 1)
            return -1
        const search = this.dayCollector.find((d) => d.getTime() === day.getTime());
        //console.log("Day: " + day + "\n search result: " + search);
        if (search === undefined) {
            this.dayCollector.push(day);
            return 1;
        }
        return -2;
    }

    /** Diese Funktion fügt jeden Tag innerhalb dieser Ferien in den Holiday-Collector hinzu.
     *
     * Beide Parameter sind Date-Objekte.
     * @param begin Beginn der Ferien
     * @param end Ende der Ferien
     * @return return 1, wenn die Operation erfolgreich ausgeführt wurde,
     * @return return -3, wenn sich die Ferien in irgendeiner Form überschneiden
     * @return return -4, wenn der Tag "begin" nach dem Tag "end" kommt
     */
    addHoliday(begin, end){
        //console.log("add holiday: " + begin + " - " + end);
        if(compareAsc(begin, end) === 1)
            return -4

        const holiday = eachDayOfInterval({
            start: begin,
            end: end
        });

        if(this.holidayCollector.length === 0)
            this.holidayCollector.concat(holiday);
        //console.log("The begin and end: " + begin + " - " + end);
        for (let i = 0; i < holiday.length; i++) {
            const search = this.holidayCollector.find((h) =>
                h.getTime() === holiday[i].getTime());
            //console.log(holiday[i]);
            if(search !== undefined)
                //irgendeine Form aka eine Form, lol
                return -3;
        }
        this.holidayCollector = this.holidayCollector.concat(holiday);
        //console.log(this.holidayCollector);
        return 1;
    }

    /** Diese Funktion übernimmt die Tage eines Events. Anschließend stellt sie fest
     * ob es ein Feiertag oder Ferientage sind und die Parameter
     * an die entsprechende Funktion addHoliday oder addDay weiter.
     *
     * @param beginDay Begin-Tag der Veranstaltung
     * @param endDay Ende-Tag der Veranstaltung
     *
     * @return 1, wenn das Event erfolgreich collected wurde.
     * @return -1, wenn das Event außerhalb des Schulhalbjahres liegt.
     * @return -2, wenn der Feiertag bereits belegt ist.
     * @return -3, wenn die Ferien sich in irgendeiner Form überschneiden.
     * @return -4, wenn der Tag "begin" nach dem Tag "end" kommt
     * @return -5, wenn der Tag "begin" leer ist
     * @return -6, wenn der Tag ungültig ist (z.B. '32.13.2034')
     */
    collectDate(beginDay, endDay){
        if(beginDay === null) {
            return -5;
        }

        if(endDay === null) {
            if(beginDay instanceof Date)
                return this.addDay(beginDay);
            else
                return -6;
        }
        if((beginDay instanceof Date) && (endDay instanceof Date))
            return this.addHoliday(beginDay, endDay);
        else
            return -6;
    }

    // Diese Funktion gibt die sortierte Liste aller belegten Tage
    get getCollector() {
        return (this.dayCollector.concat(this.holidayCollector)).sort(compareAsc);
    }
}