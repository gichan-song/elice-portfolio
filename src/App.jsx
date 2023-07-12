import GlobalStyle from './styles/GlobalStyle';
import AuthContext from './components/context/AuthContext';
import Router from './components/routes/Router';
import MainLayout from './components/common/layout/MainLayout/MainLayout';

function App() {
  return (
    <>
      <GlobalStyle />
      <AuthContext>
        <MainLayout>
          <Router />
        </MainLayout>
      </AuthContext>
    </>
  );
}

export default App;
