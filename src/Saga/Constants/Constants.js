const ALL_CONSTANTS = {
  // -------------------------------- Redux Constants
  GET_USERS_FAILED: "Error Fetching users",
  GET_USERS: "GET_USERS",
  GET_USERS_SAGA: "GET_USERS_SAGA",

  GET_REACTIONS_SAGA: "GET_REACTIONS_SAGA",
  GET_REACTIONS: "GET_REACTIONS",
  GET_REACTIONS_FAILED: "Something went wrong..",

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
  BASE_URL: "https://artful-iudex.herokuapp.com",
  CONTENTS_DATA: {
    data: [
      {
        content_id: 1,
        userName: "Horward Stark",
        time: "",
        contentImageURL:
          "https://cdn.pixabay.com/photo/2021/07/20/14/59/iron-man-6480952__480.jpg",
        profilePic:
          "https://cdn.pixabay.com/photo/2021/07/20/14/59/iron-man-6480952__480.jpg",
        reactions: {},
      },
      {
        content_id: 2,
        userName: "Thanos",
        time: "",
        contentText: "I am Inevitable",
        profilePic:
          "https://img.theweek.in/content/dam/week/news/entertainment/images/2019/4/26/thanos-avengers-infinity.jpg",
        reactions: {},
      },
    ],
  },
};
export default ALL_CONSTANTS;
