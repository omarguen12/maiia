import { AppBar, makeStyles, Toolbar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Link from 'next/link';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
  back: {
    gridArea: 'back',
    color: 'white',
    margin: 'auto',
  },
  backLabel: { color: 'white' },
  title: { gridArea: 'title', color: 'white' },
  subtitle: { gridArea: 'subtitle', color: 'lightgray' },
});

type Props = {
  title: string;
  subtitle?: string;
};

export const Header = (props: Props) => {
  const { title, subtitle } = props;
  const { pathname } = useRouter();
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/">
          <IconButton
            classes={{ label: classes.backLabel }}
            disabled={pathname === '/'}
          >
            M
          </IconButton>
        </Link>
        <span className={classes.title}>{title}</span>
        {subtitle && <span className={classes.subtitle}>{subtitle}</span>}
      </Toolbar>
    </AppBar>
  );
};
