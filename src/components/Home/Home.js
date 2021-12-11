import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import ALL_CONSTANTS from "../../Saga/Constants/Constants";
import "./Home.scss";
import { Spin, Popover, Empty, message } from "antd";
import moment from "moment";
import images from "../../resources/images/index";
import ReactionPopOverIcon from "../ReactionPopOverIcon/ReactionPopOverIcon";
import AllReactions from "../AllReactions/AllReactions";
import _ from "lodash";
import Header from "../Header/Header";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

function Home(props) {
  const { users, content, reactions } = props.users;
  const {
    getReactions,
    getUsers,
    getContents,
    getContentById,
    deleteReaction,
    updateReaction,
  } = props;
  const reactionsMapbyId = reactions.isSuccess
    ? _.groupBy(reactions.payload.data, "id")
    : {};
  const thresholdCount = 3;

  // useCallback to memoize the function to avoid infinite rerendering
  // since it is used in dependencies

  //fethContentsPartially --> slice the data with given startIndex and endIndex
  // after slicing check if there are data present to make a call
  // if present call the function again with startIndex as endIndex and endIndex as endIndex + thresholdCount( will be the endIndex)
  const fethContentsPartially = useCallback(
    (data, startIndex, endIndex) => {
      var slicedData = data.slice(startIndex, endIndex);
      if (slicedData.length) {
        _.map(slicedData, (content) => {
          getContentById({ id: content.content_id });
        });
        fethContentsPartially(data, endIndex, endIndex + thresholdCount);
      }
    },
    [getContentById]
  );

  // fetchContents --> to fethc contents details partially
  const fetchContents = useCallback(
    (response) => {
      if (response.data && response.data.length) {
        fethContentsPartially(response.data, 0, 0 + thresholdCount);
      }
    },
    [fethContentsPartially]
  );

  // getContentsCallback -- > after executing getReactions calling getContents
  // help us to add the reactions for specific contents
  const getContentsCallback = useCallback(
    () => getContents(fetchContents),
    [getContents, fetchContents]
  );

  useEffect(() => {
    getReactions(getContentsCallback);
    getUsers();
  }, [getReactions, getUsers, getContentsCallback]);

  const onReactionClick = useCallback(
    (args) => {
      // If the clicked contents reactions values has the active userid
      //(Since a user can add a particular reaction in a content for only once)
      // --> it is an already added reaction --> call deleteReaction
      //  if not found call updateReaction
      if (users.activeUserID) {
        const { content, content_id, reaction_id } = args;
        var reqObj = { content_id, reaction_id, user_id: users.activeUserID };
        if (content.reactions[reaction_id]) {
          const reactionData = _.find(content.reactions[reaction_id].values, {
            user_id: users.activeUserID,
          });
          if (reactionData) {
            deleteReaction(reactionData);
            return;
          }
        }
        updateReaction(reqObj);
      } else {
        message.error(ALL_CONSTANTS.UPDATE_REACTION_FAILED);
      }
    },
    [users, deleteReaction, updateReaction]
  );

  const onUserChange = (userID) => {
    props.onUserChange(userID);
  };

  return (
    <div className="Home">
      {/* Contains Header Title and Active Users Selection Component */}
      <ErrorBoundary>
        <Header users={users} onUserChange={onUserChange} />
      </ErrorBoundary>

      {content.isPending || reactions.isPending ? (
        <Spin tip="Loading Contents..." />
      ) : (
        <div className="content-div">
          {content.isSuccess &&
          content.payload.data &&
          content.payload.data.length ? (
            content.payload.data.map((content, i) => {
              return (
                <div className="main-content p5 m5" key={i}>
                  <div className="profile-picture">
                    <img src={content.profilePic} alt="prof-pic" />
                  </div>
                  <div className="profile-name">
                    <span className="name">{content.userName}</span>
                    <span className="time">{moment().format("hh:mm A")}</span>
                  </div>
                  <div className="content">
                    {content.contentText && <span>{content.contentText}</span>}
                    {content.contentImageURL && (
                      <img src={content.contentImageURL} alt="prof" />
                    )}
                    <ErrorBoundary>
                      <div className="footer mt5">
                        {content.isFetchingReactionsData ? (
                          <Spin className="spinner" />
                        ) : reactions.isSuccess ? (
                          <>
                            <div className="reactions-div">
                              <div className="reactions">
                                {content.reactions &&
                                Object.keys(content.reactions).length ? (
                                  <>
                                    {Object.keys(content.reactions).map(
                                      (id, i) => {
                                        if (
                                          content.reactions[id].values.length
                                        ) {
                                          // check for content's reactions values has the active userid
                                          // If yes --> add class 'Checked' to show the appropiate UI for selected reaction
                                          const isChanged = _.findIndex(
                                            content.reactions[id].values,
                                            { user_id: users.activeUserID }
                                          );
                                          return (
                                            <Popover
                                              content={
                                                <ErrorBoundary>
                                                  <AllReactions
                                                    reactions={
                                                      content.reactions
                                                    }
                                                    hoveredID={id}
                                                    reactionsMapbyId={
                                                      reactionsMapbyId
                                                    }
                                                    users={users}
                                                  />
                                                </ErrorBoundary>
                                              }
                                              overlayInnerStyle={{
                                                width: "auto",
                                                maxHeight: 386,
                                              }}
                                              key={`popover_` + i}
                                              overlayClassName="reaction"
                                            >
                                              <div
                                                className={`reaction ${
                                                  isChanged > -1
                                                    ? "changed"
                                                    : ""
                                                }`}
                                                key={i}
                                                onClick={() =>
                                                  onReactionClick({
                                                    content_id:
                                                      content.content_id,
                                                    reaction_id:
                                                      reactionsMapbyId[id][0]
                                                        .id,
                                                    content,
                                                  })
                                                }
                                              >
                                                {"" +
                                                  reactionsMapbyId[id][0]
                                                    .emoji +
                                                  " " +
                                                  ALL_CONSTANTS.DOT_SYMBOL +
                                                  " " +
                                                  content.reactions[id].values
                                                    .length}
                                              </div>
                                            </Popover>
                                          );
                                        } else return null;
                                      }
                                    )}
                                  </>
                                ) : null}
                              </div>
                              <ReactionPopOverIcon
                                onReactionClick={(reaction_id) =>
                                  onReactionClick({
                                    content_id: content.content_id,
                                    reaction_id: reaction_id,
                                    content,
                                  })
                                }
                              />
                            </div>
                            <div className="context-menu">
                              <ReactionPopOverIcon
                                onReactionClick={(reaction_id) =>
                                  onReactionClick({
                                    content_id: content.content_id,
                                    reaction_id: reaction_id,
                                    content,
                                  })
                                }
                              />
                              <div>
                                <img src={images.Reply} alt="2" />
                              </div>
                              <div>
                                <img src={images.Menu} alt="3" />
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </ErrorBoundary>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty />
          )}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    users: state.Users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUsers: () => dispatch({ type: ALL_CONSTANTS.GET_USERS_SAGA }),
    getReactions: (callback) =>
      dispatch({ type: ALL_CONSTANTS.GET_REACTIONS_SAGA, callback }),
    getContents: (callback) =>
      dispatch({ type: ALL_CONSTANTS.GET_CONTENTS_SAGA, callback }),
    getContentById: (params) =>
      dispatch({ type: ALL_CONSTANTS.GET_CONTENT_BY_ID_SAGA, params }),
    updateReaction: (params) =>
      dispatch({ type: ALL_CONSTANTS.UPDATE_REACTION_SAGA, params }),
    deleteReaction: (params) =>
      dispatch({ type: ALL_CONSTANTS.DELETE_REACTION_SAGA, params }),
    onUserChange: (params) =>
      dispatch({ type: ALL_CONSTANTS.UPDATE_SELECTED_USER_SAGA, params }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
