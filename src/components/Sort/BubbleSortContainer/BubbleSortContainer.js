import {swap, array_of_indexes, randomize_array} from '../../../util';
import ArrayView from '../../ArrayView/ArrayView';
import React from 'react';
import FuncContextButton from '../../Buttons/FunctionContextButton';
import ButtonContainer from '../../ButtonContainer/ButtonContainer';

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
    // TODO update this so it doesn't cause errors if .next() returns done === true
    let temp_gen_obj = BubbleSort(this.state.nums);
    this.state.func_context = {
      active_func_ref: this.sort_func_wrapper,
      context: {
        generator_obj: temp_gen_obj,
        last_return_val: temp_gen_obj.next()
      }
    }
  }

  sort_func_wrapper = () => {
    return BubbleSort();
  };

  // TODO update_func_context is duplicated in many containers
  update_func_context = (new_func_context) => {
    // TODO will this work with just:
    // this.setState( {func_context: new_func_context} );
    // ????
    if(new_func_context.context.last_return_val.done)
      return;
    else
    {
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
      </FuncContextButton>,
    ];
    return (
      <div className="sort-container">
        <div className="array-view-container">
          <div className="cont">
            <div className="thingy">
              <ArrayView sortContext={this.state.func_context.context.last_return_val.value} />
            </div>
          </div>
        </div>
        <ButtonContainer buttonElementArr={button_el_arr} />
      </div>
    );
  }
}

export default BubbleSortContainer;
