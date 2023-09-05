import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import userIcon from '../../../assets/icons/user-icon.svg';
import imageIcon from '../../../assets/icons/image-icon.svg';
import Input from '../../../components/common/Input/Input';
import { useNavigate } from 'react-router-dom';
import useInput from '../../../hooks/useInput';
import imageCompression from 'browser-image-compression';
import API from '../../../api/API';
import ENDPOINT from '../../../api/ENDPOINT';
import { regexNickname, regexPassword } from '../../../utils/ValidationRegex';
import Button from '../../../components/common/Button/Button';

const ProfileEdit = () => {
  const navigate = useNavigate();

  const [getUserInfo, setGetUserInfo] = useState();

  // 유저정보 가져오기
  useEffect(() => {
    const getUserInfo = () => {
      API(`${ENDPOINT.GET_USER_INFO}`, 'GET')
        .then((res) => {
          setGetUserInfo(res.data);
          setProfileImage(res.data.profileImg);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getUserInfo();
  }, []);

  // 불필요하게 반복적인 API 호출을 막기
  const focusedInputRef = useRef(null);

  const handleInputFocus = (inputName) => {
    focusedInputRef.current = inputName;
  };

  // 프로필 이미지는 필수 입력이 아님
  const [profileImage, setProfileImage] = useState(userIcon);

  // 상태 및 이벤트 핸들러는 각 Input 컴포넌트에서 커스텀 훅을 통해 가져옴
  const nickname = useInput(regexNickname, 'nickname', getUserInfo?.nickname);
  const curPassword = useInput('', 'curPassword');
  const password = useInput(regexPassword, 'password');
  const confirmPassword = useInput('', 'confirmPassword');

  // 프로필 이미지 리사이징을 포함한 미리보기 기능
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2, // 최대 파일 크기 (메가바이트 단위)
          maxWidthOrHeight: 1920, // 최대 폭 또는 높이 (픽셀 단위)
          maxWidth: 1920, // 최대 폭 (픽셀 단위)
          maxHeight: 1080, // 최대 높이 (픽셀 단위)
          useWebWorker: true, // 웹 워커 사용 활성화
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.log('이미지 압축 에러:', error);
      }
    } else {
      setProfileImage(userIcon);
    }
  };

  // 닉네임 중복 검사
  useEffect(() => {
    if (getUserInfo?.nickname !== nickname.value && nickname.valid && focusedInputRef.current === 'nickname') {
      API(`${ENDPOINT.NICKNAME_DUPLICATE_CHECK}/${nickname.value}`, 'POST')
        .then()
        .catch((err) => {
          if (err.response.data.message === 'Nickname exists') {
            nickname.setDuplicate(true);
          }
        });
    }
  }, [getUserInfo, nickname]);

  // 비밀번호 일치 검사
  useEffect(() => {
    if (password.value === confirmPassword.value) {
      confirmPassword.setMismatch(false);
    } else {
      confirmPassword.setMismatch(true);
    }
  });

  // 프로필 수정하기
  const handleEditProfile = () => {
    API(`${ENDPOINT.EDIT_USER_PROFILE}`, 'PUT', {
      profileImg: profileImage,
      nickname: nickname.value,
      currentpassword: curPassword.value,
      changedpassword: confirmPassword.value ? confirmPassword.value : '',
    })
      .then((res) => {
        alert('프로필이 수정되었습니다.');
        // window.location.reload();
        navigate('/');
      })
      .catch((err) => {
        if (err.response.data.message === 'Password is incorrect') {
          curPassword.setShowValidationMessage(true);
        }
        console.log(err);
      });
  };

  // 버튼 상태관리
  const [disabledButton, setDisabledButton] = useState(true);

  // 비밀번호는 변경하지 않을 때
  const isPasswordUnchanged = (getUserInfo?.nickname === nickname.value || nickname.valid) && curPassword.value;

  // 비밀번호도 변경할 때
  const isPasswordchanged =
    (getUserInfo?.nickname === nickname.value || nickname.valid) &&
    curPassword.value &&
    password.valid &&
    confirmPassword.valid;

  // 비밀번호 변경 유무에 따른 논리 상태 관리
  const [logic, setLogic] = useState(isPasswordUnchanged);

  useEffect(() => {
    if (password.value || confirmPassword.value) {
      setLogic(isPasswordchanged);
    } else {
      setLogic(isPasswordUnchanged);
    }
  }, [password, confirmPassword, isPasswordUnchanged, isPasswordchanged]);

  useEffect(() => {
    if (logic) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [logic]);

  return (
    <>
      <Container>
        {' '}
        <ImageLabel htmlFor='profileImage'>
          <ProfileImage src={profileImage} alt='미리보기 이미지' />
          <ImageIcon src={imageIcon} alt='이미지 아이콘' />
        </ImageLabel>
        <ImageInput id='profileImage' type='file' accept='image/*' onChange={handleImageChange} />
        <EmailP>{getUserInfo?.id}</EmailP>
        <InputContainer>
          <Input
            labelName='닉네임'
            type='text'
            id='nickname'
            placeholder='영문, 숫자, 특수문자(.), (_)만 사용 가능합니다.'
            maxLength='10'
            onFocus={() => handleInputFocus('nickname')}
            {...nickname}
          />
          <Input
            labelName='현재 비밀번호'
            type='password'
            id='curPassword'
            placeholder='현재 비밀번호를 입력해 주세요.'
            maxLength='14'
            onFocus={() => handleInputFocus('')}
            {...curPassword}
          />
          <Input
            labelName='변경할 비밀번호'
            type='password'
            id='password'
            placeholder='6 ~ 14자리 비밀번호를 설정해 주세요.'
            maxLength='14'
            onFocus={() => handleInputFocus('')}
            {...password}
          />
          <Input
            labelName='변경할 비밀번호 확인'
            type='password'
            id='confirmPassword'
            placeholder='비밀번호를 확인해 주세요.'
            maxLength='14'
            onFocus={() => handleInputFocus('')}
            {...confirmPassword}
          />
        </InputContainer>
        <ButtonWrapper>
          <Anchor href='/'>취소</Anchor>
          <Button type='edit' disabled={disabledButton} onClickHandler={handleEditProfile}>
            수정하기
          </Button>
        </ButtonWrapper>
      </Container>
    </>
  );
};

export default ProfileEdit;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  width: 100%;
  margin: 2rem auto;
`;

const ImageInput = styled.input`
  display: none;
`;

const EmailP = styled.p`
  font-size: var(--fs-md);
  margin-top: -3rem;
`;

const ImageLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const ImageIcon = styled.img`
  width: 3rem;
  height: 3rem;
  position: absolute;
  right: 0;
  bottom: 0;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 3rem;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 2rem;
`;

const Anchor = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  font-size: var(--fs-sm);
  border: 1px solid var(--sub-darker-color);
  border-radius: 1rem;
  text-decoration: none;

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }
`;
