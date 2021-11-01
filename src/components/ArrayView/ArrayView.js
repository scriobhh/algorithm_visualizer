import './ArrayView.css';
import React from 'react';

// TODO add legend or icons over important elements e.g. 'pivot' 'i' 'j' etc.
// TODO put numbers under or at bottom of gray blocks
// TODO change grey blocks height based on the number

/*
sortContext:
{
  array
  curr_ind
  prev_ind
  swap_indexes  // set
  just_swapped_indexes  // set
  pivot
  current_sub_arr // set
  completed // set
}
*/

class ArrayElement extends React.Component
{
  render()
  {
    // NOTE putting {height: 10} automatically turns the 10 into a '10px'
    // TODO the element height calculation is hard-coded to only work if there is 10 elements, fix this
    return (
      <div className='element-container'>
        <div className={'array-element' + this.props.class_str} style={ {height: (this.props.height*10).toString()+'%'} }>
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
          let class_str=''; //'array-element';
          if(index === this.props.sortContext.left_swap_ind || index === this.props.sortContext.right_swap_ind)
          {
            class_str += ' swap-ind';
          }
          if(index === this.props.sortContext.right_just_swapped_ind || index === this.props.sortContext.left_just_swapped_ind)
          {
            class_str += ' just-swapped-ind';
          }
          if(this.props.sortContext.completed.has(index))
          {
            class_str += ' completed';
          }
          return <ArrayElement key={index} class_str={class_str} height={num}>{num}</ArrayElement>
        })}
      </div>
    );
  }
}

export default ArrayView;
