import React from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  width: 300px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: calc(100% - 16px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoginForm = () => {
  return (
    <FormContainer>
      <FormGroup>
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" name="username" />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />
      </FormGroup>
      <Button type="submit">Login</Button>
    </FormContainer>
  );
};

export default LoginForm;
