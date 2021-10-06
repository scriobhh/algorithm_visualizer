import React from "react";

// TODO do styling for this
//function TextInputButton(props)
class TextInputButton extends React.Component
{
  stopPropagation = (event) => {
    event.stopPropagation();
  };
  render()
  {
    let text_area_component;
    if(this.props.enabled)
    {
      text_area_component = <textarea onClick={this.stopPropagation} rows="1" cols="3" maxlength="3" value={this.props.value} onChange={this.props.onChange} />
    }
    else
    {
      text_area_component = <textarea onClick={this.stopPropagation} rows="1" cols="3" maxlength="3" value={this.props.value} onChange={this.props.onChange} readOnly />
    }
    return (
      <button className="text-input-button" onClick={this.props.onClick}>
        <div>{this.props.children}</div>
        {text_area_component}
      </button>
    );
  }
}

export default TextInputButton;

// TODO
// make it so that clicking the text area does no trigger the button
// https://javascript.info/introduction-browser-events
// https://javascript.info/bubbling-and-capturing