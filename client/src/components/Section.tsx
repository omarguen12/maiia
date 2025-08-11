import { ReactNode } from 'react';

type Props = {
  name: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
};

const Section = (props: Props) => {
  const { name, title, subtitle, children, className } = props;
  return (
    <section datacy={name} className={className}>
      <header>
        <h2>{title}</h2>
        {subtitle && <h3>{subtitle}</h3>}
      </header>
      <article>{children}</article>
    </section>
  );
};

export default Section;
