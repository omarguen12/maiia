import TimeSlotList from 'components/TimeSlotList';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { timeslotsActions } from 'store/actions';

const TimeSlotPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(timeslotsActions.getList());
  }, []);

  return (
    <div>
      <section>
        <header>
          <h1>Welcome to the time slot page</h1>
          <h2>An example to explain how time slots works.</h2>
        </header>
        <article>
          <section>
            <p>
              Every practitioner has many time slots which represent his
              interval of work time. The duration of an availability for an
              appointment is 15 minutes, so for example if the practitioner has
              a one hour time slot, this will generate 4 availabilities of 15
              minutes. If the practitioner add an appointment to his agenda that
              will reduce his availabilities.
            </p>
            <p>
              While selecting a practitioner in the dropdown list, the
              availabilities must be generated and displayed in the front (as in
              the screenshots). To create an appointment, you must select an
              availability and click on the button “create appointment”. An
              endpoint must be created in the back to create the appointment
            </p>
          </section>
        </article>
      </section>
      <section>
        <TimeSlotList />
      </section>
    </div>
  );
};

TimeSlotPage.pageTitle = 'Time slots';
TimeSlotPage.pageSubtitle = 'A simple example';

export default TimeSlotPage;
