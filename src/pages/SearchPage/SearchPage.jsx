import React, { useEffect, useState } from 'react';
import MainHeadingLayout from './../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import { styled } from 'styled-components';
import searchFillIcon from '../../assets/icons/search-fill-icon.svg';
import API from '../../api/API';
import ENDPOINT from './../../api/ENDPOINT';
import Post from './../../components/common/post/Post';
import { mediaMaxWidth } from '../../styles/GlobalStyle';
import useDebouncedValue from '../../hooks/useDebouncedValue';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const debouncedKeyword = useDebouncedValue(keyword, 300);

  useEffect(() => {
    if (debouncedKeyword === '') {
      setSearchResult([]);
      return;
    }

    API(`${ENDPOINT.SEARCH}?searchquery=${debouncedKeyword}`, 'GET')
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch((err) => console.log(err));
  }, [debouncedKeyword]);

  const HandleChange = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <>
      <MainHeadingLayout mainheadingName='검색' />
      <SearchContainer>
        <SearchInput type='search' placeholder='궁금한 레시피를 검색해 보세요.' onChange={HandleChange} />
        <SearchImage src={searchFillIcon} alt='검색하기 아이콘' />
      </SearchContainer>
      <Section>
        <h3 className='sr-only'>검색 결과</h3>
        {searchResult.map((item) => (
          <Post key={item._id} postInfo={item} />
        ))}
      </Section>
      {searchResult.length === 0 && <DescriptionP>관련된 레시피가 없습니다.</DescriptionP>}
    </>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 4.5rem;
  border: 2px solid var(--main-color);
  border-radius: 4rem;
  padding: 1rem 1.5rem;
  font-size: var(--fs-md);

  &:focus {
    outline: none;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  }

  // search X버튼 없애기
  &::-ms-clear,
  &::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
  }
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }

  @media (max-width: ${mediaMaxWidth}) {
    &::placeholder {
      font-size: var(--fs-sm);
    }
  }
`;

const SearchImage = styled.img`
  display: inline-block;
  margin-left: -4.5rem;
  width: 3rem;
  height: 3rem;
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: ${mediaMaxWidth}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const DescriptionP = styled.p`
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: var(--fs-md);
  margin: 3rem 0;
`;

export default SearchPage;
