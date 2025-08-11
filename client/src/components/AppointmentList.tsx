import {
  Card,
  CardContent,
  CardHeader,
  List,
  Typography,
} from '@material-ui/core';
import { CalendarToday } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import {
  appointmentsSelectors,
  patientsSelectors,
  practitionersSelectors,
} from 'store/selectors';
import { formatDateRange, formatName } from 'utils/format';

const getAppointmentDatacy = (id: number) => `appointment-${id}`;

const AppointmentList = () => {
  const appointments = useSelector(appointmentsSelectors.selectAll);
  const patients = useSelector(patientsSelectors.selectEntities);
  const practitioners = useSelector(practitionersSelectors.selectEntities);
  return (
    <List>
      {appointments.map((appointment) => (
        <Card
          key={appointment.id}
          datacy={getAppointmentDatacy(appointment.id)}
        >
          <CardHeader
            avatar={<CalendarToday />}
            title={
              <Typography
                datacy={`${getAppointmentDatacy(appointment.id)}-range`}
              >
                {formatDateRange({
                  from: new Date(appointment.startDate),
                  to: new Date(appointment.endDate),
                })}
              </Typography>
            }
          />
          <CardContent>
            <Typography>
              Practitioner:{' '}
              {formatName(practitioners[appointment.practitionerId])}
            </Typography>
            <Typography>
              Patient: {formatName(patients[appointment.patientId])}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </List>
  );
};

export default AppointmentList;
