import React from 'react';
import ArrayView from '../../ArrayView/ArrayView';
import {swap, array_of_indexes, randomize_array} from '../../../util';

function* LinearSearch(arr, search_val)
{
  let found_flag = false;
  let found_ind = -1;
  for(let i=0; i<arr.length; i++)
  {
    yield {array: arr, completed: new Set(), left_swap_ind: i};
    if(arr[i] === search_val)
    {
      found_flag = true;
      found_ind = i;
      break;
    }
  }
  yield {array: arr, completed: new Set(), left_swap_ind: found_ind};
}

class LinearSearchContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    randomize_array(arr);
    this.state = { nums: arr };
    this.state.coroutine = LinearSearch(this.state.nums, 7);
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
      <div className="sort-container">
        <div className="array-view-container">
          <div className="cont">
            <div className="thingy">
              <ArrayView sortContext={this.state.func_context} />
            </div>
          </div>
        </div>
        <button onClick={this.sort_step} className="sort-button"> SORT </button>
      </div>
    );
  }
}

export default LinearSearchContainer;
