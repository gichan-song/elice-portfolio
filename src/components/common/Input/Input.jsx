import React from 'react';
import { styled } from 'styled-components';

const Input = ({ labelName, type, id, placeholder, maxLength, onFocus, autoFocus, onKeyDown, ...inputProps }) => {
  const { value, onChange, valid, showValidationMessage, validationMessage } = inputProps;

  return (
    <>
      <div>
        <CommonLabel htmlFor='id'>{labelName}</CommonLabel>
        <CommonInput
          type={type}
          id={id}
          placeholder={placeholder}
          autoComplete='off'
          spellCheck='false'
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
        />
        {value.length !== 0 ? (
          <ValidationMessage $valid={valid}>{showValidationMessage && validationMessage}</ValidationMessage>
        ) : (
          <ValidationMessage></ValidationMessage>
        )}
      </div>
    </>
  );
};

export default Input;

const CommonLabel = styled.label`
  font-size: var(--fs-xs);
  font-weight: 700;
  color: var(--text-color);
`;

const CommonInput = styled.input`
  width: 100%;
  padding: 0.8rem 0;
  font-size: var(--fs-sm);
  font-weight: 500;
  border-bottom: 1px solid var(--border-color);
  outline: none;
  &:focus {
    border-bottom: 1px solid var(--border-color);
  }
  &::placeholder {
    font-size: var(--fs-sm);
    font-weight: initial;
    color: var(--text-light-color);
  }
`;

const ValidationMessage = styled.p`
  font-size: var(--fs-xs);
  height: 0rem;
  margin-top: 0.4rem;
  color: ${(props) => (props.$valid ? 'var(--text-valied-color)' : 'var(--text-alert-color)')};
`;
