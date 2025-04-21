import { useState } from 'react'
import './Login.css'
import API from '../../service/API';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login(){

    const [insUsername, setInsUsername] = useState("");
    const [insPassword, setInsPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    const showIcon = (handleState) => {
        return(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 seePassword" onClick={() => setShowPassword(!showPassword)}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>

        )
    }

    const hideIcon = (handleState) => {
        return(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 seePassword" onClick={() => setShowPassword(!showPassword)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>

        )
    }

    const handleLogin = () =>{
        API.login({
            "username": insUsername,
            "password": insPassword
        })
        .then((res) =>{
            toast.success("Dentista ingresado exitosamente");
            
            const token = res.data.accessToken;
            localStorage.setItem('token', token);
            
            navigate("/")

        })
        .catch((res) => {
            toast.error(res.data)
        })
    }


    return(
        <main style={{justifyContent: "center"}}>
            <div className="register-box">

                <div><span className='header'>Login</span></div>

                <div>
                    <span>Username</span>
                    <input required="" type="text" className="input" value={insUsername} onChange={(e) => setInsUsername(e.target.value)}/>
                </div>

                <div style={{marginTop: "5px"}}>
                    <span>Contraseña</span>
                    {showPassword ? showIcon() : hideIcon() }
                    <input
                     required="" 
                     type={showPassword? "text": "password"}
                     className="input"
                    value={insPassword}
                    onChange={(e) => setInsPassword(e.target.value)}/>
                    
                </div>

                <div className='register-button'>
                    <button className="button-66" role="button" onClick={() => handleLogin()}>Ingresar</button>
                    
                </div>

                <span>No tenes una cuenta? <a href="/register">Registrate</a> </span>

            </div>
        </main>
    )
}

export default Login