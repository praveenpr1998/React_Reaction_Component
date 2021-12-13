import ALL_CONSTANTS from "../Constants/Constants";
import { message } from "antd";
import _ from "lodash";
const initialState = {
  users: { ...ALL_CONSTANTS.commonInitialState, activeUserID: "" },
  reactions: ALL_CONSTANTS.commonInitialState,
  content: ALL_CONSTANTS.commonInitialState,
  fetchById: ALL_CONSTANTS.commonInitialState,
  updateReaction: ALL_CONSTANTS.commonInitialState,
  deleteReaction: ALL_CONSTANTS.commonInitialState,
};

export function Users(state = initialState, action) {
  switch (action.type) {
    case ALL_CONSTANTS.GET_USERS: {
      if (action.isFailed) {
        message.error(ALL_CONSTANTS.GET_USERS_FAILED);
      } else if (
        action.isSuccess &&
        action.payload.data &&
        action.payload.data.length
      ) {
        // Setting the first user response as the default active user
        state.users = {
          ...state.users,
          activeUserID: action.payload.data[0].id,
        };
      }
      return { ...state, users: { ...state.users, ...action } };
    }
    case ALL_CONSTANTS.UPDATE_SELECTED_USER: {
      var userID = state.users.activeUserID;
      if (action.isFailed) {
        message.error(ALL_CONSTANTS.UPDATE_SELECTED_USER_FAILED);
      } else {
        userID = action.params;
      }
      return { ...state, users: { ...state.users, activeUserID: userID } };
    }
    case ALL_CONSTANTS.GET_REACTIONS: {
      if (action.isFailed) {
        message.error(ALL_CONSTANTS.GET_REACTIONS_FAILED);
      }
      return { ...state, reactions: { ...state.reactions, ...action } };
    }
    case ALL_CONSTANTS.GET_CONTENTS: {
      if (action.isFailed) {
        message.error(ALL_CONSTANTS.GET_CONTENTS_FAILED);
      }
      return { ...state, content: { ...state.content, ...action } };
    }
    case ALL_CONSTANTS.GET_CONTENT_BY_ID: {
      if (action.isFailed) {
        message.error(ALL_CONSTANTS.GET_CONTENT_BY_ID_FAILED);
      } else {
        const id = action.params && action.params.id;
        let contentIndex = -1;
        if (id) {
          contentIndex = _.findIndex(state.content.payload.data, {
            content_id: id,
          });

          // To set the loading for each contents reactions data fetching time
          if (contentIndex > -1) {
            state.content.payload.data[contentIndex].isFetchingReactionsData =
              action.isPending;
          }
        }

        if (action.isSuccess) {
          var data = action.payload.data;
          const reactionsMapbyId = _.groupBy(
            state.reactions.payload.data,
            "id"
          );

          // Set the corresponding content reactions data
          const contentReactionById = _.groupBy(data, "reaction_id");
          _.each(contentReactionById, (value, key) => {
            if (reactionsMapbyId[key])
              state.content.payload.data[contentIndex].reactions[
                reactionsMapbyId[key][0].id
              ] = {
                values: value,
              };
          });
        }
      }

      return { ...state, fetchById: { ...state.fetchById, ...action } };
    }
    case ALL_CONSTANTS.UPDATE_REACTION: {
      const { content_id, reaction_id, user_id } = action.params;
      let contentIndex = -1;
      if (content_id) {
        contentIndex = _.findIndex(state.content.payload.data, {
          content_id: content_id,
        });
      }
      if (action.isFailed) {
        if (
          contentIndex > -1 &&
          state.content.payload.data[contentIndex].reactions[reaction_id]
        ) {
          // Reverting the added reaction if the
          // update reaction call for a content failed
          // finding the exact using the content,reaction,user id
          // (since for a content a user can give a particular reaction only once)
          const reactionDataIndex = _.findIndex(
            state.content.payload.data[contentIndex].reactions[reaction_id]
              .values,
            { content_id, reaction_id, user_id }
          );
          if (reactionDataIndex > -1)
            state.content.payload.data[contentIndex].reactions[
              reaction_id
            ].values.splice(reactionDataIndex, 1);
        }
        message.error(ALL_CONSTANTS.UPDATE_REACTION_FAILED);
      }
      else if (action.isPending) {

          // if no values exist for that particualr reaction create an empty array
        if (!state.content.payload.data[contentIndex].reactions[reaction_id])
        state.content.payload.data[contentIndex].reactions[reaction_id] = {
          values: [],
        };
      state.content.payload.data[contentIndex].reactions[
        reaction_id
      ].values.push({ ...action.params });
      } 
      else if (action.isSuccess) {
        // adding the reaction data to content
        if (action.payload.data.id) {
          const reactionDataIndex = _.findIndex(
            state.content.payload.data[contentIndex].reactions[reaction_id]
              .values,
            action.params
          );
            if(reactionDataIndex > -1){
              state.content.payload.data[contentIndex].reactions[
                reaction_id
              ].values[reactionDataIndex].id = action.payload.data.id;
            }
        }
      }
      return {
        ...state,
        updateReaction: { ...state.updateReaction, ...action },
      };
    }
    case ALL_CONSTANTS.DELETE_REACTION: {
      const { content_id, reaction_id } = action.params;
      let contentIndex = -1;
      if (content_id) {
        contentIndex = _.findIndex(state.content.payload.data, {
          content_id: content_id,
        });
      }

      // when clicked it will be in pending state
      // remove the data from the content
      // if the api gets failed to delet the emoji
      // push the content data back to the corresponding content values
      if (action.isFailed) {
        state.content.payload.data[contentIndex].reactions[reaction_id]
            .values.push(action.params)
        message.error(ALL_CONSTANTS.DELETE_REACTION_FAILED);
      } else if (action.isPending) {
        const reactionDataIndex = _.findIndex(
          state.content.payload.data[contentIndex].reactions[reaction_id]
            .values,
          action.params
        );
        if (reactionDataIndex > -1)
          state.content.payload.data[contentIndex].reactions[
            reaction_id
          ].values.splice(reactionDataIndex, 1);
      }

      return {
        ...state,
        deleteReaction: { ...state.deleteReaction, ...action },
      };
    }
    default:
      return state;
  }
}
