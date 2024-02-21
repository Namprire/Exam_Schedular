import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import deLocale from "@fullcalendar/core/locales/de"
import React, {useContext} from "react"
import "./globals.css"
import { calculatePossibleDates } from './PossibleDates'




//context api
import AppContext from "../AppContext";


/**
 * Represents the Calendar component.
 *
 * @component
 * @returns {JSX.Element} The Calendar component.
 */
export default function Calendar() {

    //start and end range of the calendar
    const [validRange, setValidRange] = useState({ start: '', end: '' });

    //context api
    const { eventsApp, setEventsApp, coursesApp, studentsApp, setPossibleDatesApp, isCalendarEnabled,
        setCalendarEnabled, constraints,
        setConstraints, examsApp, setExamsApp } = useContext(AppContext);

    const [allEvents, setAllEvents] = useState([
        {},
        // Add other pre-saved events here
        ...eventsApp
    ])
    //modals for adding and deleting events
    const [showModal, setShowModal] = useState(false)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idToDelete, setIdToDelete] = useState(null)
    const [newEvent, setNewEvent] = useState({
        title: "",
        start: "",
        allDay: false,
        editable: true,
        id: 0
    })

//useEffect hook to update the eventsApp state variable whenever allEvents changes
useEffect(() => {
    console.log(eventsApp);
    console.log(examsApp);

    // Modify the eventsApp array
    const modifiedEvents = eventsApp.map(event => {
        // Check if the id of the event is a string
        if (typeof event.id === 'string') {
            return {
                ...event,
                color: 'blue', // Change this to any color you want
            };
        } else {
            // Find the corresponding exam for the event
            const correspondingExam = examsApp.find(exam => exam.course.name === event.title);

            // If a corresponding exam is found
            if (correspondingExam) {
                let color;
                if (correspondingExam.rating > 160) {
                    color = 'darkred';
                } else if (correspondingExam.rating >= 80 && correspondingExam.rating <= 160) {
                    color = 'orange';
                } else if (correspondingExam.rating >= 0 && correspondingExam.rating < 80) {
                    color = 'green';
                }

                return {
                    ...event,
                    color: color,
                };
            }
        }

        return event;
    });


    setAllEvents([
        // holdiay with a different color
        ...modifiedEvents
    ]);
    //check if eventsApp is not empty and if the first element is an array with two elements
    //for the start and end date
    if (eventsApp.length > 0) {
        let timezone = eventsApp[0];
        if (Array.isArray(timezone) && timezone.length === 2) {
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            if (datePattern.test(timezone[0]) && datePattern.test(timezone[1])) {
                setValidRange({ start: timezone[0], end: timezone[1] });
                eventsApp.shift(); // Remove the timezone from eventsApp
                const possibleDates = calculatePossibleDates(timezone, eventsApp);
                setPossibleDatesApp(possibleDates);
            } 
          } 
        //enable the calendar
        if (isCalendarEnabled === false) {
            setCalendarEnabled(true);
        }
        
    }

}, [eventsApp]); // Dependency array

