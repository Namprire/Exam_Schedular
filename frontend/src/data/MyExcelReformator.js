import React, { useState } from "react";
import * as XLSX from "xlsx";

/** Dieser Code kann (und muss) von dem gesammten Projekt exkludiert werden.
 *  Der dient nur dafür, um die Kursbelegung und Christian's Format zu umformieren :)
 */
class Course {
    constructor(course) {
        this.courseName = course;
        this.students = [];
    }
    addStudent(student) {
        this.students.push(student);
    }
}

class Courses {
    constructor() {
        this.courses = [];
    }
    addCourse(course, student) {
        const thisCourse = this.findCourse(course);
        //Fall.1: dieser Kurs existiert nicht,
        if(thisCourse === undefined || thisCourse === null){
            course.addStudent(student)
            this.courses.push(course);
        //Fall.2: dieser Kurs existiert
        } else {
            thisCourse.addStudent(student);
        }
    }
    findCourse(course){
        return this.courses.find((c) => c.courseName === course.courseName);
    }
}
let excelArray;
const XLSReformator = () => {

    const handleFormat = (e) => {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);

                const workbook = XLSX.read(data, { type: "array"});
                const sheetName = workbook.SheetNames[0];

                const sheet = workbook.Sheets[sheetName];
                const range = XLSX.utils.decode_range(sheet["!ref"]);

                const courseList = new Courses();

                //Part.1: Read the excel file with the needed course and students information
                for (let rowIndex = range.s.r + 4; rowIndex <= range.e.r; rowIndex++) {
                    let rowArray = [];
                    let colIndex;
                    for (colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
                        const cellAddress = XLSX.utils.encode_cell({
                            r: rowIndex,
                            c: colIndex,
                        });
                        const cellValue = sheet[cellAddress] ? sheet[cellAddress].v : null;
                        rowArray.push(cellValue);
                    }

                    /* rowArray[0] = student
                     * rowArray[1..] = courseName
                     */
                    const student = rowArray[0];
                    for (let i = 1; i < rowArray.length ; i++) {
                        const curCourse = rowArray[i];
                        if(curCourse === "" || curCourse === null) {
                            continue;
                        }
                        const course = new Course(curCourse);
                        courseList.addCourse(course, student);
                    }
                }
                console.log(courseList);

                //Part.2: reform the array to my format
                excelArray = [];
                //extract the course array from the class to make the following procedure less complicated :)
                const courseArray = courseList.courses;
                for (let i = 0; i < courseList.courses.length ; i++) {
                    const curCourse = courseArray[i];
                    let excelRow = [];
                    excelRow.push(curCourse.courseName);
                    for (let j = 0; j < curCourse.students.length; j++) {
                        excelRow.push(curCourse.students[j]);
                    }
                    console.log(excelRow);
                    excelArray.push(excelRow);
                }
                console.log(excelArray);

                //Part.3: create the Excel-File

                // Create a new workbook
                // Create a worksheet
                const ws = XLSX.utils.aoa_to_sheet(excelArray);

                // Create a workbook
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

                // Save the workbook to a file
                XLSX.writeFile(wb, 'Kursliste(reformat).xlsx');
            }
            reader.readAsArrayBuffer(file);
        }
    }

    return (
        <div className="flex items-center justify-center bg-grey-lighter">
            <label className="w-48 flex flex-col items-center px-2 py-3 bg-[#0000FF] hover:bg-blue-900 text-white rounded-lg shadow-lg tracking-wide uppercase border border-blue-900 cursor-pointer">
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M9 13l-3-3h2V8h2v2h2l-3 3zm-3.17 1h6.34c1.1 0 1.26-1.16 1.26-1.75V5H4.75v6.42c0 .92.08 1.58 1.08 1.58z" />
                </svg>
                <span className="mt-1 text-sm leading-normal">Zu formatierende Datei hochladen</span>
                <input type="file" className="hidden" onChange={handleFormat} />
            </label>
        </div>
    );
}

export default XLSReformator;