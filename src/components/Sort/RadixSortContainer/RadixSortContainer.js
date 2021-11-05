import React from 'react';
import { swap, randomize_array} from '../../../util';
import ArrayView from '../../ArrayView/ArrayView';
import ButtonContainer from '../../ButtonContainer/ButtonContainer';
import FuncContextButton from '../../Buttons/FunctionContextButton';

function get_max(arr)
{
  let max = -10000;
  for(let i=0; i<arr.length; i++)
  {
    max = Math.max(max, arr[i]);
  }
  return max;
}

function get_digit_count(num)
{
  let temp;
  let max_digits=0;
  do
  {
    max_digits++;
    temp = (num / 10**max_digits);
  } while(temp >= 1)

  return max_digits;
}

// for digit: 0 is last digit, 1 is 2nd last digit etc.
// NOTE very conveniently, if you pass >N for an N digit number, this function returns 0
function extract_digit(num, digit)
{
  let extracted_digit = (num / 10**digit) % 10;
  return Math.floor(extracted_digit);
}

// TODO add colors to the array elements
function* counting_sort(arr, digit)
{
  let len = arr.length;
  let output_arr = [];
  let count_arr = [];
  count_arr.length = 10;
  count_arr.fill(0);

  for(let i=0; i<len; i++)
  {
    let d = extract_digit(arr[i], digit);
    count_arr[d] += 1;
  }

  for(let i=1; i<count_arr.length; i++)
  {
    // yield {array: arr, count_array: count_arr, current_digit: digit, completed: new Set()};
    count_arr[i] += count_arr[i-1];
  }

  for(let i=len-1; i>=0; i--)
  {
    yield {array: arr, count_array: count_arr, output_arr: output_arr, current_digit: digit, completed: new Set()};
    let key = extract_digit(arr[i], digit);
    count_arr[key] -= 1;
    let sort_index = count_arr[key];

    output_arr[sort_index] = arr[i];
  }

  yield {finished: true, output: output_arr};
}

function* RadixSort(arr)
{
  let max_num = get_max(arr);
  let max_digits = get_digit_count(max_num);

  for(let digit=0; digit<max_digits; digit++)
  {
    let it = counting_sort(arr, digit);
    let ob;
    do
    {
      ob = it.next();
      if(!ob.value.finished) yield ob.value;
    }while(!ob.value.finished)
    arr = ob.value.output;
    //arr = counting_sort(arr, digit);
  }
  // TODO debug code
  console.log(arr);
  yield {array: arr, completed: new Set()};
}

class RadixSortContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {};
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    randomize_array(arr);
    this.state.arr = arr;

    let temp_gen_obj = RadixSort(this.state.arr);
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
    return RadixSort();
  };

  render()
  {
    // TODO crashes when rendering dummy_context ArrayView when count_array is undefined (no return from RadixSort())
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
    let func_context = this.state.func_context.context.last_return_val.value;
    if(func_context.count_array)
    {
      return (
        <div className="algo-container">
          <div className="array-view-container">
              <ArrayView sortContext={func_context} />
              <ArrayView sortContext={{array: func_context.count_array, completed: new Set()}} />
              <ArrayView sortContext={{array: func_context.output_arr, completed: new Set()}} />
          </div>
          <ButtonContainer buttonElementArr={button_el_arr} />
        </div>
      );
    }
    else
    {
      return (
        <div className="algo-container">
          <div className="array-view-container">
            <ArrayView sortContext={func_context} />
          </div>
          <ButtonContainer buttonElementArr={button_el_arr} />
        </div>
      );
    }
  }
}

export default RadixSortContainer;
