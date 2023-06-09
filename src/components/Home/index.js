import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-bottom-container">
      <ul>
        <li>
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        </li>
        <li>
          <p className="home-description">
            Millions of people are searching for jobs, salary, information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
        </li>
        <Link to="/jobs">
          <li>
            <button type="button" className="find-jobs-button">
              Find Jobs
            </button>
          </li>
        </Link>
      </ul>
    </div>
  </>
)

export default Home
