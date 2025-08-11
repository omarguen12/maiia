import TaskList from './TaskList';
import { useState } from 'react';

type Props = {
  className?: string;
};

const AllTasks = (props: Props) => {
  const { className } = props;
  const [isAllAchievedTasksForm, setIsAllAchievedTasksForm] = useState(false);
  const [isAllAchievedTasksList, setIsAllAchievedTasksList] = useState(false);
  const [isAllAchievedTasksBonus, setIsAllAchievedTasksBonus] = useState(false);

  return (
    <div className={className}>
      <TaskList
        title="Tasks generation availabilities"
        tasks={[
          'Implement a service to generate availabilities for a practitioner',
          'In the class ProAvailibilityServiceTest, there is some use cases of handling availabilities, you can check your implementation by running the tests.',
        ]}
        name="tasks-form"
        onComplete={setIsAllAchievedTasksForm}
      />
      <TaskList
        title="Tasks for generate an appointment"
        tasks={['Add end-point to create an appointment']}
        name="tasks-list"
        onComplete={setIsAllAchievedTasksList}
      />
      <TaskList
        title="Bonus tasks"
        tasks={[
          '🤖 Add pattern DTO',
          '✏️ Add unit test',
          '✨ Feel free to improve the code and to add design patterns',
          `🎉 Something else that we didn't think of`,
        ]}
        name="tasks-bonus"
        onComplete={setIsAllAchievedTasksBonus}
      />
      {isAllAchievedTasksForm &&
        isAllAchievedTasksList &&
        isAllAchievedTasksBonus && (
          <p className="success">
            You finished the test, congratulation ! Before sending your project,
            make sure that everything works well and that your code is clean.
          </p>
        )}
    </div>
  );
};

export default AllTasks;
