import React from "react";
import "./ReactionPopup.scss";
import { Tooltip } from "antd";

function ReactionPopup(props) {
  return (
    <div className="reaction-content">
      {props.reactions &&
        props.reactions.map((reaction) => (
          <Tooltip placement="top" title={reaction.name} key={reaction.id}>
            <div onClick={() => props.onReactionClick(reaction.id)} className="p1">
              {reaction.emoji}
            </div>
          </Tooltip>
        ))}
    </div>
  );
}

// Since this component is not going to recieve any other props
// except all reactions we can memoize the component 
// all reactions will be fetched initially will not be changed

export default React.memo(ReactionPopup);
