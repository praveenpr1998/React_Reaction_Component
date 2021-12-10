import React, { useState, useEffect, useMemo } from "react";
import "./AllReactions.scss";
import { Tabs } from "antd";
import ALL_CONSTANTS from "../../Saga/Constants/Constants";
import _ from "lodash";
const { TabPane } = Tabs;

function AllReactions(props) {
  const [activeTab, setActiveTab] = useState("all");
  const { reactions, hoveredID, reactionsMapbyId, users } = props;
  const usersMappedByID = users.isSuccess
    ? _.groupBy(users.payload.data, "id")
    : {};

  useEffect(() => {
    setActiveTab(hoveredID);
  }, []);

  const onTabClick = (item) => {
    setActiveTab(item);
  };

  const totalReactions = useMemo(() => {
    return _.flatten(_.map(Object.values(reactions), "values"));
  });

  return (
    <div className="AllReactions">
      {Object.keys(reactions).length && Object.keys(usersMappedByID).length ? (
        <Tabs
          defaultActiveKey="all"
          activeKey={activeTab}
          className="all-reactions-tabs"
          onTabClick={onTabClick}
        >
          <TabPane
            tab={
              <span>
                All {"" + ALL_CONSTANTS.DOT_SYMBOL + totalReactions.length}
              </span>
            }
            key="all"
            className="reactions-list"
          >
            <div className="user-details">
              {totalReactions.map((item, i) => {
                const {
                  first_name = "",
                  last_name = "",
                  avatar,
                } = Array.isArray(usersMappedByID[item.user_id]) &&
                usersMappedByID[item.user_id].length
                  ? usersMappedByID[item.user_id][0]
                  : {};
                return (
                  <div key={i} className="user">
                    <img src={avatar} alt={first_name} />
                    <span>
                      {(reactionsMapbyId[item.reaction_id]
                        ? reactionsMapbyId[item.reaction_id][0].emoji
                        : "") +
                        " " +
                        first_name +
                        " " +
                        last_name}
                    </span>
                  </div>
                );
              })}
            </div>
          </TabPane>
          {Object.keys(reactions).map((id) => (
            <TabPane
              tab={
                <span>
                  {reactionsMapbyId[id]
                    ? reactionsMapbyId[id][0].emoji +
                      ALL_CONSTANTS.DOT_SYMBOL +
                      reactions[id].values.length
                    : ""}
                </span>
              }
              key={id}
              className="reactions-list"
            >
              <div className="user-details">
                {reactions[id].values.map((item, i) => {
                  const { first_name, last_name, avatar } =
                    Array.isArray(usersMappedByID[item.user_id]) &&
                    usersMappedByID[item.user_id].length
                      ? usersMappedByID[item.user_id][0]
                      : {};
                  return (
                    <div key={i} className="user">
                      <img src={avatar} alt={first_name} />
                      <span>
                        {reactionsMapbyId[id][0].emoji +
                          " " +
                          first_name +
                          " " +
                          last_name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </TabPane>
          ))}
        </Tabs>
      ) : (
        <div>No Reactions</div>
      )}
    </div>
  );
}

export default AllReactions;
