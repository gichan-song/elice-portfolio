import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import './font.css';
import './global.css';

const GlobalStyle = createGlobalStyle`
  ${reset};

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Spoqa Han Sans Neo', sans-serif;
    color: inherit;
    background-color: #F5F5F5;
    
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  
  button, input, textarea {
    font-family: 'Spoqa Han Sans Neo', sans-serif;
    padding: 0;
    border: none;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    background-color: inherit;
  }

  button {
    cursor: pointer;
  }

  ol, ul, li {
    list-style: none;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const mediaMaxWidth = '540px';

export default GlobalStyle;
