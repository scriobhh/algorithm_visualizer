import React from 'react';
import ArrayView from '../../ArrayView/ArrayView';
import {swap, array_of_indexes, randomize_array} from '../../../util';

function* BinarySearch(arr, search_val)
{
  let l = 0;          // inclusive
  let r = arr.length; // exclusive
  let mid;
  while(l < r)
  {
    mid = Math.floor(l + (r-l)/2);
  yield {array: arr, completed: new Set(), left_swap_ind: mid};
    if(arr[mid] === search_val)
    {
      break;
    }
    else if(arr[mid] > search_val)
    {
      r = mid;
    }
    else
    {
      l = mid+1;
    }
  }
  console.log(mid);
  yield {array: arr, completed: new Set(), left_swap_ind: mid};
}

class BinarySearchContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.state = { nums: arr };
    this.state.coroutine = BinarySearch(this.state.nums, 7);
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

export default BinarySearchContainer;
