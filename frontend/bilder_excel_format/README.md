# Benutzerhandbuch - Schulaufgabenplabner

## Inhaltsverzeichnis

#### 1.0 Kleine Einführung
Hier wird kurz erklärt, was es mit diesem Verzeichnis auf sich hat.\
Warum habe ich es erstellt und welchen Zweck verfolgt es?

#### 1.1 Erläuterung der Verzeichnissex
Wofür ist die README.md file zu gebrauchen?\
Was hat es mit dem 'templates' Ordner auf sich?
#### 2.0 Die Abschnitte des Benutzerhandbuches
An der Stelle fängt das 'Benutzerhandbuch' an, welches wir dann so auch hoffentlich mit in die PDF übernehmen können.\
(nur als Text. Ich weiß nicht, ob man hier Bilder visualisieren kann, lol)

## 1.0 Kleine Einführung
Hier möchte ich schon mal anfangen zu arbeiten, da ich mich mit LaTeX nicht auskenne, um die
nötige PDF für das Benutzerhandbuch zu erstellen. Dabei will ich schon mal PNG templates
für das Benutzerhandbuch erstellen, die nicht nur ich, sondern auch alle andere verwenden könen.
Was natürlich auch dazu gehört sind die Texte dazu

## 1.1 Erläuterung der Verzeichnisse
Im Ordner 'benutzerhandbuch',wo sich diese README.md Datei befindet, ist auch ein templates(original) Ornder. Darin
werden sich die Ursprung Templates befinden. Wenn ihr damit arbeiten wollt, dann erstellt bitte vorab eine Kopie des Originalen.\
Bitte arbeitet nicht direkt mit den PNG aus dem Ordner 'template(original)', sondern nur mit einer Kopie aus ihrem Inhalt!



## 2.0 Die Abschnitte des Benutzerhandbuches
Da brauch ich nicht allzu viel zu schreiben, hier bin ich straight forward :)



# Das Benutzerhandbuch
In diesem Handbuch wird Ihnen in chronologischer Reihnfolge erklärt, wie das Programm zu nutzen ist.
Hier erfahren Sie die Funktionalitäten und die Nutzung des Schulaufgabenplaners:
- **Struktur der Excel-Listen**: Wie ist die Kalender- und Kursliste aufgebaut?
- **Hochladen einer Excel-Datei**: Wie lädt man eine Excel-Liste Datei hoch?
- **Syntaxüberprüfer**: Was macht der Syntaxüberprüfer und wie meide ich Fehler beim Hochladen der Datei?
- **Herunterladen der fertigen Termine**: Wie und wann lade ich das Ergebnis des Programmes runter?



## Struktur der Excel-Listen
Für das erstellen der Excel-Listen gibt es zwei verschiedene Strukturen. Eine Struktur für
die **Kursliste** und eine weitere für die **Kalenderliste**.\
Diese sehen wie folgt aus:

**Die Kurliste**: (Siehe Bild x)
Eine Zeile in der Kursliste soll einen Kurs darstellen, wobei dieser **einen Namen** hat,
**einen Lehrer**, der den Kurs unterrichtet, **ein Fach** und anschließend **eine Schiene** dem dieser
Kurs zugewiesen. Daraufhin folgt **die Schülerliste** welche alle Schüler enthält, die an diesem Kurs teilnehmen.

- **Der Kurs** wird in Spalte A angebenen, wobei die Kopzeile in der ersten Zeile ist.
  Bei dem Kurs ist wichtig zu beachten, dass jeder Kurs in der Spalte nur **einmal** vorkommen darf.
- **Der Lehrer, das Fach und die Schiene** werden jeweils in Spalte B, C und D angeben. Auch
  hier beginnt die Kopfzeile in der ersten Zeile.\
  Hier kann es durch aus vorkommen, dass einer dieser
  Punkte mehrmals vorkommen. Zum Beispiel kann ein Lehrer mehrere Kurse unterrichten, mehrere Kurse
  können einer Schiene zugewiesen werden und es können auch mehrere Kurse ein Fach teilen.
