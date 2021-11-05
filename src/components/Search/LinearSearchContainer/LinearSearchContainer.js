import React from 'react';
import ArrayView from '../../ArrayView/ArrayView';
import {swap, array_of_indexes, randomize_array, get_arr_index_of_val} from '../../../util';

function* LinearSearch(arr, search_val)
{
  let found_flag = false;
  let found_ind = -1;
  let index_of_search_val = get_arr_index_of_val(arr, search_val);
  for(let i=0; i<arr.length; i++)
  {
    yield {array: arr, completed: new Set([index_of_search_val]), red_set: new Set([i])};
    if(arr[i] === search_val)
    {
      found_flag = true;
      found_ind = i;
      break;
    }
  }
  yield {array: arr, completed: new Set([index_of_search_val]), red_set: new Set([found_ind])};
}

class LinearSearchContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    randomize_array(arr);
    this.state = { nums: arr , search_val: 7};
    this.state.coroutine = LinearSearch(this.state.nums, this.state.search_val);
    // TODO update this so it doesn't cause errors if .next() returns done === true
    this.state.func_context = this.state.coroutine.next().value;
  }
  sort_step = () => {
    let temp = this.state.coroutine.next();
    if (!temp.done) this.setState( {func_context: temp.value} );
    //else
      // TODO what to do if sort is finished
  };
  render()
  {
    return (
      <div className="algo-container">
        <div className="array-view-container">
          <ArrayView sortContext={this.state.func_context} />
        </div>
        <button onClick={this.sort_step} className="sort-button"> SORT </button>
      </div>
    );
  }
}

export default LinearSearchContainer;
