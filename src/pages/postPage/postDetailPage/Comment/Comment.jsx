import React from 'react';
import SubHeadingLayout from '../../../../components/common/layout/SubHeadingLayout/SubHeadingLayout';
import { styled } from 'styled-components';
import profileIcon from '../../../../assets/icons/profile-icon.svg';
import deleteFillIcon from '../../../../assets/icons/delete-fill-icon.svg';

const Comment = () => {
  const handleRemove = () => {
    console.log('댓글 삭제 기능이 들어갈 곳입니다.');
  };

  return (
    <>
      <SubHeadingLayout subHeadingName='댓글'>
        <CommentLayout>
          <CommentContainer>
            <ProfileInfoContainer>
              <ProfileInfo>
                <ProfileImg src={profileIcon} alt='프로필 이미지' />
                <UserName>{'user1'}</UserName>
              </ProfileInfo>
              <DeleteImg src={deleteFillIcon} alt='삭제 아이콘' onClick={handleRemove} />
            </ProfileInfoContainer>
            <CommentContent>{`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. `}</CommentContent>
            <DateInfo>{'22분 전'}</DateInfo>
          </CommentContainer>

          <CommentContainer>
            <ProfileInfoContainer>
              <ProfileInfo>
                <ProfileImg src={profileIcon} alt='프로필 이미지' />
                <UserName>{'user2'}</UserName>
              </ProfileInfo>
              <DeleteImg src={deleteFillIcon} alt='삭제 아이콘' onClick={handleRemove} />
            </ProfileInfoContainer>
            <CommentContent>{`Lorem Ipsum is simply dummy text of the printing and typesetting industry. `}</CommentContent>
            <DateInfo>{'1시간 전'}</DateInfo>
          </CommentContainer>
        </CommentLayout>
      </SubHeadingLayout>
    </>
  );
};

export default Comment;

const CommentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--border-color);
`;

const ProfileInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const ProfileImg = styled.img`
  width: 2rem;
  height: 2rem;
`;

const UserName = styled.span`
  font-size: var(--fs-xs);
  font-weight: 500;
`;

const DeleteImg = styled.img`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
`;

const CommentContent = styled.p`
  font-size: var(--fs-sm);
`;

const DateInfo = styled.span`
  color: var(--text-color);
`;
