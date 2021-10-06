import {swap, array_of_indexes, randomize_array} from '../../../util';
import ArrayView from '../../ArrayView/ArrayView';
import React from 'react';
import FuncContextButton from '../../Buttons/FunctionContextButton';

function* BubbleSort(arr)
{
  let completed_set = new Set();
  for(let last_sorted_el=arr.length-1; last_sorted_el>=0; last_sorted_el--)
  {
    let no_swaps = true;
    for(let j=0; j+1<=last_sorted_el; j++)
    {
      let left = j;
      let right = j+1;
      completed_set.add(last_sorted_el+1);
      yield {
        array: arr.slice(),
        left_swap_ind: left,
        right_swap_ind: right,
        completed: completed_set,
      };
      if(arr[left] > arr[right])
      {
        swap(arr, left, right);
        no_swaps = false;
        yield {
          array: arr.slice(),
          right_just_swapped_ind: left,
          left_just_swapped_ind: right,
          completed: completed_set,
        };
      }
    }
    if(no_swaps)
    {
      // TODO this line is trash, set neeods to be filled with indexes, not array contents
      completed_set = new Set(array_of_indexes(0, arr.length));
      break;
    }
  }
  yield {
    array: arr.slice(),
    completed: completed_set,
  };
}

class BubbleSortContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    randomize_array(arr);
    this.state = { nums: arr };
    this.state.sort_coroutine = BubbleSort(this.state.nums);
    // TODO update this so it doesn't cause errors if .next() returns done === true
    this.state.sort_context = this.state.sort_coroutine.next().value;
  }
  sort_step = () => {
    let temp = this.state.sort_coroutine.next();
    if (!temp.done) this.setState( {sort_context: temp.value} );
    //else
      // TODO what to do if sort is finished
  };
  render()
  {
    return (
      <div className="sort-container">
        <div className="array-view-container">
          <div className="cont">
            <div className="thingy">
              <ArrayView sortContext={this.state.sort_context} />
            </div>
          </div>
        </div>
        <button onClick={this.sort_step} className="sort-button"> SORT </button>
      </div>
    );
  }
}

export default BubbleSortContainer;
