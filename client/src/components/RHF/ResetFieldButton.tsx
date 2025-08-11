import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string;
};

const ResetFieldButton = (props: Props) => {
  const { name } = props;

  const { setValue } = useFormContext();

  const onReset = useCallback(() => {
    setValue(name, '');
  }, [name, setValue]);

  return (
    <IconButton onClick={onReset}>
      <Close />
    </IconButton>
  );
};

export default ResetFieldButton;
