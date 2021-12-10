const ALL_CONSTANTS = {
  // -------------------------------- Redux Constants
  GET_USERS_FAILED: "Error Fetching users",
  GET_USERS: "GET_USERS",
  GET_USERS_SAGA: "GET_USERS_SAGA",

  GET_REACTIONS_SAGA: "GET_REACTIONS_SAGA",
  GET_REACTIONS: "GET_REACTIONS",
  GET_REACTIONS_FAILED: "GET_REACTIONS_FAILED",

  GET_CONTENTS: "GET_CONTENTS",
  GET_CONTENTS_SAGA: "GET_CONTENTS_SAGA",
  GET_CONTENTS_FAILED: "Error Fetching contents",

  GET_CONTENT_BY_ID_SAGA: "GET_CONTENT_BY_ID_SAGA",
  GET_CONTENT_BY_ID: "GET_CONTENT_BY_ID",
  GET_CONTENT_BY_ID_FAILED: "Something went wrong...",

  UPDATE_REACTION_SAGA: "UPDATE_REACTION_SAGA",
  UPDATE_REACTION: "UPDATE_REACTION",
  UPDATE_REACTION_FAILED: "Failed to update reaction",

  DELETE_REACTION_SAGA: "DELETE_REACTION_SAGA",
  DELETE_REACTION: "DELETE_REACTION",
  DELETE_REACTION_FAILED: "Unable to remove the reaction",

  UPDATE_SELECTED_USER_SAGA: "UPDATE_SELECTED_USER_SAGA",
  UPDATE_SELECTED_USER: "UPDATE_SELECTED_USER",
  UPDATE_SELECTED_USER_FAILED: "Error while changing user",

  // -------------------------------- Other Constants
  commonInitialState: {
    isPending: false,
    isFailed: false,
    isSuccess: false,
    payload: {},
  },

  DOT_SYMBOL: "•",
};
export default ALL_CONSTANTS;
