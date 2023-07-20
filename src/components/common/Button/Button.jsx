import styled, { css } from 'styled-components';

const TYPES = {
  register: css`
    --button-width: 35rem;
    --button-height: 5rem;
    --button-font-size: var(--fs-md);
    --button-color: var(--sub-darker-color);
    --button-text-color: var(--text-white-color);
  `,
  cancel: css`
    --button-width: 10rem;
    --button-height: 5rem;
    --button-font-size: var(--fs-md);
    --button-color: var(--main-bg-color);
    --button-text-color: var(--text-color);
    --button-border-color: var(--border-color);
  `,
};

const Button = ({ type, disabled, children, onClickHandler }) => {
  const styleType = TYPES[type];

  return (
    <MainBtn $styleType={styleType} disabled={disabled} onClick={onClickHandler}>
      {children}
    </MainBtn>
  );
};

export default Button;

const MainBtn = styled.button`
  ${(p) => p.$styleType}
  width: var(--button-width);
  height: var(--button-height);
  font-size: var(--button-font-size);
  font-weight: 700;
  border-radius: 1rem;
  background-color: var(--button-color);
  color: var(--button-text-color);
  border: 1px solid var(--button-border-color);

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    cursor: default;
    background-color: var(--main-btn-disabled-color);
  }
`;
