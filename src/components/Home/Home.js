import React, { useEffect } from "react";
import { connect } from "react-redux";
import ALL_CONSTANTS from "../../Saga/Constants/Constants";
import "./Home.scss";
import { Spin, Popover, Empty } from "antd";
import moment from "moment";
import Fill from "../../resources/images/Fill.jpg";
import ReactionPopup from "../ReactionPopup/ReactionPopup";
import AllReactions from "../AllReactions/AllReactions";
import _ from "lodash";
import Header from "../Header/Header";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

function Home(props) {

  const { users, content, reactions } = props.users;
  const reactionsMapbyId = reactions.isSuccess
    ? _.groupBy(reactions.payload.data, "id")
    : {};

  const fetchContents = (response) => {
    if (response.data && response.data.length) {
      _.map(response.data, (content) => {
        props.getContentById({ id: content.content_id });
      });
    }
  };

  const onReactionClick = (args) => {
    const { content, content_id, reaction_id } = args;
    var reqObj = { content_id, reaction_id, user_id: users.activeUserID };
    const allReactionsData = Object.values(content.reactions).length
      ? _.flatten(_.map(Object.values(content.reactions), "values"))
      : [];
    if (allReactionsData.length) {
      const correspondingReactionData = _.find(allReactionsData, {
        ...reqObj,
        isChanged: true,
      });
      if (correspondingReactionData) {
        props.deleteReaction(correspondingReactionData);
        return;
      }
    }
    props.updateReaction(reqObj);
  };

  useEffect(() => {
    const getContents = () => props.getContents(fetchContents);
    props.getReactions(getContents);
    props.getUsers();
  }, []);

  const onUserChange = (userID) => {
    props.onUserChange(userID);
  };

  return (
    <div className="Home">
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
                        ) : (
                          <div className="reactions-div">
                            <div className="reactions">
                              {content.reactions &&
                              Object.keys(content.reactions).length ? (
                                <>
                                  {Object.keys(content.reactions).map(
                                    (id, i) => {
                                      const isChanged = _.findIndex(
                                        content.reactions[id].values,
                                        { isChanged: true }
                                      );
                                      return (
                                        <div
                                          className={`reaction ${
                                            isChanged > -1 ? "changed" : ""
                                          }`}
                                          key={i}
                                          onClick={() =>
                                            onReactionClick({
                                              content_id: content.content_id,
                                              reaction_id:
                                                reactionsMapbyId[id][0].id,
                                              content,
                                            })
                                          }
                                        >
                                          <Popover
                                            content={
                                              <ErrorBoundary>
                                                <AllReactions
                                                  reactions={content.reactions}
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
                                              height: 386,
                                            }}
                                          >
                                            {"" +
                                              reactionsMapbyId[id][0].emoji +
                                              ALL_CONSTANTS.DOT_SYMBOL +
                                              content.reactions[id].values
                                                .length}
                                          </Popover>
                                        </div>
                                      );
                                    }
                                  )}
                                </>
                              ) : null}
                            </div>
                            <Popover
                              content={
                                <ErrorBoundary>
                                  <ReactionPopup
                                    reactions={
                                      reactions.isSuccess
                                        ? reactions.payload.data
                                        : []
                                    }
                                    onReactionClick={(reaction_id) =>
                                      onReactionClick({
                                        content_id: content.content_id,
                                        reaction_id: reaction_id,
                                        content,
                                      })
                                    }
                                  />
                                </ErrorBoundary>
                              }
                              trigger="click"
                              overlayClassName={`reaction-popup`}
                              overlayInnerStyle={{
                                width: "auto",
                                height: "auto",
                                borderRadius: 24,
                                border: "1px solid #E0E0E0",
                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.03)",
                              }}
                            >
                              <div className="addReactionImg">
                                <img src={Fill} alt="prof" />
                              </div>
                            </Popover>
                          </div>
                        )}
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
