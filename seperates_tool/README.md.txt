# Schulaufgabeplaner

## Voraussetzungen

Stelle sicher, dass die folgenden Voraussetzungen auf deinem System installiert sind:

- [Java JDK](https://www.oracle.com/java/technologies/javase-downloads.html)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads)
- Ein Code-Editor deiner Wahl (z.B., [Visual Studio Code](https://code.visualstudio.com/))

## Backend Setup

1. **IDE verwenden (z.B., IntelliJ IDEA):**

    - Öffne das Ordner "appointmentTool" in deiner bevorzugten IDE.
    - Starte die Spring-Anwendung mit dem "Run" Button.

2. **Ohne IDE (Terminal):**

    - Navigiere zum Ordner "appointmentTool".
    - Führe den Befehl aus:

        ```bash
        ./mvnw spring-boot:run
        ```

## Frontend Setup

1. **IDE verwenden (z.B., Visual Studio Code):**

    - Öffne das Ordner "tool-gui" in Visual Studio Code.
    - Öffne ein Terminal und führe folgende Befehle aus:

        ```
        npm install
        ```

    - Starte die React-Anwendung:

        ```
        npm start
        ```

2. **Ohne IDE (Terminal):**

    - Navigiere zum Ordner "tool-gui".
    - Führe die folgenden Befehle aus:

        ```bash
        npm install
        ```
    - Starte die React-Anwendung:

        ```bash
        npm start
        ```

## Anwendung verwenden

- Die Backend-Anwendung ist nun unter `http://localhost:8080` verfügbar.

Öffne deinen Webbrowser und besuche die oben genannten URLs, um auf die Anwendungen zuzugreifen.
