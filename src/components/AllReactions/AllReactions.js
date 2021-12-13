import React, { useState, useEffect } from "react";
import "./AllReactions.scss";
import { Tabs } from "antd";
import ALL_CONSTANTS from "../../Saga/Constants/Constants";
import _ from "lodash";
const { TabPane } = Tabs;

function AllReactions(props) {

    // To change the selected tab internally --> defaults to 'all'
  const [activeTab, setActiveTab] = useState("all");
  const { reactions, hoveredID, reactionsMapbyId, users } = props;
  const usersMappedByID = users.isSuccess
    ? _.groupBy(users.payload.data, "id")
    : {};

  useEffect(() => {
    setActiveTab(hoveredID);
  }, [hoveredID]);

  const onTabClick = (item) => {
    setActiveTab(item);
  };

  // Get all the values from the reactions and flatten the array to get a single array of values
  // Shuffle to give a random view as flattening will order it
  const totalReactions = () => {
    return Object.values(reactions).length
      ? _.shuffle(_.flatten(_.map(Object.values(reactions), "values")))
      : [];
  };

  return (
    <div className="AllReactions">
      {Object.keys(reactions).length && Object.keys(usersMappedByID).length ? (
        <>
          <span className="title-text">Reactions</span>
          <Tabs
            defaultActiveKey="all"
            activeKey={activeTab}
            className="all-reactions-tabs"
            onTabClick={onTabClick}
          >
            <TabPane
              tab={
                <span>
                  All {"" + ALL_CONSTANTS.DOT_SYMBOL + totalReactions().length}
                </span>
              }
              key="all"
              className="reactions-list"
            >
              <div className="user-details">
                {totalReactions().map((item, i) => {
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
              reactions[id].values.length && 
              <TabPane
                tab={
                  <span>
                    {reactionsMapbyId[id]
                      ? reactionsMapbyId[id][0].emoji +" "+
                        ALL_CONSTANTS.DOT_SYMBOL +" "+
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
        </>
      ) : (
        <div className="title-text">No Reactions</div>
      )}
    </div>
  );
}

export default AllReactions;
