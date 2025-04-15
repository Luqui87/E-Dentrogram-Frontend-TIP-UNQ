import './Navbar.css';
import logo from '../../assets/Logo.png';
import { useNavigate } from 'react-router-dom';

function Navbar() {

  const navigate = useNavigate();

  return (

    <header>
      <div onClick={() => navigate('/') }>
        <img src={logo} alt="Logo de aplicación" /> 
        <a>E-Dentogram</a>
      </div>
        
    </header>
  )
}

export default Navbar