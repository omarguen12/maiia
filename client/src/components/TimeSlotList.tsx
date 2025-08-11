import {
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Typography,
} from '@material-ui/core';
import List from '@material-ui/core/List';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { useSelector } from 'react-redux';
import { timeslotsSelectors } from 'store/selectors';
import { formatDateRange } from 'utils/format';

const useStyles = makeStyles({
  timeSlots: {
    display: 'grid',
    padding: 16,
    gridGap: 16,
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  },
});

const TimeSlotList = () => {
  const timeslots = useSelector(timeslotsSelectors.selectAll);
  const classes = useStyles();

  return (
    <List className={classes.timeSlots}>
      {timeslots.map((timeslot) => (
        <Card key={timeslot.id}>
          <CardHeader
            avatar={<CalendarTodayIcon />}
            title={
              <Typography>
                {formatDateRange({
                  from: new Date(timeslot.startDate),
                  to: new Date(timeslot.endDate),
                })}
              </Typography>
            }
          />
          <CardContent>
            <pre>
              <code>{JSON.stringify(timeslot, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      ))}
    </List>
  );
};

export default TimeSlotList;
