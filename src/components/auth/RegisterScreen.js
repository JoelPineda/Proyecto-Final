import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import validator from 'validator';
import { startRegister } from '../../actions/auth';
import { removeError, setError } from '../../actions/ui';
import { useForm } from '../../hooks/useForm';
import 'animate.css';
export const RegisterScreen = () => {


    const dispathc = useDispatch();

    const {msgError} = useSelector(state => state.ui);

    console.log(msgError);

    const [formValues, handleInputChange] = useForm ({
        name: 'Joel Pineda',
        email: 'joel@gmail.com',
        password:'123456',
        password2: '123456'
    });

    const {name, email, password, password2 } = formValues;

    const handleRegister = (e) =>{
        e.preventDefault();
        
        if(isFormValid()){
            dispathc(startRegister(name, email, password));
        }
    }

    const isFormValid = () =>{
        
        if(name.trim().length === 0){
            dispathc(setError('Name is required'));
            return false;
        }else if(!validator.isEmail(email)){
            dispathc(setError('Email is not valid'));
            return false;
        }else if(password !== password2 || password.length < 5){
            dispathc(setError('Password should be at least 6 characters and match each otherd'));
            return false;
        }
        dispathc(removeError());
        return true;
    }
    
    return (
        <>
        <h3 className="auth__title">Register</h3>

        <form onSubmit={handleRegister} className="animate__animated animate__fadeIn animate__faster">
            {
                msgError &&
                (
                    <div className="auth__alert-error">
                        {msgError}
                    </div>
                )
            }
            <input
                type="text"
                placeholder="Name"
                name="name"
                autoComplete="off"
                className="auth__input"
                value={name}
                onChange = {handleInputChange}
            />
            <input
                type="email"
                placeholder="Email"
                name="email"
                autoComplete="off"
                className="auth__input"
                value={email}
                onChange = {handleInputChange}
            />
            <input
                type="password"
                placeholder="password"
                name="password"
                className="auth__input"
                value={password}
                onChange = {handleInputChange}
            />

            <input
                type="password"
                placeholder="Confirm"
                name="password2"
                className="auth__input"
                value={password2}
                onChange = {handleInputChange}
            />

            <button
                type="submit"
                className="btn btn-primary btn-block mb-5"

            >
                Register
            </button>

            <Link to="/auth/login" className="link">
                Already register?
            </Link>
        </form>
    </>
    )
}
