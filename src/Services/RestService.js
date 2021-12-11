import axios from "axios";
import ALL_CONSTANTS from "../Saga/Constants/Constants";

const BASE_URL = ALL_CONSTANTS.BASE_URL;

export const getUsers = () => {
  return axios.get(BASE_URL + "/users");
};

export const getReactions = () => {
  return axios.get(BASE_URL + "/reactions");
};


// Since contents endpoint is not giving a valid response
// used a staic response for contents
export const getContents = () => {
  return ALL_CONSTANTS.CONTENTS_DATA;
};

export const getContentById = (params) => {
  return axios.get(
    BASE_URL + `/user_content_reactions?content_id=${params.id}`
  );
};

export const updateReaction = (params) => {
  return axios.post(BASE_URL + `/user_content_reactions`, params);
};

export const deleteReaction = (params) => {
  return axios.delete(BASE_URL + `/user_content_reactions/${params.id}`);
};
