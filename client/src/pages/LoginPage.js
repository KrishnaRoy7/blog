// import React from 'react';
// import styled from 'styled-components';
// import LoginForm from './LoginForm';

import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

// const PageContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
// `;

const LoginPage = (ev) => {
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [redirect,setRedirect]=useState(false)
  const {setUserInfo} =useContext(UserContext)
  const login=async (ev)=>{
    ev.preventDefault();
    
    const response= await fetch('https://blog-application-shxy.onrender.com/login' ,{
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers:{'Content-Type' : 'application/json'},
      credentials: 'include',
    });
    if(response.ok){
      response.json().then(userInfo=>{
        setUserInfo(userInfo);
        setRedirect(true)
      })
    }else{
      alert('Wrong Credential')
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input type="text" 
      placeholder="username"
      value={username}
      onChange={ev=> setUsername(ev.target.value)}
      />
      <input type="password" 
      placeholder="password"
      value={password}
      onChange={ev=> setPassword(ev.target.value)}
      />
      <button>Login</button>
    </form>
  );
};

export default LoginPage;
