import { HashRouter, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import { SignIn } from './components/SignIn';
import { TermsAndConditions } from './components/TermsAndConditions';
import { LandingPage } from './components/LandingPage';
import { UserHome } from './components/UserHome';


function App() {
  
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/termsandconditions" element={<TermsAndConditions />} />
        <Route path="/userhome" element={<UserHome />} />
      </Routes>
    </HashRouter>
  )
}

export default App