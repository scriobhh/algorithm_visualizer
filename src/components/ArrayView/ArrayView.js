import './ArrayView.css';
import React from 'react';

class ArrayElement extends React.Component
{
  render()
  {
    // NOTE putting {height: 10} automatically turns the 10 into a '10px'
    // TODO the element height calculation is hard-coded to only work if there is 10 elements, fix this
    return (
      <div className='element-container'>
        <div className={'array-element ' + this.props.class_str} style={ {height: (this.props.height*10).toString()+'%'} }>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

// TODO update ArrayView to use sets of indices instead of individual indices
class ArrayView extends React.Component
{
  render()
  {
    return (
      <div className="array-view">
        {this.props.sortContext.array.map((num, index) => {
          const context = this.props.sortContext;
          let class_str = 'default-list-node';
          if(context.red_set && context.red_set.has(index))
            class_str = 'red-list-node';
          if(context.blue_set && context.blue_set.has(index))
            class_str = 'blue-list-node';
          if(context.green_set && context.green_set.has(index))
            class_str = 'green-list-node';
          if(context.black_set && context.black_set.has(index))
            class_str = 'black-list-node';
          if(context.purple_set && context.purple_set.has(index))
            class_str = 'purple-list-node';
          if(context.completed && context.completed.has(index))
            class_str = 'lightblue-list-node';
          
          return <ArrayElement key={index} class_str={class_str} height={num}>{num}</ArrayElement>
        })}
      </div>
    );
  }
}

export default ArrayView;