useEffect(() => {
    // This useEffect hook will run whenever validRange changes
    // You can put code here to force a re-render of the FullCalendar component
    console.log('validRange changed');
    console.log(validRange);
  }, [validRange]);



    useEffect(() => {
        let draggableEl = document.getElementById("draggable-el")
        if (draggableEl) {
            new Draggable(draggableEl, {
                //classname of the item that we want to drag
                itemSelector: ".fc-event",
                eventData: function(eventEl) {
                    let title = eventEl.getAttribute("title")
                    let id = eventEl.getAttribute("data")
                    let start = eventEl.getAttribute("start")
                    return { title, id, start }
                }
            })
        }
    }, []) //empty array means that this will only run once

    /**
     * Handles the click event on a date in the calendar.
     *
     * @param arg - The date and allDay flag of the clicked date.
     */
    function handleDateClick(arg) {
        setNewEvent({
            ...newEvent,
            start: arg.date,
            allDay: arg.allDay,
            id: new Date().getTime()
        })
        //testen ob eventsApp alle events vom algo enthaelt
        console.log(eventsApp);
        //teste ob alle courses und students gesetzt wurden
        console.log(coursesApp);
        console.log(studentsApp);
        setShowModal(true)
        
    }

    /**
     * Handles the deletion of an event and opens the delete modal.
     * @param data - The data object containing the event ID.
     */
    function handleDeleteModal(data) {
        const event = allEvents.find(e => e.id === Number(data.event.id))
        if (event && event.editable !== false) {
            setIdToDelete(Number(data.event.id))
            setShowDeleteModal(true)
            //dont let the modal show up when clicking on a public holiday
        }
    }

    /**
     * Adds an event to the calendar.
     *
     * @param data - The data of the event to be added.
     */
    function addEvent(data) {
        const event = {
            ...newEvent,
            title: data.draggedEl.innerText,
            start: data.date.toISOString(),
            allDay: data.allDay,
            editable: true,
            id: new Date().getTime()
        }
        console.log('Addevent was called');
        const updatedEvents = [...allEvents, event];
        setAllEvents(updatedEvents);
        setEventsApp(updatedEvents); // Update eventsApp
   
    }

    /**
     * Handles the deletion of an event.
     */
    function handleDelete() {
        console.log('Deleting event with id:', idToDelete);
        const updatedEvents = allEvents.filter(event => {
            const keep = Number(event.id) !== Number(idToDelete);
            if (!keep) {
                console.log('Deleting:', event);
            }
            return keep;
        });
        console.log('Updated events:', updatedEvents);
        setAllEvents(updatedEvents);
        setEventsApp(updatedEvents); // Update eventsApp
        setShowDeleteModal(false); //modal is hidden
        setIdToDelete(null);
    }

    /**
     * Closes the modal and resets the newEvent state.
     */
    function handleCloseModal() {
        setShowModal(false)
        //reset newEvent
        setNewEvent({
            title: "",
            start: "",
            allDay: false,
            editable: true,
            id: 0
        })
        //modal is hidden
        setShowDeleteModal(false)
        //reset idToDelete
        setIdToDelete(null)
    }

    function handleCloseAlertModal() {
        setShowModal(false)
        setShowAlertModal(false)
    }

    /**
     * Handles the change event of the input element.
     * Updates the title of the new event in the state.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object.
     * @returns {void}
     */
    const handleChange = e => {
        setNewEvent({
            ...newEvent,
            title: e.target.value
        })
    }

    /**
     * Handles the form submission event.
     *
     * @param e - The form event.
     */
    function handleSubmit(e) {
        //allow to not refresh the page when submitting the form
        e.preventDefault()
        //add new event to the array of all events
        setAllEvents([...allEvents, newEvent])
        //console.log(newEvent)
        //modal is hidden
        setShowModal(false)
        //reset newEvent
        setNewEvent({
            title: "",
            start: "",
            allDay: false,
            editable: true,
            id: 0
        })
    }

    // This function is called when an event is dropped (moved) in the calendar
    /**
     * Handles the event drop in the calendar.
     * @param {object} info - The information about the dropped event.
     */
    const handleEventDrop = (info) => {
            // Log that the function was called
            console.log('handleEventDrop was called');
            // Get the new start date
            let newStartDate = new Date(info.event.start.getFullYear(), info.event.start.getMonth(), info.event.start.getDate());

            // Check if the new start date is blocked in the constraints array
            let isBlocked = constraints.some(constraint => {
                // Parse the constraint date
                let constraintDate = new Date(constraint.date);

                // Check if the name matches and the date is blocked
                return constraint.course.name === info.event.title && 
                    constraintDate.getFullYear() === newStartDate.getFullYear() &&
                    constraintDate.getMonth() === newStartDate.getMonth() &&
                    constraintDate.getDate() === newStartDate.getDate() &&
                    constraint.isFavorite === false;
            });

            // If the new start date is blocked
            if (isBlocked) {
                // Prevent the drop
                info.revert();

                // Log "not working" to the console
                console.log('not working');
                setShowAlertModal(true);

                // Return early to prevent the rest of the function from running
                return;
            }

        console.log(constraints);


        // Map over the events in the state
        let updatedEvents = eventsApp.map((event) => {
            // If the id of the current event matches the id of the dropped event
            if (Number(event.id) === Number(info.event.id)) {
                // Create a new Date object with the year, month, and date of the dropped event
                let newStartDate = new Date(info.event.start.getFullYear(), info.event.start.getMonth(), info.event.start.getDate());

                // Adjust the date for the timezone offset
                newStartDate.setMinutes(newStartDate.getMinutes() - newStartDate.getTimezoneOffset());

                // Return a new object that contains all properties of the current event
                // but with the start date updated to the new start date
                return {
                    ...event,
                    start: newStartDate.toISOString().split('T')[0], // format date as "yyyy-mm-dd"
                };
            } else {
                // If the ids don't match, return the current event as is
                return event;
            }
        });

        // Update the state with the new array of events
        setEventsApp(updatedEvents);

        // Iterate over examsApp and update the date of the matching exam
        let updatedExams = examsApp.map((exam) => {
        // If the name of the course of the current exam matches the title of the dropped event
        if (exam.course.name === info.event.title) {
        // Return a new object that contains all properties of the current exam
        // but with the date updated to the start date of the dropped event
            return {
                ...exam,
                date: new Date(info.event.start), // assign a Date object
            };
        } else {
            // If the names don't match, return the current exam as is
            return exam;
        }
        
});

// Update the state with the new array of exams
setExamsApp(updatedExams);
    };

    return (
        <>
            <nav className="flex mb-1 border-b border-black-25 p-4"></nav>
            <main className="eight-step items-center p-10">
            <div className="flex items-center justify-center h-full w-full relative">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: ""
                    }}
                    locale={deLocale}
                    events={allEvents}
                    nowIndicator={true}
                    editable={isCalendarEnabled}
                    droppable={isCalendarEnabled}
                    selectable={isCalendarEnabled}
                    selectMirror={true}
                    dateClick={handleDateClick}
                    drop={data => addEvent(data)}
                    eventClick={data => handleDeleteModal(data)}
                    eventDrop={handleEventDrop} 
                    height="auto"
                    width="auto"
                    validRange={validRange}
                />
            {!isCalendarEnabled && (
            <div className="absolute inset-0 bg-black opacity-10 cursor-not-allowed z-10" />
            )}
        </div>

