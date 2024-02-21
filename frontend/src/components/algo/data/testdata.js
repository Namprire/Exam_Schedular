import {Student} from "./students";
import {Course} from "./course";
import {Constraint} from "./constraint";

const s1 = new Student("s1")
const s2 = new Student("s2")
const s3 = new Student("s3")
const s4 = new Student("s4")
const s5 = new Student("s5")
const s6 = new Student("s6")
const s7 = new Student("s7")
const s8 = new Student("s8")
const s9 = new Student("s9")
const s10 = new Student("s10")

export const testStudents = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10]

const d1 = new Course("d11_1", "Sc1", "deutsch", [s1, s2, s3], "t1")
const d2 = new Course("d11_2", "Sc1", "deutsch", [s4, s5, s6], "t2")
const d3 = new Course("d11_3", "Sc1", "deutsch", [s7, s8, s9, s10], "t3")

const e1 = new Course("e11_1", "Sc2", "fremdsprache", [s1, s2, s3, s4, s5], "t2")
const f1 = new Course("f11_1", "Sc2", "fremdsprache", [s6, s7, s8, s9, s10], "t4")

const b1 = new Course("b11_1", "Sc3", "bio", [s1, s2, s3], "t1")
const p1 = new Course("p11_1", "Sc3", "physik", [s1, s4, s5], "t5")
const ch1 = new Course("ch11_1", "Sc1", "chemie", [s5, s6, s7, s8], "t5")

export const testCourses = [d1, d2, d3, e1, f1, b1, p1, ch1]

for (let course of testCourses) {
    for (let student of course.students) {
        student.addCourse(course)
    }
}

const c1 = new Constraint(d1, new Date("2023-12-11"), true)
const c2 = new Constraint(e1, new Date("2023-12-18"), false)
const c3 = new Constraint(d2, new Date("2023-12-11"), true)
const c4 = new Constraint(ch1, new Date("2023-12-20"), false)
const c5 = new Constraint(f1, new Date("2023-12-13"), false)
const c6 = new Constraint(d1, new Date("2023-12-15"), false)

export const testConstraints = [c1, c2, c3, c4, c5, c6]

function getTestdays() {
    let days = []

    days.push(new Date(2023, 11, 1))
    days.push(new Date(2023, 11, 2))
    days.push(new Date(2023, 11, 3))
    days.push(new Date(2023, 11, 4))
    days.push(new Date(2023, 11, 5))
    days.push(new Date(2023, 11, 6))
    days.push(new Date(2023, 11, 7))
    days.push(new Date(2023, 11, 8))
    days.push(new Date(2023, 11, 9))
    days.push(new Date(2023, 11, 10))
    days.push(new Date(2023, 11, 11))
    days.push(new Date(2023, 11, 12))
    days.push(new Date(2023, 11, 13))
    days.push(new Date(2023, 11, 14))
    days.push(new Date(2023, 11, 15))
    days.push(new Date(2023, 11, 16))
    days.push(new Date(2023, 11, 17))
    days.push(new Date(2023, 11, 18))
    days.push(new Date(2023, 11, 19))
    days.push(new Date(2023, 11, 20))
    days.push(new Date(2023, 11, 21))
    days.push(new Date(2023, 11, 22))
    days.push(new Date(2023, 11, 23))

    return days
}

export const testDays = getTestdays()
