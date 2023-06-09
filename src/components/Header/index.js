import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const removeToken = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav>
      <ul className="nav-header">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="nav-logo"
            />
          </Link>
        </li>
        <li className="links-container">
          <Link to="/" className="links">
            <p>Home</p>
          </Link>
          <Link to="/jobs" className="links">
            <p>Jobs</p>
          </Link>
        </li>
        <li>
          <button type="button" onClick={removeToken} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