- **Die Schülerliste** beginnt ab der Spalte E. Im Vergleich zu den ersten vier Spalten, kann die Schülerliste mehr als
  nur ein Objekt beinhalten. Die Schüler des Kurses werden ab der Spalte E, in der zugehörigen Zeile der Kurses,
  Reihe nach aufgezählt, wobei jede Zelle nur einen Schüler beinhalten darf.

**Die Kalenderliste**: (Siehe Bild x)
Im Vergleich zur Kursliste, hat die Kalenderliste zwei Kopfzeilen. Eine Kopfzeile für das
Einlesen der Zeitspanne des Schulhalbjahres und eine weitere für das Einlesen der Veranstaltungen,
also die Ferien und Feiertage.

**Kopfzeile 1** (Zeile 1):

Spalte A → **Schulhalbjahr (Zeitspanne)**\
Spalte B → **Halbjahr - Beginn**\
Spalte C → **Halbjahr - Ende**

Unter der Spalte **'Schulhalbjahr (Zeitspanne)'** wird nichts angegeben. Die Zeile
bleibt leer. Diese soll nur veranschaulichen, dass daraufhin das kommende Schulhalbjahr
angeben werden soll.\
Genau das geschieht unter der Spalte **'Halbjahr - Beginn'** und **'Halbjahr - Ende'**. Die gegebene
Zeitspanne wird dann beim Schulaufgabenplaner berücksichtigt. Prüfungen und sonstige Veranstaltungen
werden nur innerhalb dieser Zeitspanne geplant.

**Kopfzeile 2** (Zeile 4):

Spalte A → **Name der Veranstaltung**\
Spalte B → **Beginn**\
Spalte C → **Ende**

In diesen Spalten befinden sich zeilenweise die Veranstaltungen. Beginnend mit der Spalte
**'Name der Veranstaltung'** welches begleitet wird mit dem **'Beginn'**-Tag und dem **'Ende'**-Tag
der Veranstaltung. Hat die Veranstaltung nur einen Beginn-Tag ohne Ende-Tag (also keine Angabe in dieser Zelle),
so wird dieser Veranstaltung als ein **'Feiertag'** handgehabt. Wird ein Beginn-Tag und ein Ende-Tag
mit angegeben, so handelt es sich um **'Ferien'**.
Alles andere ist eine ungültige Eingabe.



## Hochladen einer Excel-Datei
1. Der erste Schritt für den Schulaufgabenplaner wird es sein, die Kursliste, als auch die Kalenderliste hochzuladen.
   Dafür haben Sie jeweils zwei Buttons zur Verfügung.\
   Diese haben folgende Bezeichnungen:

- **KURSE HOCHLADEN** und **KALENDER HOCHLADEN**

2. Beim Hochladen können zwei Ereignisse eintretten.

**→ Fall.1**: Die Datei wurde erfolgreich hochgeladen.\
Die Upload-Buttons leuchten grün auf und Ihnen werden zusätzlich Information bezüglich der
jeweiligen Liste angegeben: (Siehe Bild x)

- **Kursliste**: Hier werden die Anzahl der Schüler und Kurse angegeben,
  die erfolgreich hochgeladen wurden.
- **Kalenderliste**: Hier werden die Anzahl der Events angegeben,
  die erfolgreich hochgeladen wurden, als auch die Zeitspanne des Schulhalbjahres.

Ist dies geschen, dann können Sie mit der Prozedur weitermachen. Sollte die Datei
nicht erfolgreich hochgeladen sein, dann tritt Fall.2 auf

→ **Fall.2**: Die Datei enthält einen Fehler und das Hochladen der Liste wird abgebrochen.
Die Gründe dafür können divers sein. Gefunden wird der Fehler beim Einlesen der
gewählten Excel-Datei vom Syntaxüberprüfer.
Wird das Hochladen abgebrochen, so wird Ihnen eine Meldung angezeigt.\
Diese kann folgende Arten von Wanrmeldungen sein: (Siehe Bild x):

