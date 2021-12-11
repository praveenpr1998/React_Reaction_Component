import React from "react";
import "./ReactionPopOverIcon.scss";
import { connect } from "react-redux";
import { Popover } from "antd";
import images from "../../resources/images/index";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import ReactionPopup from "../ReactionPopup/ReactionPopup";
import _ from 'lodash';

function ReactionPopOverIcon(props) {

    const {reactions} = props.users;
    const {onReactionClick} = props;

  return (
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
         onReactionClick(reaction_id)
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
   <img src={images.AddReaction} alt="prof" />
 </div>
</Popover>
  )
}

const mapStateToProps = (state) => {
    return {
        users: state.Users,
    };
  };

  const checkforPropsChange=(prevProps,nextProps) => {
    return _.isEqual(prevProps.users.reactions,nextProps.users.reactions);
  };

export default connect(mapStateToProps)(React.memo(ReactionPopOverIcon,checkforPropsChange));