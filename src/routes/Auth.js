import { authService } from "fbInstance";
import React, { useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
  } from 'firebase/auth';


const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [newAccount, setAccount] = useState(true);
    const [error, setError] = useState("");
  
    const onChange = (event) => {
        const  { name, value } = event.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setpassword(value);
        }
    }
    const onSubmit = async (event) => {
        event.preventDefault();

        try { 
            let data;
                if (newAccount) {
                //create account
                     data = await createUserWithEmailAndPassword(
                        authService,
                        email,
                        password
                      );         
                 } else {
                // log in
                 data = await signInWithEmailAndPassword(
                    authService,
                    email,
                    password
                  );   
                }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    }
    const toggleAccount = () => setAccount((prev) => !prev);
    
    const onSocialClick = async (event) => {
        const { target: { name } } = event;
        let provider;
        if (name === "google") {
            provider = new GoogleAuthProvider();
        } else {
            provider = new GithubAuthProvider();
        }
        const result = await signInWithPopup(authService, provider);
        console.log(result);
    }

    return (<div>
        <form onSubmit={onSubmit}>
            <input type="text" onChange={onChange} name="email" placeholder="Email" required value={email} />
            <input type="password" onChange={onChange} name="password" placeholder="Password" required value={password} />
            <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        </form>
        <span onClick={toggleAccount}>{newAccount? "Sign In" : "Create Account"}</span>
        <div>{error}</div>
        <div>
            <button onClick={onSocialClick} name="google">Continue with Google</button>
            <button onClick={onSocialClick} name="gh">Continue with GitHub</button>
        </div>
    </div>
    );
}
export default Auth;