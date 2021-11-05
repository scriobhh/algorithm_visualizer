import {randomize_array} from '../../../util';
import React from 'react';
import ArrayView from '../../ArrayView/ArrayView';
import FuncContextButton from '../../Buttons/FunctionContextButton';
import ButtonContainer from '../../ButtonContainer/ButtonContainer';

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

  yield {
    start_merge: true,
    array: arr,
    completed: new Set(),
    depth: depth,
    left_ind: left,
    right_ind: right,
    left_arr: left_arr,
    right_arr: right_arr
  };

  while(left < left_len && right < right_len)
  {
    if(left_arr[left] > right_arr[right])
    {
      yield {
        array: arr, 
        red_set: new Set([running_ind]), 
        completed: new Set(), 
        depth: depth, 
        left_ind: left,     // TODO replace this with color set? (it is used in code further down)
        right_ind: right,// TODO replace this with color set? (it is used in code further down) 
        blue_set: new Set([left]),
        black_set: new Set([right]),
        left_arr: left_arr, 
        right_arr: right_arr
      };
      arr[running_ind] = right_arr[right];
      right++;
    }
    else
    {
      yield {
        array: arr, 
        red_set: new Set([running_ind]), 
        completed: new Set(), 
        depth: depth, 
        left_ind: left,// TODO replace this with color set? (it is used in code further down) 
        right_ind: right,// TODO replace this with color set? (it is used in code further down) 
        blue_set: new Set([left]),
        black_set: new Set([right]),
        left_arr: left_arr, 
        right_arr: right_arr
      };
      arr[running_ind] = left_arr[left];
      left++;
    }
    running_ind++;
  }
  while(left < left_len)
  {
    yield {
      array: arr, 
      red_set: new Set([running_ind]), 
      completed: new Set(), 
      depth: depth, 
      left_ind: left,// TODO replace this with color set? (it is used in code further down) 
      right_ind: right,// TODO replace this with color set? (it is used in code further down) 
      blue_set: new Set([left]),
      black_set: new Set([right]),
      left_arr: left_arr, 
      right_arr: right_arr
    };
    arr[running_ind] = left_arr[left];
    running_ind++; left++;
  }
  while(right<right_len)
  {
    yield {
      array: arr, 
      red_set: new Set([running_ind]), 
      completed: new Set(), 
      depth: depth, 
      left_ind: left,// TODO replace this with color set? (it is used in code further down) 
      right_ind: right,// TODO replace this with color set? (it is used in code further down) 
      blue_set: new Set([left]),
      black_set: new Set([right]),
      left_arr: left_arr, 
      right_arr: right_arr
    };
    arr[running_ind] = right_arr[right];
    running_ind++; right++;
  }
  yield {
    array: arr, 
    red_set: new Set([running_ind]), 
    completed: new Set(), 
    depth: depth, 
    left_ind: left,// TODO replace this with color set? (it is used in code further down) 
    right_ind: right,// TODO replace this with color set? (it is used in code further down) 
    blue_set: new Set([left]),
    black_set: new Set([right]),
    left_arr: left_arr, 
    right_arr: right_arr
  };
  // TODO the depth+1
  yield {
    finished: true, 
    array: arr, 
    completed: new Set(), 
    depth: depth
  };
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

    let temp_gen_obj = MergeSort(this.state.arr, 0);
    this.state.func_context = {
      active_func_ref: this.sort_func_wrapper,
      context: {
        generator_obj: temp_gen_obj,
        last_return_val: temp_gen_obj.next()
      }
    }
    this.state.sort_context_stack[0] = this.state.func_context.context.last_return_val.value;
  }

  // TODO update_func_context is duplicated in many containers
  update_func_context = (new_func_context) => {
    if(new_func_context.context.last_return_val.done)
      return;
    else
    {
      let new_context = new_func_context.context.last_return_val;
      let sort_context_stack_copy = [ ...this.state.sort_context_stack ];
      sort_context_stack_copy[new_context.value.depth] = new_context.value;
      if(new_context.value.start_merge)
        this.setState( {merge_flag: true});
      if(new_context.value.finished)
      {
        this.setState( {merge_flag: false});
        if(new_context.value.depth > 0)
          sort_context_stack_copy.splice(-1);
      }
      this.setState( {sort_context_stack: sort_context_stack_copy} );

      this.setState({
        func_context: {
          active_func_ref: new_func_context.active_func_ref,
          context: {
            generator_obj: new_func_context.context.generator_obj,
            last_return_val: new_func_context.context.last_return_val
          }
        }
      });
    }
  };

  sort_func_wrapper = () => {
    return MergeSort();
  };

  render()
  {
    const button_el_arr = [
      <FuncContextButton
        coroutineStepArg={undefined} // arg passed to assignedFunction on each step
        updateContainerCallback={this.update_func_context}
        assignedFunction={this.sort_func_wrapper}
        functionContext={this.state.func_context}
        isDisabled={false}>
        SORT
      </FuncContextButton>
    ];
    // TODO clean this up
    return (
      <div className="sort-container">
        <div className="array-view-container">
          {this.state.sort_context_stack.map((depth_arr, depth_index) => {
            if(this.state.merge_flag && (depth_index === this.state.sort_context_stack.length-1))
            {
              let left_context = {array: depth_arr.left_arr, completed: new Set(), red_set: new Set([depth_arr.left_ind])};
              let right_context = {array: depth_arr.right_arr, completed: new Set(), red_set: new Set([depth_arr.right_ind])};
              return (
                <div className="flex-vertical-container">
                  <div className="flex-horizontal-container">
                    <ArrayView sortContext={depth_arr} />
                  </div>
                  <div className="flex-horizontal-container">
                    <ArrayView sortContext={left_context} />
                    <ArrayView sortContext={right_context} />
                  </div>
                </div>
              );
            }
            else
            {
              return (
                <div className="flex-vertical-container">
                  <div className="flex-horizontal-container">
                    <ArrayView sortContext={depth_arr} />
                  </div>
                </div>
              );
            }
          })}
        </div>
        <ButtonContainer buttonElementArr={button_el_arr} />
      </div>
    );
  }
}

export default MergeSortContainer;
