import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import chevronDownIcon from '../../../assets/icons/chevron-down-icon.svg';
import chevronUpIcon from '../../../assets/icons/chevron-up-icon.svg';
import useModal from '../../../hooks/useModal';

const categories = ['한식', '양식', '일식', '중식', '분식', '도시락', '디저트', '기타'];

const DropDownMenu = ({ getCategory, inititalCategory }) => {
  const [dropDownMenuName, setDropDownMenuName] = useState('카테고리');
  const [selectedCategory, setSelectedCategory] = useState();
  const [modalOpen, toggle, targetRef, contentRef] = useModal();

  useEffect(() => {
    // PostUpladPage로 상태 끌어올리기
    getCategory(selectedCategory);
    inititalCategory && setDropDownMenuName(inititalCategory);
  }, [selectedCategory, getCategory, inititalCategory]);

  return (
    <>
      <Container>
        <ButtonWrapper>
          <DropDownMenutButton type='button' onClick={toggle} ref={targetRef} $modalOpen={modalOpen}>
            {dropDownMenuName}
          </DropDownMenutButton>
          <ButtonDescription>음식 카테고리를 선택해 주세요.</ButtonDescription>
        </ButtonWrapper>
        {modalOpen && (
          <>
            <Ul ref={contentRef}>
              {categories.map((category) => (
                <Li
                  $active={selectedCategory === category ? 'true' : 'false'}
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setDropDownMenuName(category);
                    toggle();
                  }}
                >
                  {category}
                </Li>
              ))}
            </Ul>
          </>
        )}
      </Container>
    </>
  );
};

export default DropDownMenu;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  gap: 1rem;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
`;

const DropDownMenutButton = styled.button`
  min-width: 15rem;
  height: 4rem;
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--text-white-color);
  background: ${(props) => (props.$modalOpen ? `url(${chevronUpIcon})` : `url(${chevronDownIcon})`)} no-repeat center
    right 5% var(--main-color);
  border-radius: 1rem;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const ButtonDescription = styled.p`
  width: 100%;
  font-size: var(--fs-sm);
  color: var(--text-color);
`;

const Ul = styled.ul`
  display: flex;
  flex-direction: column;
  width: 15rem;
  padding: 1rem;
  background: var(--sub-bg-color);
  border-radius: 1rem;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const Li = styled.li`
  padding: 1rem;
  font-size: var(--fs-md);
  font-weight: 700;
  color: ${(props) => (props.$active === 'true' ? 'var(--main-color)' : 'var(--text-color)')};
  text-align: center;
  border-radius: 1rem;
  cursor: pointer;

  &:hover {
    color: var(--main-color);
  }
`;
