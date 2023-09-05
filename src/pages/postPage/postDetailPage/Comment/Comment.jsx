import React, { useState } from 'react';
import SubHeadingLayout from '../../../../components/common/layout/SubHeadingLayout/SubHeadingLayout';
import { styled } from 'styled-components';
import profileIcon from '../../../../assets/icons/profile-icon.svg';
import deleteFillIcon from '../../../../assets/icons/delete-fill-icon.svg';
import API from '../../../../api/API';
import ENDPOINT from '../../../../api/ENDPOINT';
import Button from '../../../../components/common/Button/Button';

const Comment = ({ postInfo, getPostInfo }) => {
  // 댓글 작성 시 기능구현
  const [comment, setComment] = useState('');

  const HandleCommentInput = (e) => {
    setComment(e.target.value);
  };

  const HandleWrite = async () => {
    if (!comment.trim().length > 0) {
      alert('의미 있는 댓글을 작성해 주세요.');
      setComment('');
      return;
    }

    await API(`${ENDPOINT.POSTS}/${postInfo._id}/comments`, 'POST', { comment: comment })
      .then((res) => {
        setComment('');
        setTimeout(() => {
          getPostInfo();
        }, 100);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 엔터 키를 눌렀을 때 댓글 작성 클릭과 동일한 효과를 주기 위한 함수
  const onEnterKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      HandleWrite();
    }
  };

  const handleRemove = async (commentId) => {
    const userConfirmed = window.confirm('정말로 댓글을 삭제하시겠습니까?');
    if (!userConfirmed) {
      return;
    }

    await API(`${ENDPOINT.POSTS}/${postInfo._id}/comments/${commentId}`, 'DELETE')
      .then((res) => {
        setComment('');
        setTimeout(() => {
          getPostInfo();
        }, 100);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message === 'User not authorized') {
          return alert('자신의 댓글만 삭제할 수 있습니다.');
        }
      });
  };

  return (
    <>
      <SubHeadingLayout subHeadingName={`댓글 ${postInfo.comments?.length}`}>
        <CommentLayout>
          {postInfo.comments &&
            postInfo.comments.map((item) => (
              <CommentContainer key={item._id}>
                <ProfileInfoContainer>
                  <ProfileInfo>
                    <ProfileImg src={item.userProfileImg ? item.userProfileImg : profileIcon} alt='프로필 이미지' />
                    <UserName>{item.userNickname}</UserName>
                  </ProfileInfo>
                  {
                    <DeleteImg
                      src={deleteFillIcon}
                      alt='삭제 아이콘'
                      onClick={() => {
                        handleRemove(item._id);
                      }}
                    />
                  }
                </ProfileInfoContainer>
                <CommentContent>{item.comment}</CommentContent>
                <DateInfo>{item.date}</DateInfo>
              </CommentContainer>
            ))}
          {postInfo.comments?.length === 0 && <span>작성된 댓글이 없습니다.</span>}
        </CommentLayout>
        <CommentInputWrapper>
          <CommentInput
            type='text'
            placeholder='댓글 작성'
            onChange={HandleCommentInput}
            value={comment}
            maxLength={300}
            onKeyDown={onEnterKeyDownHandler}
          />
          <Button type='comment' onClickHandler={HandleWrite}>
            댓글 작성
          </Button>
        </CommentInputWrapper>
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
  border: 1px solid var(--border-color);
  border-radius: 50%;
  object-fit: cover;
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
  word-break: break-all;
`;

const DateInfo = styled.span`
  color: var(--text-color);
`;

const CommentInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const CommentInput = styled.input`
  width: 100%;
  height: 4rem;
  border: 2px solid var(--border-color);
  font-size: var(--fs-sm);
  padding: 1.5rem 1rem;
  border-radius: 8px;
  &:focus {
    outline: none;
    border: 2px solid var(--main-color);
  }
`;
