import React, { useState } from 'react';
import { styled } from 'styled-components';

const categories = ['전체', '한식', '양식', '일식', '중식', '분식', '도시락', '디저트', '기타'];

const CategoryMenu = ({ getSelectedCategory }) => {
  const [selectedMenu, setSelectedMenu] = useState('전체');

  return (
    <Nav>
      <Ul>
        {categories.map((category) => (
          <Li key={category} $selectedMenu={selectedMenu === category}>
            <button
              type='button'
              onClick={() => {
                setSelectedMenu(category);
                getSelectedCategory(category);
              }}
            >
              {category}
            </button>
          </Li>
        ))}
      </Ul>
    </Nav>
  );
};

export default CategoryMenu;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  border-radius: 1rem;
`;

const Ul = styled.ul`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const Li = styled.li`
  font-size: var(--fs-md);
  font-weight: 500;
  color: ${(props) => (props.$selectedMenu ? 'var(--main-color)' : 'var(--text-color)')};
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;
