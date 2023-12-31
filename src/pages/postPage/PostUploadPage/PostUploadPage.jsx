import { useEffect, useState } from 'react';
import { css, styled } from 'styled-components';
import imageCompression from 'browser-image-compression';
import MainHeadingLayout from './../../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import SubHeadingLayout from '../../../components/common/layout/SubHeadingLayout/SubHeadingLayout';
import DropDownMenu from './../../../components/common/DropDownMenu/DropDownMenu';
import plusIcon from '../../../assets/icons/plus-icon.svg';
import plusSqureIcon from '../../../assets/icons/plus-square-icon.svg';
import deleteIcon from '../../../assets/icons/delete-icon.svg';
import Button from './../../../components/common/Button/Button';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/API';
import ENDPOINT from '../../../api/ENDPOINT';
import { mediaMaxWidth } from '../../../styles/GlobalStyle';

const PostUploadPage = () => {
  const navigate = useNavigate();

  // 요리 소개 정보
  const [recipeIntro, setRecipeIntro] = useState({
    category: '',
    title: '',
    content: '',
    image: '',
  });

  // 조리 순서 정보
  const [orderInfos, setOrderInfos] = useState([
    {
      id: Date.now(),
      content: '',
      orderImage: '',
    },
  ]);

  // 카테고리 상태 관리
  const [category, setCategory] = useState();

  // 카테고리 가져오기
  const getCategory = (value) => {
    setCategory(value);
  };

  useEffect(() => {
    setRecipeIntro((cur) => ({
      ...cur,
      category: category,
    }));
  }, [category]);

  // OrderInfo를 추가하는 기능
  const handleAddOrderInfo = () => {
    if (orderInfos.length >= 10) {
      return alert('Step 10을 초과할 수 없습니다.');
    }
    const newOrderInfo = {
      id: Date.now(),
      content: '',
      orderImage: '',
    };
    setOrderInfos((cur) => [...cur, newOrderInfo]);
  };

  // OrderInfo를 삭제하는 기능
  const handleDeleteOrderInfo = (index) => {
    if (orderInfos.length <= 1) {
      return alert('조리 순서는 하나 이상 필요합니다.');
    }
    setOrderInfos((cur) => {
      const updatedOrderInfos = [...cur];
      updatedOrderInfos.splice(index, 1);
      return updatedOrderInfos;
    });
  };

  // OrderInfo 내용
  const handleOrderContent = (e, index) => {
    const updatedOrderInfos = [...orderInfos];
    updatedOrderInfos[index].content = e.target.value;
    setOrderInfos(updatedOrderInfos);
  };

  // recipeIntro 내용
  const handleRecipeIntro = (e) => {
    const { id, value } = e.target;
    setRecipeIntro((cur) => ({
      ...cur,
      [id]: value,
    }));
  };

  // 이미지 리사이징이 포함된 이미지 미리보기 기능
  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          // 완성 이미지
          if (e.target.id === 'contentImage') {
            setRecipeIntro((cur) => ({
              ...cur,
              image: reader.result,
            }));
          } else {
            // 조리 순서 이미지
            const updatedOrderInfos = [...orderInfos];
            updatedOrderInfos[index].orderImage = reader.result;
            setOrderInfos(updatedOrderInfos);
          }
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.log('이미지 압축 에러:', error);
      }
    } else {
      // 파일 선택을 하지 않거나 취소했을 경우
      // 완성 이미지
      if (e.target.id === 'contentImage') {
        return setRecipeIntro((cur) => ({
          ...cur,
          image: '',
        }));
      }
      // 조리 순서 이미지
      const updatedOrderInfos = [...orderInfos];
      updatedOrderInfos[index].orderImage = '';
      setOrderInfos(updatedOrderInfos);
    }
  };

  // 레시피 등록하기
  const handleRegister = () => {
    if (!orderInfos[0].content) {
      return alert('하나 이상의 조리순서를 입력해 주세요.');
    }

    API(`${ENDPOINT.POSTS}`, 'POST', {
      recipeIntro: recipeIntro,
      orderInfos: orderInfos,
    })
      .then((res) => {
        // 레시피 등록 성공 시
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 레시피 등록 취소하기
  const handleCancel = () => {
    navigate('/');
  };

  // 버튼 상태 관리
  const [disabledButton, setDisabledButton] = useState(true);
  useEffect(() => {
    if (recipeIntro.category && recipeIntro.title && recipeIntro.content && recipeIntro.image) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [recipeIntro, orderInfos]);

  return (
    <>
      <MainHeadingLayout mainheadingName='레시피 작성' />
      <SubHeadingLayout subHeadingName='카테고리 선택 및 요리 소개'>
        <RecipeContainer>
          <DropDownMenu getCategory={getCategory} />
          <RecipeInputContainer>
            <TitleInput
              type='text'
              id='title'
              placeholder='어떤 요리인가요? ex) 갈비찜'
              value={recipeIntro.title}
              onChange={handleRecipeIntro}
              autoFocus
              maxLength='30'
            />
            <ContentTextArea
              id='content'
              placeholder='요리에 대해 소개해 주세요.'
              maxLength='600'
              value={recipeIntro.content}
              onChange={handleRecipeIntro}
            />
            <ResultImgWrapper>
              <ResultImgLabel htmlFor='contentImage' $imagePreview={recipeIntro.image}>
                {recipeIntro.image === '' ? '' : <ImagePreview src={recipeIntro.image} alt='미리보기 이미지' />}
              </ResultImgLabel>
              <ResultImgInput id='contentImage' type='file' accept='image/*' onChange={handleImageChange} />
              <ImgDiv>완성 사진을 첨부해주세요.</ImgDiv>
            </ResultImgWrapper>
          </RecipeInputContainer>
        </RecipeContainer>
      </SubHeadingLayout>
      <SubHeadingLayout subHeadingName='조리 순서'>
        <OrderInfoContainer>
          {orderInfos.map((orderInfo, index) => (
            <OrderInfo key={orderInfo.id}>
              <StepSpan>{`Step ${index + 1}`}</StepSpan>
              <OrderContainer>
                <OrderContent
                  placeholder='조리과정에 대해 설명해 주세요.'
                  maxLength='600'
                  value={orderInfos.content}
                  onChange={(e) => {
                    handleOrderContent(e, index);
                  }}
                />
                <OrderImgLabel htmlFor={`contentImage-${orderInfo.id}`} $imagePreview={orderInfo.orderImage}>
                  {orderInfo.orderImage === '' ? '' : <ImagePreview src={orderInfo.orderImage} alt='미리보기 이미지' />}
                </OrderImgLabel>
                <OrderImgInput
                  id={`contentImage-${orderInfo.id}`}
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImageChange(e, index)}
                />
              </OrderContainer>
              <DeleteImg
                src={deleteIcon}
                alt='삭제 아이콘'
                onClick={() => {
                  handleDeleteOrderInfo(index);
                }}
              />
            </OrderInfo>
          ))}
        </OrderInfoContainer>
        <AddBtn type='button' onClick={handleAddOrderInfo}>
          <Figure>
            <PlusSquareImg src={plusSqureIcon} alt='추가하기 아이콘' />
            <Figcaption>추가하기</Figcaption>
          </Figure>
        </AddBtn>
      </SubHeadingLayout>
      <ButtonWrapper>
        <Button type='cancel' onClickHandler={handleCancel}>
          취소 하기
        </Button>
        <Button type='register' onClickHandler={handleRegister} disabled={disabledButton}>
          레시피 등록하기
        </Button>
      </ButtonWrapper>
    </>
  );
};

export default PostUploadPage;

const RecipeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  padding-top: 5rem;
`;

const RecipeInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  height: 40rem;
  padding: 2rem;
  border-radius: 1rem;
  background: var(--sub-bg-color);
`;

// 제목, 내용의 공통 속성
const InputStyles = css`
  width: 100%;
  height: 4rem;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  font-size: var(--fs-sm);
  background: #ffffff;

  &::placeholder {
    font-weight: 500;
    color: var(--text-color);
  }

  &:focus {
    outline: none;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// 레시피 이름
const TitleInput = styled.input`
  ${InputStyles}
`;

// 레시피 내용
const ContentTextArea = styled.textarea`
  ${InputStyles}
  height: 16rem;
  resize: none;
`;

// [시작] 레시피 완성 이미지 미리보기
const ResultImgWrapper = styled.div`
  display: flex;
  gap: 2rem;
`;

const ResultImgLabel = styled.label`
  display: block;
  width: 100%;
  max-width: 20rem;
  height: 12rem;
  border-radius: 1rem;
  cursor: pointer;
  background: ${(props) => (props.$imagePreview ? '' : `url(${plusIcon})`)} var(--sub-bg-darker-color) no-repeat center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const ResultImgInput = styled.input`
  display: none;
`;
// [끝] 레시피 완성 이미지 미리보기

// 이미지 미리보기
const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  background: var(--main-bg-color);
  object-fit: cover;
`;

// '완성 사진을 첨부해주세요' 문구를 위한 div
const ImgDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--text-light-color);

  @media (max-width: ${mediaMaxWidth}) {
    font-size: inherit;
  }
`;

// [시작] 조리순서
const OrderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
`;

const OrderInfo = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 1.5rem;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  background: var(--sub-lighter-color);
  border-radius: 1rem;

  @media (max-width: ${mediaMaxWidth}) {
    flex-direction: column;
  }
`;

const StepSpan = styled.span`
  white-space: nowrap;
  font-size: var(--fs-xs);
  font-weight: 700;
`;

const OrderContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  height: 100%;
`;

const OrderContent = styled.textarea`
  width: 100%;
  resize: none;
  border: 1px solid var(--border-light-color);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--main-bg-color);
  font-size: var(--fs-sm);

  &:focus {
    outline: none;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: ${mediaMaxWidth}) {
    width: 50%;
  }
`;

const OrderImgLabel = styled.label`
  display: block;
  min-width: 15rem;
  height: 11rem;
  margin-right: 2rem;
  border-radius: 1rem;
  cursor: pointer;
  background: ${(props) => (props.$imagePreview ? '' : `url(${plusIcon})`)} var(--sub-basic-color) no-repeat center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: ${mediaMaxWidth}) {
    min-width: initial;
    width: 50%;
    margin: initial;
  }
`;

const OrderImgInput = styled.input`
  display: none;
`;

const DeleteImg = styled.img`
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 2.4rem;
  height: 2.4rem;
  cursor: pointer;
`;
// [끝] 조리순서

// [시작] 추가하기
const AddBtn = styled.button`
  display: block;
  margin: 2rem auto 0;
`;

const Figure = styled.figure`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
`;

const PlusSquareImg = styled.img`
  width: 3.2rem;
  height: 3.2rem;
`;

const Figcaption = styled.figcaption`
  font-size: var(--fs-sm);
  font-weight: 500;
`;
// [끝] 추가하기

// 버튼 레이아웃 및 취소 하기
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 0 1.2rem;
  width: 100%;
  height: 4.5rem;

  @media (max-width: ${mediaMaxWidth}) {
    height: 4.5rem;
  }
`;
