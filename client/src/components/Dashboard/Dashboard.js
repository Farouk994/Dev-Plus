/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfiles } from "../../actions/profile";
import   { DashboardActions }  from "./DashboardActions";
// import Spinner from "../layout/Spinner";

const Dashboard = ({
  getCurrentProfiles,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfiles();
  }, []);
  return (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment><DashboardActions/></Fragment>
      ) : (
        <Fragment>
          <h1>You have not yet setup a profile yet, please add some info</h1><br></br>
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
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfiles })(Dashboard);
