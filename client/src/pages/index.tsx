import { Link } from '@material-ui/core';
import EditorLink from 'components/EditorLink';
import Section from 'components/Section';
import NextLink from 'next/link';


const Home = () => {
  return (
    <div className='home page'>
      <h1>Maiia's technical test</h1>
      <Section name="intro" title="Introduction">
        <p>
          To get the most out of this introduction, open the project using{' '}
          <Link href="https://code.visualstudio.com/" target="_blank">
            Visual Studio Code
          </Link>{' '}
          by clicking <EditorLink path="">this link</EditorLink>. You'll be able
          to open local files directly from your web browser. If you favor
          another editor which provides a similar API to open files, feel free
          to modify{' '}
          <EditorLink path="src/components/EditorLink.tsx:12:18">
            "src/components/EditorLink.tsx"
          </EditorLink>
          .
        </p>
      </Section>
      <Section name="instructions" title="Instructions">
        <p>
          You have just joined the Maiia Pro team as a back-end developper, your
          first mission is to implement two crucial features for the success of
          the company.{' '}
        </p>
        <p>Here are the features to implement:</p>
        <ul>
          <li>
            Complete an existing service (ProAvailabilityService.java) to generate availabilities of a practitioner. 
            Availabilities are calculated when you start the server by the method 
          </li>
          <li>Create appointments.</li>
        </ul>
      </Section>
      <Section name="timeslots" title="Time slots">
        <p>
          Every practitioner has many time slots which represent his interval of
          work time. The duration of an availability for an appointment is 15
          minutes, so for example if the practitioner has a one hour time slot,
          this will generate 4 availabilities of 15 minutes. If the practitioner
          add an appointment to his agenda that will reduce his availabilities.
        </p>
        <p>
          While selecting a practitioner in the dropdown list, the
          availabilities must be generated and displayed in the front (as in the
          screenshots). To create an appointment, you must select an
          availability and click on the button “create appointment”. An endpoint
          must be created in the back to create the appointment
        </p>
        <p>
          In the class ProAvailibilityServiceTest, there is some use cases of
          handling availabilities, you can check your implementation by running
          the tests.
        </p>
      </Section>
      <Section name="appointments" title="Appointments">
        <NextLink href="/appointments">
          <div className='cta'>
            <p><Link>Let's work on appointments</Link></p>
          </div>
        </NextLink>
      </Section>
    </div>
  );
};

Home.pageTitle = 'Test technique Maiia';

export default Home;
