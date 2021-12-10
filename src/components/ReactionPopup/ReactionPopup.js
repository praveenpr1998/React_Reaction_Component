import React from "react";
import "./ReactionPopup.scss";
import { Tooltip } from "antd";

function ReactionPopup(props) {
  return (
    <div className="reaction-content">
      {props.reactions &&
        props.reactions.map((reaction) => (
          <Tooltip placement="top" title={reaction.name} key={reaction.id}>
            <div onClick={() => props.onReactionClick(reaction.id)}>
              {reaction.emoji}
            </div>
          </Tooltip>
        ))}
    </div>
  );
}

export default React.memo(ReactionPopup);
