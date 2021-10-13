function swap(arr, i, j)
{
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function random_index(arr_length)
{
  let ret = Math.floor(Math.random() * arr_length);
  return ret;
}

function randomize_array(arr)
{
  let len = arr.length;
  for(let i=0; i<len; i++)
  {
    let rand_index = random_index(len);
    swap(arr, i, rand_index);
  }
}

// end = exclusive, start = inclusive
function array_of_indexes(start, end)
{
  let arr = [];
  arr.length = end-start;
  arr.fill(0);

  let index_arr = arr.map((_, index) => { return start+index; });
  return index_arr;
}

function get_arr_index_of_val(arr, search_val)
{
  for(let i=0; i<arr.length; i++)
    if(arr[i] == search_val)
      return i;
  return -1;
}

export { swap, randomize_array, array_of_indexes, get_arr_index_of_val };
