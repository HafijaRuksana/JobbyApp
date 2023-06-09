import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FilterGroup from '../FilterGroup'
import ProfileDetails from '../ProfileDetails'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsList extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    jobsListData: [],
    employmentType: [],
    salaryRange: 0,
  }

  componentDidMount() {
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {salaryRange, employmentType, searchInput} = this.state
    console.log(searchInput)
    const jobsDataUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsDataUrl, options)
    if (response.ok === true) {
      const jobsData = await response.json()
      const updatedJobsData = jobsData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        packagePerAnnum: eachJob.package_per_annum,
        title: eachJob.title,
        id: eachJob.id,
        rating: eachJob.rating,
        location: eachJob.location,
      }))
      this.setState({
        jobsListData: updatedJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  searchText = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickEnter = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  changeSalaryRange = salary => {
    this.setState({salaryRange: salary}, this.getJobsData)
  }

  changeEmploymentType = type => {
    this.setState(
      prev => ({employmentType: [...prev.employmentType, type]}),
      this.getJobsData,
    )
  }

  renderJobDetails = () => {
    const {jobsListData, searchInput} = this.state
    const jobsDisplay = jobsListData.length > 0

    return jobsDisplay ? (
      <div className="details-container">
        <div className="search-input">
          <input
            type="search"
            className="search"
            placeholder="Search"
            value={searchInput}
            onChange={this.searchText}
            onKeyDown={this.onClickEnter}
          />
          <button
            type="button"
            data-testid="searchButton"
            className="search-button"
            onClick={this.getJobsData}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <ul className="job-details-item-container">
          {jobsListData.map(eachData => (
            <JobCard key={eachData.id} jobDetails={eachData} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-container">
        <div className="search-input-content">
          <input
            type="search"
            className="search"
            placeholder="Search"
            value={searchInput}
            onChange={this.searchText}
            onKeyDown={this.onEnterKey}
          />
          <button
            type="button"
            data-testid="searchButton"
            className="search-button"
            onClick={this.getJobDetails}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-desc">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        we cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        data-testid="button"
        className="jobs-failure-button"
        onClick={this.getJobsData}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobProfileDetailsList = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="filter-and-jobs-list-container">
          <div className="profile-and-filters-group">
            <ProfileDetails />
            <FilterGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              searchInput={searchInput}
              changeEmploymentType={this.changeEmploymentType}
              changeSalaryRange={this.changeSalaryRange}
              getJobsData={this.getJobsData}
            />
          </div>

          {this.renderJobProfileDetailsList()}
        </div>
      </>
    )
  }
}

export default JobsList
