import { useEffect, useState, useMemo } from 'react';
import {
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DoneAllIcon from '@material-ui/icons/DoneAll';

type Props = {
  tasks: string[];
  name: string;
  title: string;
  expected?: number;
  onComplete?: (value: boolean) => void;
};

const TaskList = (props: Props) => {
  const {
    tasks,
    name,
    title,
    onComplete,
    expected = props.tasks.length,
  } = props;
  const [localForm, setLocalForm] = useState({});

  useEffect(() => {
    const existingLocalForm = localStorage.getItem(name);
    if (existingLocalForm) {
      setLocalForm(JSON.parse(existingLocalForm));
    } else {
      localStorage.setItem(name, JSON.stringify({}));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(localForm));
  }, [localForm]);

  const numberOfAchievedTasks = useMemo(() => {
    return Object.keys(localForm).filter((goal) => localForm[goal] === true)
      .length;
  }, [localForm]);

  const isAchievedAllTasks = useMemo(() => numberOfAchievedTasks >= expected, [
    numberOfAchievedTasks,
    expected,
  ]);

  useEffect(() => {
    onComplete?.(isAchievedAllTasks);
  }, [isAchievedAllTasks]);

  return (
    <Accordion datacy={name}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h3>
          <span>{title}{' '}</span>
          <span>
            {numberOfAchievedTasks}/{expected}
          </span>{' '}
          {isAchievedAllTasks && <DoneAllIcon />}
        </h3>
      </AccordionSummary>
      <AccordionDetails>
        <ul>
          {tasks.map((instruction, i) => {
            const htmlFor = `${name}-${i}`;
            const currentValue = !!localForm?.[htmlFor];
            return (
              <li key={i}>
                <Checkbox
                  id={htmlFor}
                  name={htmlFor}
                  checked={!!localForm?.[htmlFor]}
                  onChange={() => {
                    setLocalForm((prevState) => ({
                      ...prevState,
                      [htmlFor]: !currentValue,
                    }));
                  }}
                  color="primary"
                />
                <label htmlFor={htmlFor}>{instruction}</label>
              </li>
            );
          })}
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default TaskList;
