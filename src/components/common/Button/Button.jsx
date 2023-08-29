import styled, { css } from 'styled-components';

const TYPES = {
  register: css`
    --button-width: 100%;
    --button-height: 100%;
    --button-font-size: var(--fs-md);
    --button-color: var(--sub-darker-color);
    --button-text-color: var(--text-white-color);
  `,
  cancel: css`
    --button-width: 50%;
    --button-height: 100%;
    --button-font-size: var(--fs-md);
    --button-color: var(--main-bg-color);
    --button-text-color: var(--text-color);
    --button-border-color: var(--border-color);
  `,
  category: css`
    --button-width: 12rem;
    --button-height: 4rem;
    --button-font-size: var(--fs-md);
    --button-color: var(--main-bg-color);
    --button-border-color: var(--main-color);
  `,
  join: css`
    --button-width: 100%;
    --button-height: 5rem;
    --button-font-size: var(--fs-md);
    --button-color: var(--sub-darker-color);
    --button-text-color: var(--text-white-color);
  `,
  login: css`
    --button-width: 100%;
    --button-height: 5rem;
    --button-font-size: var(--fs-md);
    --button-color: var(--sub-darker-color);
    --button-text-color: var(--text-white-color);
  `,
  logout: css`
    --button-width: 8rem;
    --button-height: 4.5rem;
    --button-font-size: var(--fs-md);
    --button-color: var(--sub-darker-color);
    --button-text-color: var(--text-white-color);
  `,
  comment: css`
    --button-width: 8rem;
    --button-height: 4rem;
    --button-font-size: var(--fs-sm);
    --button-color: var(--sub-darker-color);
    --button-text-color: var(--text-white-color);
  `,
};

const Button = ({ type, disabled, active, children, onClickHandler }) => {
  const styleType = TYPES[type];

  return (
    <MainBtn $styleType={styleType} disabled={disabled} $active={active} onClick={onClickHandler}>
      {children}
    </MainBtn>
  );
};

export default Button;

const MainBtn = styled.button`
  ${(p) => p.$styleType}
  min-width: var(--button-width);
  height: var(--button-height);
  font-size: var(--button-font-size);
  font-weight: 500;
  border-radius: 1rem;
  background-color: ${(props) => (props.$active ? 'var(--main-color)' : 'var(--button-color)')};
  color: ${(props) => (props.$active ? 'var(--text-white-color)' : 'var(--button-text-color)')};
  border: 1px solid var(--button-border-color);

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    cursor: default;
    background-color: var(--sub-lighter-color);
  }
`;
