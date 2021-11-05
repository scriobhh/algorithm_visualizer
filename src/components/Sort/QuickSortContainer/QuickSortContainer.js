import React from 'react';
import { swap, randomize_array} from '../../../util';
import ArrayView from '../../ArrayView/ArrayView';
import FuncContextButton from '../../Buttons/FunctionContextButton';
import ButtonContainer from '../../ButtonContainer/ButtonContainer';

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
    yield {array: arr, completed: new Set(), red_set: new Set([i]), blue_set: new Set([swap_index]), black_set: new Set([pivot_index])};
    if(arr[i] < pivot_val)
    {
      swap(arr, i, swap_index);
      swap_index++;
      yield {array: arr, completed: new Set(), red_set: new Set([i]), blue_set: new Set([swap_index]), black_set: new Set([pivot_index])};
    }
  }
  yield {array: arr, completed: new Set(), red_set: new Set([pivot_index]), blue_set: new Set([swap_index])};
  swap(arr, pivot_index, swap_index);
  yield {array: arr, completed: new Set(), black_set: new Set([pivot_index]), purple_set: new Set([swap_index])};

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

    let temp_gen_obj = QuickSort(this.state.arr, 0, this.state.arr.length);
    this.state.func_context = {
      active_func_ref: this.sort_func_wrapper,
      context: {
        generator_obj: temp_gen_obj,
        last_return_val: temp_gen_obj.next()
      }
    }
  }

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

  sort_func_wrapper = () => {
    return QuickSort();
  };

  // TODO update this so that it renders elements that are part of the current sort sub-array as a different color
  render()
  {
    let button_el_arr = [
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
          <ArrayView sortContext={this.state.func_context.context.last_return_val.value} />
        </div>
        <ButtonContainer buttonElementArr={button_el_arr} />
      </div>
    );
  }
}

export default QuickSortContainer;
