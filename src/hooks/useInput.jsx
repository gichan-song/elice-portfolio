import { useEffect, useState } from 'react';

const validationMessages = {
  // 회원가입
  email: {
    invalid: '올바른 이메일 형식이 아닙니다.',
    duplicate: '이미 사용중인 이메일입니다.',
    valid: '사용 가능한 이메일입니다.',
  },
  nickname: {
    invalid: '올바른 닉네임 형식이 아닙니다.',
    duplicate: '이미 사용중인 닉네임입니다.',
    valid: '사용 가능한 닉네임입니다.',
  },
  curPassword: {
    invalid: '현재 사용 중인 비밀번호와 일치하지 않습니다.',
    valid: '',
  },
  password: {
    invalid: '6 ~ 14자리 비밀번호를 설정해 주세요.',
    valid: '사용 가능한 비밀번호입니다.',
  },
  confirmPassword: {
    mismatch: '비밀번호가 일치하지 않습니다.',
    valid: '비밀번호가 일치합니다.',
  },

  // 로그인
  login_email: {
    invalid: '사용자 정보가 존재하지 않습니다.',
  },
  login_password: {
    invalid: '비밀번호가 일치하지 않습니다.',
  },
};

const useInput = (regex, id, initialValue) => {
  const validationMessageType = validationMessages[id];

  const [isRegexValid, setIsRegexValid] = useState(false);
  const [duplicate, setDuplicate] = useState(null);
  const [valid, setValid] = useState(null);
  const [mismatch, setMismatch] = useState(null);

  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const [validationMessage, setValidationMessage] = useState(null);

  const [value, setValue] = useState('');

  // 유저정보의 초기값 가져오기
  useEffect(() => {
    initialValue && setValue(initialValue);
  }, [initialValue]);

  const onChangeHandler = (e) => {
    if (regex && regex.test(e.target.value)) {
      setIsRegexValid(true);
    } else {
      setIsRegexValid(false);
    }
    setValue(e.target.value);
    setDuplicate(null);
    setMismatch(null);

    // 로그인은 초기화, 회원가입은 유지
    if (id === 'login_email' || id === 'login_password' || id === 'curPassword') {
      setShowValidationMessage(false);
    } else {
      setShowValidationMessage(true);
    }
  };

  useEffect(() => {
    if (!isRegexValid) {
      setValid(false);
      setValidationMessage(validationMessageType.invalid);
    } else if (isRegexValid && duplicate) {
      setValid(false);
      setValidationMessage(validationMessageType.duplicate);
    } else if (isRegexValid && !duplicate) {
      setValid(true);
      setValidationMessage(validationMessageType.valid);
    } else {
      setValidationMessage('');
    }

    if (id === 'confirmPassword') {
      if (mismatch) {
        setValid(false);
        setValidationMessage(validationMessageType.mismatch);
      } else {
        setValid(true);
        setValidationMessage(validationMessageType.valid);
      }
    }
  }, [duplicate, isRegexValid, valid, mismatch, validationMessageType, id]);

  return {
    value,
    onChange: onChangeHandler,

    isRegexValid,

    duplicate,
    setDuplicate,

    valid,
    setValid,

    mismatch,
    setMismatch,

    showValidationMessage,
    setShowValidationMessage,

    validationMessage,
    setValidationMessage,
  };
};

export default useInput;
