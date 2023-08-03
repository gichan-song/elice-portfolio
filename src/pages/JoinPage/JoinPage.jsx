import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [idCheck, setIdCheck] = useState(false);
  const [idCheckLiteral, setIdCheckLiteral] = useState('');
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [passwordCheckLiteral, setPasswordCheckLiteral] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (idCheck !== true) {
      alert('아이디를 확인해 주세요.');
      return;
    } else if (passwordCheck === false) {
      alert('비밀번호를 확인해 주세요.');
      return;
    } else {
      axios.post('http://localhost:4000/users/signup', {
        id: id,
        password: password,
        nickname: name,
      });
    }
    alert('회원가입이 완료되었습니다.');
    console.log('회원 생성 완료');
  };

  const validateId = (e) => {
    const regex = /^[a-zA-Z0-9]{4,12}$/;
    let value = e.target.value;
    let result = regex.test(value);
    return result;
  };

  return (
    <div>
      <h1>Signup</h1>
      <form>
        <input
          placeholder='아이디'
          onChange={(e) => {
            setId(e.target.value);

            if (e.target.value === '') {
              setIdCheckLiteral('아이디를 입력해주세요.');
              setIdCheck(false);
            } else if (validateId(e) === false) {
              setIdCheckLiteral('아이디는 4~12자의 영문 대소문자와 숫자로만 입력');
              setIdCheck(false);
            } else {
              axios
                .post('http://localhost:4000/users/validate/id/' + e.target.value)
                .then((res) => {
                  setIdCheckLiteral('사용 가능한 아이디입니다.');
                  setIdCheck(true);
                })
                .catch((err) => {
                  setIdCheckLiteral('이미 존재하는 아이디입니다.');
                  setIdCheck(false);
                });
            }
          }}
        ></input>
        {idCheckLiteral}

        <input
          placeholder='닉네임'
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <input
          placeholder='비밀번호'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <input
          placeholder='비밀번호 확인'
          onChange={(e) => {
            if (e.target.value === '') setPasswordCheck(false);
            else if (e.target.value !== password) {
              setPasswordCheckLiteral('비밀번호가 일치하지 않습니다.');
              setPasswordCheck(false);
            } else {
              setPasswordCheckLiteral('비밀번호가 일치합니다.');
              setPasswordCheck(true);
            }
          }}
        ></input>
        {passwordCheckLiteral}

        <button type='submit' onClick={handleSubmit}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
