import axios from "axios";

const BASE_URL = "https://artful-iudex.herokuapp.com";

export const getUsers = () => {
  return axios.get(BASE_URL + "/users");
};

export const getReactions = () => {
  return axios.get(BASE_URL + "/reactions");
};

export const getContents = () => {
  return {
    data: [
      {
        content_id: 1,
        userName: "Horward Stark",
        time: "",
        contentImageURL:
          "https://6lli539m39y3hpkelqsm3c2fg-wpengine.netdna-ssl.com/wp-content/uploads/2018/11/AI_face_shutterstock_Ryzhi-700x-675x380.jpg",
        profilePic:
          "https://m.media-amazon.com/images/M/MV5BMjMwMjM3ODc4OV5BMl5BanBnXkFtZTgwMDE1ODk1NDE@._V1_.jpg",
        reactions: {},
      },
      {
        content_id: 2,
        userName: "Tony Stark",
        time: "",
        contentText: "HI .. I am IronMan",
        profilePic:
          "http://sc01.alicdn.com/kf/HTB1jA_RXrj1gK0jSZFuq6ArHpXab.jpg",
        reactions: {},
      },
    ],
  };
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