{/*
<button onClick={() => setCalendarEnabled(!isCalendarEnabled)}>
    {isCalendarEnabled ? "Disable Calendar" : "Enable Calendar"}
</button>
*/}


                <Transition.Root show={showDeleteModal} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-10"
                        onClose={setShowDeleteModal}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel
                                        className="relative transform overflow-hidden rounded-lg
                                     bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                                    >
                                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div
                                                    className="mx-auto flex h-12 w-12 flex-shrink-0 items-center
                                             justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                                                >
                                                    <ExclamationTriangleIcon
                                                        className="h-6 w-6 text-red-600"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <Dialog.Title
                                                        as="h3"
                                                        className="text-base font-semibold leading-6 text-gray-900"
                                                    >
                                                        Ereignis löschen
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            Sind Sie sicher, dass Sie dieses Ereignis löschen
                                                            möchten?
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm
                                         font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={handleDelete}
                                            >
                                                Löschen
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900
                                         shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={handleCloseModal}
                                            >
                                                Abbrechen
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>

                <Transition.Root show={showAlertModal} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setShowAlertModal}>
                        {/* Transition component for background overlay */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* Centered content for the alert modal */}
                        <div className="flex items-center justify-center min-h-screen">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                {/* Alert modal content with Tailwind CSS classes */}
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <div>
                                    <div className="mt-3 text-center sm:mt-5">
    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
        🚫 Constraint-Verletzung
    </Dialog.Title>
    <div className="mt-2">
        <p className="text-sm text-gray-500">
            Sie können das Ereignis nicht auf dieses Datum verschieben, da es gegen die festgelegten Einschränkungen verstößt.
        </p>
    </div>
                                            <div className="mt-5 sm:mt-6">
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                                                    onClick={handleCloseAlertModal}
                                                >
                                                    Schließen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>                              

                {/* the user does not need to add events manually anymore however the code is still there
                <Transition.Root show={showModal} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={setShowModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div>
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                <CheckIcon
                                                    className="h-6 w-6 text-green-600"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-5">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-base font-semibold leading-6 text-gray-900"
                                                >
                                                    Ereignis hinzufügen
                                                </Dialog.Title>
                                                <form action="submit" onSubmit={handleSubmit}>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900
                                                                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                                                                focus:ring-2
                                                                focus:ring-inset focus:ring-blue-600
                                                                sm:text-sm sm:leading-6"
                                                            value={newEvent.title}
                                                            onChange={e => handleChange(e)}
                                                            placeholder="Title"
                                                        />
                                                    </div>
                                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                        <button
                                                            type="submit"
                                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-25"
                                                            disabled={newEvent.title === ""}
                                                        >
                                                            Erstellen
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                            onClick={handleCloseModal}
                                                        >
                                                            Abbrechen
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                */}
            </main>
        </>
    )
}
