import { Link } from '@material-ui/core';
import config from 'config';
import { ReactNode } from 'react';

const CURRENT_WORKING_DIRECTORY = config.get('CURRENT_WORKING_DIRECTORY');

type Props = { path: string; children: ReactNode };

const EditorLink = (props: Props) => {
  const { path, children } = props;
  return (
    <Link href={`vscode://file/${CURRENT_WORKING_DIRECTORY}/${path}`}>
      {children}
    </Link>
  );
};

export default EditorLink;
