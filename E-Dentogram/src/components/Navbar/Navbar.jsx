import './Navbar.css'
import logo from '../../assets/Logo.png'

function Navbar() {

  return (
    <header>
        <img src={logo} alt="Logo de aplicación" />
        <a href="/">E-Dentogram</a>
    </header>
  )
}

export default Navbar