- **Warnmeldung**: Der Syntaxüberprüfer hat was verdächtiges wahrgenommen, was jedoch nicht
  zwingend zu einem Problem führt:
  Das Programm wird weiterhin ausgeführt. Eine Beschreibung für den Grund der Warnung wird mitgegeben,
  als auch eine Zeilenangabe (sofern diese auch nötig ist). Gleichen Sie es mit der Excel-Datei der Liste ab.
- **Fehlermeldung**: In Ihrer Excel-Datei der Liste wurde ein Fehler entdeckt, den das Programm nicht
  handhaben kann. Eine Beschreibung des Fehlers wird mit angegeben mit einer Zeilenangaben. Das Hochladen der Liste wird
  abgebrochen und Sie werden darum gebeten diesen Fehler zu beheben.

Sobald Sie den Fehler in der Liste behoben haben, können Sie einen weiteren Uploadversuch in
die Gänge setzen, mit der selben vorangehensweise, wie auch zuvor.



## Syntaxüberprüfer
Bei dem Erstellen einer Excel-Liste, sei es für den Kurs oder für den Kalender, muss die Struktur dringend
eingehalten werden. Um sicher zu gehen, dass diese auch eingehalten wird, aber vor allem auch,
um einen kritischen Fehler bei dem Ausführen des Programms zu vermeiden, unterstützt Sie der Syntaxüberprüfer
beim Entdecken von Fehler in ihrer Excel-Liste, ehe diese vollständig hochgeladen werden und zu einem
kristischen Fehler in der Webapplikation führt.

Folgende Fehler werden bei den jeweiligien Listen entdeckt:

#### **Kursliste**:

- doppelt vorkommende Kurse in einer Spalte und doppelt vorkommende Schüler in einer Zeile
- unvollständige Angaben in den ersten vier Spalten Kurs/Lehrer/Fach/Schiene (leere Zellen)
- leere Zellen zwischen zwei Schülern in einer Zeile

#### **Kalenderliste**

- wenn ein Feiertag sich mit einem anderen Feiertag überschneidet (gleiches auch bei Ferien)
- wenn eine Veranstaltung keinen 'Beginn'-Tag besitzt
- wenn eine Veranstaltung ein ungültiges Datum enthält (z.B. 32.02.2024)
- wenn der 'Beginn'-Tag nach dem 'Ende'-Tag beginnt (also eine Reise in die Vergangenheit)

#### **Einen Fehler, der in beiden Listen entdeckt wird**

- wenn die Kopfzeile unvollständig/falsch ist
- wenn man eine falsche Liste hochlädt

Bei der Kursliste müssen Sie beachten, dass die Spalten der Kopfzeile wie gefolgt angegeben werden:

Spalte A → _**Kurs**_\
Spalte B → _**Lehrer**_\
Spalte C → _**Fach**_\
Spalte D → _**Schiene**_\
Spalte E → _**Schülerliste**_

Bei der Kalenederliste müssen Sie beachten, dass diese zwei Kopfzeile besitzt. Eine
in Zeile 1 und die andere in Zeile 4. Hier sollten die Spalten jeweils so aussehen:

Spalte A, Zeile 1 → _**Schulhalbjahr (Zeitspanne)**_\
Spalte A, Zeile 4 → _**Name der Veranstaltung**_\
Spalte B, Zeile 1 → _**Halbjahr - Beginn**_\
Spalte B, Zeile 4 → _**Beginn**_\
Spalte C, Zeile 1 → _**Halbjahr - Ende**_\
Spalte C, Zeile 4 → _**Ende**_

Was Sie auch beachten müssen ist, dass Sie die richtige Excel-Datei hochladen. Um diesen Fehler zu vermeiden,
soll der Name der Excel-Kursliste in irgendeiner Form das Wort 'kurs' enthalten, wobei die Groß- und Kleinschreibung
nicht berücksichtigt wird. So könnte die Liste z.B. '**Kurs**liste_Q12' heißen, aber nicht 'K-Liste'., das Wort 'kurs'
fehlt. Genau das Gleiche gilt auch analog für die Kalenderliste mit dem Wort 'kalender'.



_**(in progress :)**_