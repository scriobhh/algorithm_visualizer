import {randomize_array} from '../../../util';
import React from 'react';
import ArrayView from '../../ArrayView/ArrayView';

function* MergeSort(arr, depth)
{
  console.log('abc');
  console.log(arr);
  if(arr.length < 2) return;

  let completed_set = new Set();
  let mid = Math.floor(arr.length /2);
  let left_arr = arr.slice(0, mid);
  let right_arr = arr.slice(mid);

  yield {array: arr, completed: new Set(), depth: depth};

  let it_left = MergeSort(left_arr, depth+1);
  let ob =it_left.next(); 
  while(!ob.done) {yield ob.value; ob = it_left.next();}

  let it_right = MergeSort(right_arr, depth+1);
  ob =it_right.next(); 
  while(!ob.done) {yield ob.value; ob = it_right.next();}

  // TODO

  let left=0;
  let left_len = mid;
  let right=0;
  let right_len = arr.length-mid;
  let running_ind = 0;

  yield {start_merge: true, array: arr, completed: new Set(), depth: depth, left_ind: left, right_ind: right, left_arr: left_arr, right_arr: right_arr};

  while(left < left_len && right < right_len)
  {
    if(left_arr[left] > right_arr[right])
    {
      yield {array: arr, left_swap_ind: running_ind, completed: new Set(), depth: depth, left_ind: left, right_ind: right, left_arr: left_arr, right_arr: right_arr};
      arr[running_ind] = right_arr[right];
      right++;
    }
    else
    {
      yield {array: arr, left_swap_ind: running_ind, completed: new Set(), depth: depth, left_ind: left, right_ind: right, left_arr: left_arr, right_arr: right_arr};
      arr[running_ind] = left_arr[left];
      left++;
    }
    running_ind++;
  }
  while(left < left_len)
  {
    yield {array: arr, left_swap_ind: running_ind, completed: new Set(), depth: depth, left_ind: left, right_ind: right, left_arr: left_arr, right_arr: right_arr};
    arr[running_ind] = left_arr[left];
    running_ind++; left++;
  }
  while(right<right_len)
  {
    yield {array: arr, left_swap_ind: running_ind, completed: new Set(), depth: depth, left_ind: left, right_ind: right, left_arr: left_arr, right_arr: right_arr};
    arr[running_ind] = right_arr[right];
    running_ind++; right++;
  }
  yield {array: arr, left_swap_ind: running_ind, completed: new Set(), depth: depth, left_ind: left, right_ind: right, left_arr: left_arr, right_arr: right_arr};
  // TODO the depth+1
  yield {finished: true, array: arr, completed: new Set(), depth: depth};
}

class MergeSortContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {recursive: false, left_arr: null, right_arr: null};

    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    randomize_array(arr);
    this.state.arr = arr;
    this.state.merge_flag = false;

    this.state.sort_context_stack = [];

    this.state.sort_coroutine = MergeSort(this.state.arr, 0);
    // TODO update this so it doesn't cause errors if .next() returns done === true
    this.state.sort_context_stack[0] = this.state.sort_coroutine.next().value;
  }
  sort_step = () => {
    let temp = this.state.sort_coroutine.next();
    if (!temp.done)
    {
      /*
      if(!this.state.sort_context_stack[temp.value.depth])
      {
        this.state.sort_context_stack[temp.value.depth];
      }
      */
      this.state.sort_context_stack[temp.value.depth] = temp.value;
      //this.state.sort_context_stack[temp.value.depth].push(temp.value);
      console.log(this.state.sort_context_stack);
      //this.state.sort_context_stack[temp.value.depth].pop();//ush(temp.value.left_array);
      //this.state.sort_context_stack[temp.value.depth].pop();//ush(temp.value.right_array);
      //this.state.sort_context_stack[temp.value.depth].pop();
      //if(temp.value.depth < this.state.sort_context_stack.length)
      if(temp.value.start_merge)
      {
        this.setState( {merge_flag: true});
      }
      if(temp.value.finished)
      {
        this.setState( {merge_flag: false});
        if(temp.value.depth > 0)
        {
          this.state.sort_context_stack.splice(-1);
        }
      }
      this.setState( {sort_context_stack: this.state.sort_context_stack} );
    }
    else
    {
      //else
        // TODO what to do if sort is finished
    }
  };
  render()
  {
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
  }
}

export default MergeSortContainer;
