
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignIn from './pages/SignIn'
import Header from './components/Nav'
import Service from './pages/Service'

function App() {

  const WithHeader = ({ Component }) => {
    return (
      <>
        <Header />
        <Component />
      </>
    )
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn />} />
          <Route path='/service' element={<WithHeader Component={Service} />} />
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
