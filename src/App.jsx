import GlobalStyle from './styles/GlobalStyle';
import AuthContext from './context/AuthContext';
import MainLayout from './components/common/layout/MainLayout/MainLayout';
import Router from './routes/Router';

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
