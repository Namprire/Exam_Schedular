/* Diese Funktionen soll die Warnmeldung verschiedener Fehler handhaben
 *  Dabei unterscheiden wir zwischen zwei Meldungsarten
    - Warnmeldung:  Der Fetcher hat was auffälliges bemerkt, jedoch beeinträchtigt es
      den Schulaufgabenplaner eventuell nicht
    - Errormeldung: Ein schwerer Fehler wurde bemerkt und dieser muss umgehend gefixt werden
 * um das zu ermöglichen wird hierfür eine Klasse erstellt, die verschiedene Fehler- und Warn-
 * meldung ergreift und anschließend in der Webapplikation ausgibt (sofern diese auch vorhanden sind)
 */

/** WarnMessage Bemerkt der Fetcher was auffälliges, so wird dies an die WarnMessage-Funktion
    weitergeleitet. Diese wird dann zum Schluss des Fetching Prozesses sämtliche
    Warn Meldungen ausgeben (sofern diese auch vorhanden sind)
 */
export class WarnMessage {

    /** constructor erstellt folgende Collector für die Warnmeldungen:
     * @param header    Warn Nachrichten in der Header Syntax
     * @param duplicate Warn Nachrichten bezüglich der Duplikate
     *
     * @param course    Warn Nachrichten bezüglich der Schülerliste (Lücken etc.)
     * @param student   Warn Nachrichten bezüglich der Schülerliste (Lücken etc.)
     *
     * @param calendar  Warn Nachrichten bezüglich des Datum der Events
     ** Zu Beginn haben manche collector bereits ein Standard Errornachricht
     */
    constructor() {
        //Gilt für den Course- und CalendarFetcher
        this.header = [];
        this.duplicate = [];

        //CourseFetcher
        this.course = [];
        this.student = []

        //CalendarFetcher
        this.calendar = [];

        //Standard Value (wenn nötig)
        this.duplicate.push("\nWARNUNG! Es haben sich folgende Duplikate eingeschlichen!:");

        this.course.push("\nWARNUNG! Unvollständige Eingabe in folgenden Zeilen:");
        this.student.push("\nWARNUNG! Es wurden Lücken in folgende Stellen entdeckt\n" +
                          "Angabe in (Zeile|Spalte):");

        this.warning = false;

    }

    /** Diese Funktion nimmt die Warn Nachrichten auf.

     * @param message   Warn String Nachricht, die weitergeleitet werden soll
     * @param index     Art der Warnmeldung
     * @param index     0 → header,
     * @param index     1 → duplicate,
     * @param index     2 → course,
     * @param index     3 → student
     * @param index     4 → calendar
     */
    warnMessage(message, index) {
        switch (index) {
            //header
            case 0:
                this.header.push(message);
                break;
            //duplicate
            case 1:
                this.duplicate.push(message);
                break;
            //course
            case 2:
                this.course.push(message);
                break;
            //student
            case 3:
                this.student.push(message);
                break;
            //calendar
            case 4:
                this.calendar.push(message);
                break;
            default:
                console.error("Bei der warnHeader Funktion wurde ein ungültiger index angebeben: " + index
                    + "\nDer Gültigkeitsbereich liegt bei 0-4 (siehe @param)");
        }
    }
    /** Diese Funktion gibt alle bisher erstellte Warnmeldungen, die im Laufe von dem Fetcher
     *  erstellt wurden (sofern welche auch vorhanden sind)
     *
     */
    displayMessage(){
        let collected = [];

        if(this.header.length > 0) {
            collected.push(this.header.join(" "));
            collected.push("\n");
            this.warning = true;
        }

        if(this.duplicate.length > 1) {
            collected.push(this.duplicate.join(" "));
            collected.push("\n");
            this.warning = true;
        }

        if(this.student.length > 1) {
            collected.push(this.student.join(" "));
            collected.push("\n");
            this.warning = true;
        }

        if(this.course.length > 1) {
            collected.push(this.course.join(" "));
            collected.push("\n");
            this.warning = true;
        }

        if(this.calendar.length > 1) {
            collected.push(this.calendar.join(" "));
            collected.push("\n");
            this.warning = true;
        }

        return collected;
    }
}

/** ErrorMessage: Entdeckt der Fetcher einen Fehler, so wird dies an die ErrorMessage-Funktion
 weitergeleitet. Diesee wird dann zum Schluss des Fetching Prozesses sämtliche
 Error Meldungen ausgeben (sofern diese auch vorhanden sind)
 */
export class ErrorMessage {
    /** der constructor erstellt folgende Collector für die Errormeldung:
     * @param header    Error Nachrichten in der Header Syntax
     * @param duplicate Error Nachrichten bezüglich der Duplikate

     * @param course    Error Nachrichten bezüglich Kursangabe (null oder sonstiges)
     * @param student   Error Nachrichten bezüglich der Schülerliste (Lücken etc.)

     * @param calendar  Error Nachrichten bezüglich des Datum der Events
     ** Zu Beginn haben manche collector bereits ein Standard Errornachricht
     */
    constructor() {
        //Gilt für den Course- und CalendarFetcher
        this.header     = [];
        this.duplicate  = [];

        //CourseFetcher
        this.course    = [];
        this.student   = [];

        //CalendarFetcher
        this.calendar   = [];

        //Standard Value (wenn nötig)
        this.duplicate.push("\nEs haben sich folgende Duplikate eingeschlichen!:");

        this.course.push("\nUnvollständige/Fehlerhafte Eingabe bei den Kursangaben.");
        this.student.push("\nFolgende Schüler kommen doppelt vor!");

        this.calendar.push("\nEs wurden Fehler bei den Feier/Ferientagen gefunden!");

        this.fail = false;

    }



    /** Diese Funktion nimmt die Error Nachrichten auf.

     * @param message   Error String Nachricht, die weitergeleitet werden soll
     * @param index     Art der Errormeldung
     * @param index     0 → header,
     * @param index     1 → duplicate,
     * @param index     2 → course,
     * @param index     3 → student
     * @param index     4 → calendar
     */
    errorMessage(message, index) {

        switch(index){
            //header
            case 0:
                this.header.push(message);
                break;
            //duplicate
            case 1:
                this.duplicate.push(message);
                break;
            //course
            case 2:
                this.course.push(message);
                break;
            //calendar
            case 3:
                this.student.push(message);
                break;
            //calendar
            case 4:
                this.calendar.push(message);
                break;
            default:
                console.error("Bei der errorHeader Funktion wurde ein ungültiger index angebeben: " + index
                + "\nDer Gültigkeitsbereich liegt bei 0-4 (siehe @param)");
        }

    }

    /** Diese Funktion gibt alle bisher erstellte Fehlermeldungen, die im Laufe von dem Fetcher
     *  erstellt wurden (sofern welche auch vorhanden sind)
     *
     */
    displayMessage(){
        let collected = [];
        if(this.header.length > 0) {
            collected.push(this.header.join(" "));
            collected.push("\n");
            this.fail = true;
        }

        if(this.duplicate.length > 1) {
            collected.push(this.duplicate.join(" "));
            collected.push("\n");
            this.fail = true;
        }

        if(this.course.length > 1) {
            collected.push(this.course.join(" "));
            collected.push("\n");
            this.fail = true;
        }

        if(this.student.length > 1) {
            collected.push(this.student.join(" "));
            collected.push("\n");
            this.fail = true;
        }

        if(this.calendar.length > 1){
            collected.push(this.calendar.join(" "));
            collected.push("\n");
            this.fail = true;
        }
        if(this.fail === true)
            collected.join(" ");
            //alert(collected);
        return collected;
    }
}