import React from 'react';
import { swap, randomize_array} from '../../../util';
import ArrayView from '../../ArrayView/ArrayView';

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

// TODO to make tracking swaps in the array easier
// maybe clone arr into output_arr at start of this function????
// then yield output_arr in the 3rd for-loop
// NOTE this works, react just complains right now because it doesn't yield the right stuff
// TODO update this and RadixSort so that they yield, countint_sort was written as a normal function, not a generator
// TODO add display of count_arr to the radix sort page
// do something like this 'yield {array: arr, count_array: count_arr, current_digit: digit, completed: new Set()}'
// TODO make some sort of tree view, then implement AVL tree
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
    yield {array: arr, count_array: count_arr, current_digit: digit, completed: new Set()};
    count_arr[i] += count_arr[i-1];
  }

  for(let i=len-1; i>=0; i--)
  {
    yield {array: arr, count_array: count_arr, current_digit: digit, completed: new Set()};
    let key = extract_digit(arr[i], digit);
    count_arr[key] -= 1;
    let sort_index = count_arr[key];

    output_arr[sort_index] = arr[i];
  }
  // TODO debug code
  console.log(output_arr);
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

    this.state.sort_coroutine = RadixSort(this.state.arr);
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
    let dummy_context = {array: this.state.sort_context.count_array, completed: new Set()};
    //console.log(dummy_context.array.length);
    // TODO crashes when rendering dummy_context ArrayView when count_array is undefined (no return from RadixSort())
    if(dummy_context.array)
    {
      return (
        <div className="sort-container">
          <div className="array-view-container">
            <div className="cont">
              <div className="thingy">
                <ArrayView sortContext={this.state.sort_context} />
              </div>
            </div>
            <div className="cont">
              <div className="thingy">
                <ArrayView sortContext={dummy_context} />
              </div>
            </div>
          </div>
          <button onClick={this.sort_step} className="sort-button"> SORT </button>
        </div>
      );
    }
    else
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
}

export default RadixSortContainer;
