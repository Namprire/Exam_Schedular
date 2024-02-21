import React, { useState } from 'react';
import Select from 'react-select';
import createIcon from '../icons/plus-circle.svg';

const AppointmentForm = ({ onSubmit, initialData, appointments }) => {
  const [courseID, setCourseID] = useState(initialData ? initialData.courseID : '');
  const [date, setDate] = useState(initialData ? initialData.date : '');
  const [availability, setAvailability] = useState(initialData ? initialData.availability : true);
  const [dateError, setDateError] = useState('');
  const [courseError, setCourseError] = useState('');
  const [selectedCourseArray, setSelectedCourseArray] = useState([]);

  //modify according to the current courses
  const courses1 = [
    '1w e', '1p_b', '1d1', 'Tel', '1kul', 'Seku2', 'leth1', '1g1', '1sk1', '1gen', '1m1', '161', '1ph2',
    '1sW H', '1p_e', '1d2', '1e2', '1its2', '1ku2', '1eth', '12', '1sk2', '1wr?', '1m2', '162', '15W FB',
    '1w geo', '1p_ph', '1d3', '1e3', '1mu1', 'lev1', '1g3', '1sk3', '1m3', '1b3', '1w m', '1d4', '104',
    'lits1', '1mu2', '1k1', '1g4', '1sk4', '1m4', '1ph1', 'Sinf', 'TSW V', '1w g', '1ku3', '1k2', '1wr1',
    '5voc', '1sps1', '1w mu', '1p_mu', '15-11', '1sW a', '1w b', '511', '1p m', '1c1', '1w d', '1F1',
    '5psy1', '1c2', '15W Gy', '5psy2', '1p_d', '1p_t', '1p 1', 'Sekol', '7eth2', '204', '2d2', '2d3',
    '2d4', '2e1', '2e3', '2geo1', '2geo2', '2g1', '2g2', '2g4', '2k1', '2k2', '2phA1', '2m1', '2m2', '2m3',
    '2m4','2p_d', '2p_e', '2p_sk', '2p k', '2p mu', '2p sBa', '2p sHu', '2ph2', '2r 2', '2s-t1', '2sWa',
    '2sW Ba', '2sW Gy', '2sW a', '2w b', '2w e'
  ];

  const courses2 = [
    '2w_d', '2p_sk', '2d3', '2e3', '2its2', '2mu2', '2k2', '2g3', '2sk3', '2geo2', '2m1', '2b3',
    '2sW_Ba', '2w_sBa', '2p_e', '2d1', '2e2', '2ku2', '2k1', '2g1', '2sk1', '2wr1', '2b2', '2sW_Gy',
    '2w_ph', '2e4', '2ku3', '5eko2', '2eth2', '2m3', '2phA1', '2w_b', '2eth1', '2d4', '2f1', '2g4',
    '2sk4', '2geo1', '2m4', '2b1', '5ineBB', '2c1', '2s-t1', '2sW_a_', '2p_d', '2e1', '2mu1', '2wr2',
    '2p_sBa', '2d2', '2its1', '2ku1', '2g2', '2sk2', '2m2', '5l1', '2p_sHu', '2ev1', '2w_eth', '2w_sMo',
    '2p_k', '5voc', '2w_c', '2w_e', '5psy1', '5eko1', '2p_mu', '5ineOr', '5psy2', '5inf'
  ];

  const prohibitedDates = ['2024-03-26','2024-04-01','2024-05-01','2024-03-25'];

  const handleCourseArrayChange = (selectedArray) => {
    setSelectedCourseArray(selectedArray);
  };

  const getSelectedCourses = () => {
    if (selectedCourseArray === 'courses1') {
      return courses1;
    } else if (selectedCourseArray === 'courses2') {
      return courses2;
    } else {
      return [];
    }
  };

  const isFavoritAppointmentExists = () => {
    const existingFavoritAppointment = appointments.find(
      (appointment) => appointment.courseID === courseID &&
      appointment.availability === 'favorit' &&
      appointment.date !== date
    );

    return !!existingFavoritAppointment;
  };

  const isValidDate = (selectedDate) => {
    const dayOfWeek = selectedDate.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedSelectedDate = date.split('T')[0];

    if (prohibitedDates.includes(formattedSelectedDate)) {
      alert('Termine können an Feiertagen und Ferientagen nicht erstellt werden.');
      return;
    }

    if (!isValidDate(new Date(date))) {
      alert('Termine können nicht an Wochenenden erstellt werden.');
      return;
    }

    if (availability === 'favorit' && isFavoritAppointmentExists()) {
      setDateError('Ein "favorit" Termin für diesen Kurs existiert bereits.');
      setCourseError('');
      return;
    }

    const currentDate = new Date();

    if (!date) {
      alert('Bitte wählen Sie ein Datum aus.');
      return;
    }

    if (!date || formattedSelectedDate < currentDate) {
      setDateError('Bitte wählen Sie ein zukünftiges Datum aus.');
      setCourseError('');
      return;
    } else {
      setDateError('');
    }

    if (!courseID) {
      setCourseError('Bitte wählen Sie einen Kurs aus.');
      setDateError('');
      return;
    } else {
      setCourseError('');
    }

    onSubmit({ courseID, date: formattedSelectedDate, availability });

    setCourseID('');
    setDate('');
    setAvailability(true);
  };

  return (
    <form onSubmit={handleSubmit} >
      <label style={{ marginBottom: '10px',  marginRight: '20px' }}>
        <Select
          options={[
            { value: 'courses1', label: 'Q11' },
            { value: 'courses2', label: 'Q12' }
          ]}
          onChange={(selectedOption) => handleCourseArrayChange(selectedOption.value)}
          isSearchable={false}
          placeholder="Bitte auswählen"
        />
      </label>

      <label style={{ marginBottom: '10px',  marginRight: '20px' }}>
        <Select
          value={{ value: courseID, label: courseID === '' ? 'Wählen Sie ein Kurs' : courseID }}
          options={getSelectedCourses().map((course) => ({ value: course, label: course }))}
          onChange={(selectedOption) => setCourseID(selectedOption.value)}
          isSearchable 
          placeholder="Wählen Sie ein Kurs"
        />
      </label>

      <label style={{ marginBottom: '10px', marginRight: '20px' }}>
        Datum:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ display: 'inline-block', marginLeft: '5px' }}
        />
      </label>

      <label style={{ marginBottom: '10px', marginRight: '20px' }}>
        Verfügbarkeit:
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            value="favorit"
            checked={availability}
            onChange={() => setAvailability(true)}
          />
          Favorit
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            value="geblockt"
            checked={!availability}
            onChange={() => setAvailability(false)}
          />
          Geblockt
        </label>
      </label>

      <button
        type="submit"
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          marginLeft: '10px',
        }}
      >
        <img
          src={createIcon}
          alt="Create Icon"
          style={{ width: '30px', height: '30px' }}
        />
        Termin erstellen
      </button>

      {dateError && <p style={{ color: 'red', marginTop: '10px' }}>{dateError}</p>}
      {courseError && <p style={{ color: 'red', marginTop: '10px' }}>{courseError}</p>}
    </form>
  );
};

export default AppointmentForm;





