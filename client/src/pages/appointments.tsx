import AppointmentForm from 'components/AppointmentForm';
import AppointmentList from 'components/AppointmentList';
import Section from 'components/Section';
import AllTasks from 'components/AllTasks';


const AppointmentsPage = () => {
  return (
    <div className='appointment page'>
      <h1>Appointments</h1>
      <Section
        name="instructions"
        title="Instructions"
        className='instructions'
      >
        <p>
          To book an appointment, we have to set the following required
          informations: the practitioner, the patient and date.
        </p>
        <p>The front-end implementation is already done.</p>
        <p>In first you have to genrate all availabilities.</p>
        <p>
          In the second time, you will create an end-point top create an
          appointment.
        </p>
        <span>
          <img src="/static/withoutAppointment.png" alt="" width="25%" height="25%"/>
          <img src="/static/withAppointment.png" alt="" width="50%" height="50%"/>
        </span>
        <p>
          We expect you to implement bonus features: add DTO pattern and add
          unit tests if needed
        </p>
      </Section>
      <AllTasks className='goals' />
      <div className='structurePage'>
        <Section name="appointment-form" title="Appointment Form"  className='appointment__form' >
          <AppointmentForm />
        </Section>
        <Section name="appointment-list" title="Appointment List" className='appointment__list'>
          <AppointmentList />
        </Section>
      </div>
    </div>
  );
};

AppointmentsPage.pageTitle = 'Appointments';
AppointmentsPage.pageSubtitle = "Let's get to work 👩‍💻";

export default AppointmentsPage;
