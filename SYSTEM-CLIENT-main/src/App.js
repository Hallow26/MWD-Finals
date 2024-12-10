import { Container } from 'react-bootstrap';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import AppNavbar from './components/AppNavbar';
import Banner from './pages/Banner';
import CourseCard from './components/CourseCard';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import ErrorPage from './pages/ErrorPage';
import { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';
import Course from './pages/Course';
import AddCourse from './pages/AddCourse';
import Profile from './pages/Profile';







function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })

  const unsetUser = () => {
    localStorage.clear();
  }

  useEffect(() => {
    fetch("http://localhost:4000/users/details", {
      method: "POST",
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
      }
  })
  .then(result => result.json())
  .then(data => {
      if(typeof data.result !== "undefined"){
        setUser({
          id: data.result._id,
          isAdmin: data.result.isAdmin
        })
      }else{
        setUser({
          id: null,
          isAdmin: null
        })
      }
  })
  }, [])

  return (
    <>
    <UserProvider value={{user, setUser, unsetUser}}>
    <Router>
          <Container fluid>
            <AppNavbar/>
              <Routes>
                <Route path='/' element={<Banner/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/logout' element={<Logout/>}/>
                <Route path='/courses' element={<Course/>}/>
                <Route path='/add-course' element={<AddCourse/>}/>
                <Route path='profile-settings' element={<Profile/>}/>
                <Route path='*' element={<ErrorPage/>}/>
              </Routes>
          </Container>
        </Router>
    </UserProvider>
        
    </>
  );
}

export default App;