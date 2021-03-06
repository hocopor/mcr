import React from 'react';
import { classNames } from 'utils';

import './index.scss';

type SVGIcon = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;

type DefaultInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export interface IInputProps extends DefaultInputProps {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  type?: string;
  placeholder?: string;
  leftIcon?: SVGIcon;
  rightIcon?: SVGIcon;
  fullWidth?: boolean;
}

const Input = ({
  value,
  onChange,
  name,
  type = 'text',
  placeholder,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...inputProps
}: IInputProps) => {
  const LeftIcon = leftIcon;
  const RightIcon = rightIcon;

  return (
    <div
      className={`input ${classNames({
        'input--left-icon': !!LeftIcon,
        'input--right-icon': !!RightIcon,
        'input--full-width': fullWidth,
      })}`}
    >
      {LeftIcon && <LeftIcon className="input__icon input__icon--left" />}
      <input
        className="input__field"
        onChange={onChange}
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        {...inputProps}
      />
      {RightIcon && <RightIcon className="input__icon input__icon--right" />}
    </div>
  );
};

export default Input;
