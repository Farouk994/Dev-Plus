/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount, getCurrentProfiles } from "../../actions/profile";
import { DashboardActions } from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";
// import Spinner from "../layout/Spinner";

const Dashboard = ({
  getCurrentProfiles,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfiles();
  }, [getCurrentProfiles]);
  return (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience}></Experience>
          <Education education={profile.education}></Education>
          <div>
            <button onClick={(()=> deleteAccount())}className='btn btn-danger'>{' '}
              <i className="fas fa-user-minus"/>{' '}
              Delete Account
              </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <h1>You have not yet setup a profile yet, please add some info</h1>
          <br></br>
          <Link to='/create-profile' className='btn btn-primary my-q'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfiles: PropTypes.func.isRequired,
  deleteAccount:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfiles,deleteAccount })(Dashboard);
