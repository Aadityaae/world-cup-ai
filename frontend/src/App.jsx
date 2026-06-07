import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Predict from './pages/Predict'
import Groups from './pages/Groups'
import Simulate from './pages/Simulate'

const AppRoutes = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<Home />}     />
        <Route path="/predict"  element={<Predict />}  />
        <Route path="/groups"   element={<Groups />}   />
        <Route path="/simulate" element={<Simulate />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App