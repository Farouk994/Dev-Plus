import { v4 as uuidv4 } from "uuid";
// This is whats been called
import { SET_ALERT, REMOVE_ALERT } from "./types";

// sent the message with the aler type
export const setAlert =
  (msg, alertType, timeout = 5000) =>
  (dispatch) => {
    // Generate an ID
    const id = uuidv4();
    dispatch({
      // And then dispatch setAlert with message alert type and id
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);

    //   setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };
