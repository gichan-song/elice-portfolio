import { styled } from 'styled-components';

const Post = ({ accountname }) => {
  return (
    <>
      <Article>
        <h3 className='sr-only'>{accountname}의 게시물</h3>
        <PostImg src='https://source.unsplash.com/random/?food' alt='' />
        <PostInfo>
          <Category>음식 카테고리</Category>
          <Name>음식 이름</Name>
        </PostInfo>
      </Article>
    </>
  );
};

export default Post;

const Article = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
`;

const PostImg = styled.img`
  border-radius: 1rem;
  aspect-ratio: 1;
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.6rem;
`;

const Category = styled.span`
  color: var(--text-color);
`;

const Name = styled.span`
  font-size: var(--fs-xs);
  font-weight: 500;
  color: var(--text-color);
`;
