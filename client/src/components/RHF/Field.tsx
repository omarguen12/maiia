import { Typography } from '@material-ui/core';
import { memoize } from 'lodash';
import { ComponentPropsWithoutRef, ElementType, useMemo } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

export type FieldProps<C extends ElementType> = {
  autoComplete?: string;
  component?: C;
  error?: FieldError;
  label?: string;
  name: string;
  placeholder?: string;
  required?: string;
} & Omit<
  C extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[C] & { gridkey?: string }
    : ComponentPropsWithoutRef<C>,
  'required'
>;
const disableAutocompleteHack = memoize((placeholder: string) =>
  placeholder?.split('').join('\u200b'),
);
const Field = <C extends keyof JSX.IntrinsicElements | ElementType = 'input'>(
  props: FieldProps<C>,
) => {
  const {
    autoComplete = 'off',
    children,
    component: Component = 'input',
    label,
    name,
    placeholder,
    required = '',
    ...rest
  } = props;

  const { errors, register } = useFormContext();
  const error = errors[name];

  const placeholderValue = useMemo(() => {
    if (!placeholder) return;
    if (autoComplete === 'off') return disableAutocompleteHack(placeholder);
    return placeholder;
  }, [autoComplete, placeholder]);
  const field = useMemo(
    () => (
      <Component
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholderValue}
        ref={register({ required })}
        gridkey={label ? null : name}
        {...rest}
      >
        {children}
      </Component>
    ),
    [
      autoComplete,
      children,
      Component,
      label,
      name,
      placeholderValue,
      register,
      required,
    ],
  );
  const fieldError = useMemo(
    () =>
      error ? <Typography color="error">{error.message}</Typography> : null,
    [error],
  );
  if (label) {
    return (
      <label>
        <span>{`${label}${required ? '*' : ''}`}</span>
        {field}
        {fieldError}
      </label>
    );
  }
  return (
    <>
      {fieldError}
      {field}
    </>
  );
};

export default Field;
