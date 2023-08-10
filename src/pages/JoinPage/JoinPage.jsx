import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import imageCompression from 'browser-image-compression';
import MainHeadingLayout from './../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import userIcon from '../../assets/icons/user-icon.svg';
import imageIcon from '../../assets/icons/image-icon.svg';
import Input from '../../components/common/Input/Input';
import useInput from '../../hooks/useInput';
import { regexEmail, regexNickname, regexPassword } from '../../utils/ValidationRegex';
import API from '../../api/API';
import ENDPOINT from './../../api/ENDPOINT';
import Button from '../../components/common/Button/Button';
import { useNavigate } from 'react-router-dom';

const JoinPage = () => {
  const navigate = useNavigate();

  // 불필요하게 반복적인 API 호출을 막기
  const focusedInputRef = useRef(null);

  const handleInputFocus = (inputName) => {
    focusedInputRef.current = inputName;
  };

  // 프로필 이미지는 필수 입력이 아님
  const [profileImage, setProfileImage] = useState(userIcon);

  // 상태 및 이벤트 핸들러는 각 Input 컴포넌트에서 커스텀 훅을 통해 가져옴
  const email = useInput(regexEmail, 'email');
  const nickname = useInput(regexNickname, 'nickname');
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
  // 아이디 중복 검사
  useEffect(() => {
    if (email.valid && focusedInputRef.current === 'email') {
      API(`${ENDPOINT.EMAIL_DUPLICATE_CHECK}/${email.value}`, 'POST')
        .then((res) => console.log(res))
        .catch((err) => {
          if (err.response.data.message === 'Id exists') {
            email.setDuplicate(true);
          }
        });
    }
  }, [email]);

  // 닉네임 중복 검사
  useEffect(() => {
    if (nickname.valid && focusedInputRef.current === 'nickname') {
      API(`${ENDPOINT.NICKNAME_DUPLICATE_CHECK}/${nickname.value}`, 'POST')
        .then((res) => console.log(res))
        .catch((err) => {
          console.log(err);
          if (err.response.data.message === 'Nickname exists') {
            nickname.setDuplicate(true);
          }
        });
    }
  }, [nickname]);

  // 비밀번호 일치 검사
  useEffect(() => {
    if (password.value === confirmPassword.value) {
      confirmPassword.setMismatch(false);
    } else {
      confirmPassword.setMismatch(true);
    }
  });

  // 회원가입
  const handleJoin = () => {
    API(`${ENDPOINT.JOIN}`, 'POST', {
      profileImg: profileImage,
      id: email.value,
      nickname: nickname.value,
      password: confirmPassword.value,
    })
      .then((res) => {
        console.log(res);
        navigate('/login');
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <MainHeadingLayout MainheadingName='회원가입' />
      <Container>
        <ImageLabel htmlFor='profileImage'>
          <ProfileImage src={profileImage} alt='미리보기 이미지' />
          <ImageIcon src={imageIcon} alt='이미지 아이콘' />
        </ImageLabel>
        <ImageInput id='profileImage' type='file' accept='image/*' onChange={handleImageChange} />
        <InputContainer>
          <Input
            labelName='아이디'
            type='text'
            id='email'
            placeholder='이메일 주소를 입력해 주세요.'
            maxLength='30'
            onFocus={() => handleInputFocus('email')}
            {...email}
          />
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
            labelName='비밀번호'
            type='password'
            id='password'
            placeholder='6 ~ 14자리 비밀번호를 설정해 주세요.'
            maxLength='14'
            onFocus={() => handleInputFocus('')}
            {...password}
          />
          <Input
            labelName='비밀번호 확인'
            type='password'
            id='confirmPassword'
            placeholder='비밀번호를 확인해 주세요.'
            maxLength='14'
            onFocus={() => handleInputFocus('')}
            {...confirmPassword}
          />
        </InputContainer>
        <Button
          type='join'
          disabled={!(email.valid && nickname.valid && password.valid && confirmPassword.valid)}
          onClickHandler={handleJoin}
        >
          회원가입
        </Button>
        <Anchor href='/login'>
          <button>로그인</button>
        </Anchor>
      </Container>
    </>
  );
};

export default JoinPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  width: 100%;
  margin: 0 auto;
`;

const ImageInput = styled.input`
  display: none;
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

const Anchor = styled.a`
  font-size: var(--fs-sm);
  padding: 0.6rem;
  border-radius: 1rem;
  transform: translateY(-2rem);
`;
