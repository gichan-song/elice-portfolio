import GlobalStyle from './styles/GlobalStyle';
import AuthContext from './context/AuthContext';
import Router from './routes/Router';
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
