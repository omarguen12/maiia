import { makeStyles } from '@material-ui/core';
import { Header } from './Header';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    fontFamily: 'Roboto, sans-serif',
  },
  content: {
    height: '100%',
  },
});

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export const Layout = (props: Props) => {
  const { children, title, subtitle } = props;
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <Header title={title} subtitle={subtitle} />
      <div className={classes.content}>{children}</div>
    </div>
  );
};
