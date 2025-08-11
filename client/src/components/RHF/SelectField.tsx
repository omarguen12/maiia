import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Field, { FieldProps } from './Field';
import ResetFieldButton from './ResetFieldButton';

type SelectFieldOption = {
  key: number | string;
  label: string;
  value: number;
};

type SelectFieldProps = {
  options: SelectFieldOption[];
  onChange?: (value: number) => void;
} & Omit<FieldProps<'select'>, 'onChange'>;

export const getOptionsDefault = <
  T extends { id: number; firstName: string; lastName: string }
>(
  list: T[],
): SelectFieldOption[] =>
  list.map((item) => ({
    label: `${item.firstName} ${item.lastName}`,
    key: item.id,
    value: item.id,
  }));

const SelectField = (props: SelectFieldProps) => {
  const { name, options, placeholder, onChange, ...fieldProps } = props;

  const { control } = useFormContext();
  const value = useWatch<number>({
    control,
    name,
  });

  useEffect(() => {
    onChange?.(value);
  }, [value]);

  return (
    <div>
      <Field component="select" defaultValue="" name={name} {...fieldProps}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      {value && <ResetFieldButton name={name} />}
    </div>
  );
};

export default SelectField;
