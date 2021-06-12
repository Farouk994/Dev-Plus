/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfiles } from "../../actions/profile";

const Dashboard = ({ getCurrentProfiles, auth, profile }) => {
  useEffect(() => {
    getCurrentProfiles();
  }, []);
  return <div>Dashboard</div>;
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
