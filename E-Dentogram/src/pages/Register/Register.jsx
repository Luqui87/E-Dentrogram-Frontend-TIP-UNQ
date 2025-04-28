import { useState } from 'react';
import './Register.css'
import API from '../../service/API';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function Register(){

    const navigate = useNavigate()


    const [newUsername, setUsername] = useState("")
    const [newPassword, setPassword] = useState("");
    const [validate, setValidate] = useState({
        hasLow: false,
        hasCap: false,
        hasNumber: false,
        has8digit: false
    });

    const [confirmPasword, setConfirmPassword] = useState("")
    const [samePassword, setSamePassword] = useState(true)

    const [seePassword1, setSeePassword1] = useState(false)
    const [seePassword2, setSeePassword2] = useState(false)


    const strength = Object.values(validate).reduce((a, item) => a + item, 0);
    const feedback = {
        1: "Contraseña es vulnerable!",
        2: "Contraseña es debil! ",
        3: "Contraseña decente!",
        4: "Genial! tu contraseña es segura"
    }[strength];

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const validatePassword = (password) => {
        if (newPassword.match(/\d+/g)) {
        setValidate((o) => ({ ...o, hasNumber: true }));
        } else {
        setValidate((o) => ({ ...o, hasNumber: false }));
        }

        if (newPassword.match(/[A-Z]+/g)) {
        setValidate((o) => ({ ...o, hasCap: true }));
        } else {
        setValidate((o) => ({ ...o, hasCap: false }));
        }

        if (newPassword.match(/[a-z]+/g)) {
        setValidate((o) => ({ ...o, hasLow: true }));
        } else {
        setValidate((o) => ({ ...o, hasLow: false }));
        }

        if (newPassword.length > 7) {
        setValidate((o) => ({ ...o, has8digit: true }));
        } else {
        setValidate((o) => ({ ...o, has8digit: false }));
        }
    };

    const checkPassword = (e) => {
        setConfirmPassword(e.target.value);
        setSamePassword(e.target.value == newPassword)
    }


    const showIcon = (handleState) => {
        return(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 seePassword" onClick={() => handleState()}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>

        )
    }

    const hideIcon = (handleState) => {
        return(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 seePassword" onClick={() => handleState()}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>

        )
    }

    const handleEnter = (event) =>{
        if (event.key === "Enter"){
          handleRegister()
        }
      }

    const handleRegister = () => {
        API.register({
            username: newUsername,
            password: newPassword
        })
        .then((res) => {
            toast.success("Dentista registrado exitosamente");

            const token = res.data.accessToken;
            localStorage.setItem('token', token);
            
            
            navigate("/home")


        })
        .catch((res) => {
            toast.error(res.data)
        })
    }

    return (
        <main >
            <div className="register-box">
                <div><span className='header'>Registrarse</span></div>
                {/* <div>
                    <span>Nombre y apellido</span>
                    <input required="" type="text" className="input"/>
                </div> */}
                <div>
                    <span>Username</span>
                    <input required="" type="text" className="input" value={newUsername} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div> 
                    <span>Contraseña</span>
                    {seePassword1 ? showIcon(() => setSeePassword1(!seePassword1)) : hideIcon(() => setSeePassword1(!seePassword1)) }
                    <input
                        type ={seePassword1? "text": "password"}
                        className="input-password"
                        value={newPassword}
                        onChange={(e) => handleChangePassword(e)}
                    />
                    {strength > 0 ? (
                        <progress
                        hidden={newPassword.length === 0}
                        className={`password strength-${strength}`}
                        value={strength}
                        max="4"
                        />
                    ) : null}
                    <div className={`feedback strength-${strength}`} hidden={newPassword.length === 0}>
                        {feedback}
                    </div>
                </div>

                <div style={{marginTop: "5px"}}>
                    <span>Confirmar Contraseña</span>
                    {seePassword2 ? showIcon(() => setSeePassword2(!seePassword2)) : hideIcon(() => setSeePassword2(!seePassword2)) }
                    <input
                     required="" 
                     type={seePassword2? "text": "password"}
                     className="input"
                    value={confirmPasword}
                    onChange={(e) => checkPassword(e)}
                    onKeyDown={handleEnter}
                    />
                    {!samePassword ? <span style={{color:"red", fontSize:"13px",}}>*Contraseñas no coinciden</span> : <></> }
                </div>
                <div className='register-button'>
                    <button className="button-66" 
                    role="button" 
                    onClick={() => handleRegister()}
                    onKeyDown={handleEnter}
                    > Register</button>
                    
                </div>
            </div>
            
        </main>
    )
    
}

export default Register