import React from 'react';
import { swap, randomize_array} from '../../../util';
import ArrayView from '../../ArrayView/ArrayView';

// TODO highlight the current area being considered (the region from l to r)
function* QuickSort(arr, l, r)
{
  if((r-l) < 2) return;

  yield {array: arr, completed: new Set()};

  // l = inclusive
  // r = exclusive
  let pivot_index = r-1;
  let pivot_val = arr[pivot_index];
  let swap_index=l;
  for(let i=l; i <= pivot_index; i++)
  {
    yield {array: arr, completed: new Set(), left_swap_ind: i, right_swap_ind: swap_index, left_just_swapped_ind: pivot_index};
    if(arr[i] < pivot_val)
    {
      swap(arr, i, swap_index);
      swap_index++;
      yield {array: arr, completed: new Set(), left_swap_ind: i, right_swap_ind: swap_index, left_just_swapped_ind: pivot_index};
    }
  }
  yield {array: arr, completed: new Set(), left_swap_ind: pivot_index, right_swap_ind: swap_index};
  swap(arr, pivot_index, swap_index);
  yield {array: arr, completed: new Set(), left_just_swapped_ind: pivot_index, right_just_swapped_ind: swap_index};

  let it_left = QuickSort(arr, l, swap_index);
  let ob =it_left.next(); 
  while(!ob.done) {yield ob.value; ob = it_left.next();}
  //while(!ob.done) {ob = it_left.next();}

  let it_right = QuickSort(arr, swap_index+1, r);
  ob =it_right.next(); 
  while(!ob.done) {yield ob.value; ob = it_right.next();}
  //while(!ob.done) {ob = it_right.next();}

  yield {array: arr, completed: new Set()};
}

class QuickSortContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {};
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    randomize_array(arr);
    this.state.arr = arr;

    this.state.sort_coroutine = QuickSort(this.state.arr, 0, this.state.arr.length);
    // TODO this might break if .next() has done: true on first iteration
    this.state.sort_context = this.state.sort_coroutine.next().value;
  }
  sort_step = () => {
    let temp = this.state.sort_coroutine.next();
    if(!temp.done)
    {
      this.setState( {sort_context: temp.value} );
    }
  }
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
    /* 
    return (
      <div className="sort-container">
        <div className="array-view-container">
          {this.state.sort_context_stack.map((depth_arr, depth_index) => {
            if(this.state.merge_flag && (depth_index === this.state.sort_context_stack.length-1))
            {
              let left_context = {array: depth_arr.left_arr, completed: new Set(), left_swap_ind: depth_arr.left_ind};
              let right_context = {array: depth_arr.right_arr, completed: new Set(), left_swap_ind: depth_arr.right_ind};
              return (
                <div className="cont">
                  <div className="thingy">
                    <ArrayView sortContext={depth_arr} />
                  </div>
                  <div className="thingy">
                    <ArrayView sortContext={left_context} />
                    <ArrayView sortContext={right_context} />
                  </div>
                </div>
              );
            }
            else
            {
              return (
                <div className="cont">
                  <div className="thingy">
                    <ArrayView sortContext={depth_arr} />
                  </div>
                </div>
              );
            }
          })}
        </div>
        <button onClick={this.sort_step} className="sort-button"> SORT </button>
      </div>
    );
    */
  }
}

export default QuickSortContainer;
