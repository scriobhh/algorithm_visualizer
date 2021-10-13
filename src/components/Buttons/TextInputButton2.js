import React from "react";
import FuncContextButton from "./FunctionContextButton";

// TODO redo how the text input and button work for this
// put button and text input as separate things, not on top of one another
// also text input currently won't accept you pressing backspace (because of the update_value() control flow code)

// TODO transition all the other code ot use TextInputButton2
// (remember to use)

// TODO make the calling code pass in an input validation function
// this will be used by co_routine step to check if the button input is valid
// this is preferrable to writing multiple code paths for each input type inside this component
// also each data structure will have different allowances for what input is valid or not
// TODO can also rethink the design of the button UI/html to make it less janky
// (e.g. put the button and text input in separate things, not on top of each other)
// TODO since all text inputs are strings, either:
//    A: pass an extra function to convert the text input into whatever type you want
//    B: pass only a single function for input validation, but put the code for converting the value inside of the validator function (it can return an obkect like {is_valid: true, processed_input: 123})

// FUNCTION SIGNATURE OF TRANSLATION FUNCTION:
//    any translator(button_val_string)

// FUNCTION SIGNATURE OF VALIDATION FUNCTION:
//    bool validator(button_val)

// FUNCTION SIGNATURE OF CALLBACK FUNCTION TO UPDATE FUNCTION_CONTEXT IN CONTAINER:
//    void callback(val)
//    use currying/wrapper function to narrow down the function to just 1 argument

// TODO error condition if there is no props.initialValie

class TextInputButton2 extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      translated_button_value: props.initialValue,  // TODO re-use the update_value code
      assigned_func: props.assignedFunction
    };
  }

  update_value = (event) => {
    if(this.props.functionContext.active_func_ref == this.state.assigned_func)
    {
      event.preventDefault();
      return;
    }
    // TODO put in case 
    let raw_val = event.target.value;
    let translated_val = this.props.inputTranslationFunc(raw_val);
    this.setState( {translated_button_value: translated_val} );
  };

  render()
  {
    let is_disabled = !this.props.inputValidatorFunc(this.state.translated_button_value);

    let func_context_button = (
      <FuncContextButton
        coroutineStepArg={this.state.translated_button_value}
        updateContainerCallback={this.props.updateContainerCallback}
        assignedFunction={this.props.assignedFunction}
        functionContext={this.props.functionContext}
        isDisabled={is_disabled}>
        { this.props.children }
      </FuncContextButton>);

    let text_area_component = <textarea rows="1" cols="3" maxlength="3" value={this.state.translated_button_value} onChange={this.update_value} />
    return (
      <div className="text-input-button-container">
        { func_context_button }
        { text_area_component }
      </div>
    );
  }
}

export default TextInputButton2;

// TODO
// make it so that clicking the text area does no trigger the button
// https://javascript.info/introduction-browser-events
// https://javascript.info/bubbling-and-capturing