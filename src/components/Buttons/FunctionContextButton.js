import React from "react";

class FuncContextButton extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      assigned_func: props.assignedFunction,
    };
  }

  coroutine_step = () => {
    console.log('COROUTINE')

    let generator_obj, return_val;
    if(this.props.assignedFunction != this.props.functionContext.active_func_ref)
    {
      if(this.props.functionContext.active_func_ref == null)
      {
        generator_obj = this.props.assignedFunction(this.props.coroutineStepArg);
        return_val = generator_obj.next();
      }
      else
        return;
    }
    else // props.assignedFunction == currently active function
    {
      generator_obj = this.props.functionContext.context.generator_obj;
      return_val = generator_obj.next();
    }

    // TODO put in case for if you press button while another function is the active function context
    // give user visible feedback for this

    // TODO put in case where return value is done

    // else  

    let func_context = {
      active_func_ref: this.props.assignedFunction,
      context: {
        generator_obj: generator_obj,
        last_return_val: return_val
      }
    };

    // updateContainerCallback handles the case where func_context.context.last_returl_val.done == true
    this.props.updateContainerCallback(func_context);
  };

  render()
  {
    return (
      <button className="func-context-button" onClick={this.coroutine_step}>
        <div>{this.props.children}</div>
      </button>
    );
  }
}

export default FuncContextButton;
