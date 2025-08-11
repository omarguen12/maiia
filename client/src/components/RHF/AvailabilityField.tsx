import { List, Typography } from '@material-ui/core';
import { Availability } from 'store/types';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { availabilitiesSelectors } from 'store/selectors';
import { formatDate, formatTimeRange } from 'utils/format';

type Props = {
  name: string;
};

const groupAvailabilitiesByDate = (availabilities: Availability[]) =>
  availabilities.reduce((result, availability) => {
    const formatedDate = formatDate(availability.startDate);
    if (result[formatedDate]) {
      return {
        ...result,
        [formatedDate]: [...result[formatedDate], availability],
      };
    }
    return { ...result, [formatedDate]: [availability] };
  }, {});

const AvailabilityField = (props: Props) => {
  const { name } = props;
  const { control, errors } = useFormContext();
  const availabilities = useSelector(availabilitiesSelectors.selectAll);
  const loading = useSelector(availabilitiesSelectors.selectLoading);

  const availabilitiesGroupByDate = useMemo(
    () => groupAvailabilitiesByDate(availabilities),
    [availabilities],
  );

  if (!availabilities.length) return null;
  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      rules={{ required: 'The availability field is required' }}
      render={({ onChange, value }) => (
        <>
          <List className="list">
            {Object.keys(availabilitiesGroupByDate).map(
              (dayOfAvailabilities) => {
                const sortedAvailabilities =
                  availabilitiesGroupByDate[dayOfAvailabilities];
                return (
                  <div key={dayOfAvailabilities} className="day">
                    <h2>{dayOfAvailabilities}</h2>
                    {sortedAvailabilities.map(({ id, startDate, endDate }) => {
                      const isSelected = value === id;
                      return (
                        <button
                          className={clsx(isSelected && 'selected', 'btn')}
                          disabled={loading}
                          key={id}
                          onClick={() => {
                            onChange(isSelected ? '' : id);
                          }}
                        >
                          <Typography
                            color={!isSelected ? 'textPrimary' : 'inherit'}
                          >
                            {formatTimeRange({
                              from: startDate,
                              to: endDate,
                            })}
                          </Typography>
                        </button>
                      );
                    })}
                  </div>
                );
              },
            )}
          </List>
          {errors[name] ? (
            <Typography color="error">{errors[name].message}</Typography>
          ) : null}
        </>
      )}
    />
  );
};

export default AvailabilityField;
