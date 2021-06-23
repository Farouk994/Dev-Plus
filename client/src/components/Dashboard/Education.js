import React from 'react'
import PropTypes from 'prop-types';
import Moment from "react-moment"
import { connect } from "react-redux";
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation}) => {
    const educations = education.map(edu =>(
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td>
              <Moment format = "YYYY/MM/DD"></Moment> - {' '}{
                  edu.from === null ? (
                      "Now"
                      ) : (<Moment format ="YYYY/MM/DD">{edu.to}</Moment>)
              }
            </td>
            <td>
                <button onClick={(()=> deleteEducation(edu._id))}className="btn btn-danger">Delete</button>
            </td>
        </tr>
    ))
    return (
        <div>
            <h2 className="my-2">Education Credentials</h2>
            <table className="table">
            <thead>
                <tr>
                    <th className="my-2">School</th>
                    <th className="hide-sm">Degree</th>
                    <th className="hide-sm">Years</th>
                </tr>
            </thead>
            <tbody>{educations}</tbody>
            </table>
        </div>
    )
}

Education.propTypes = {
    education : PropTypes.array.isRequired,
    deleteEducation : PropTypes.func.isRequired,
}

export default connect(null, { deleteEducation})(Education)
