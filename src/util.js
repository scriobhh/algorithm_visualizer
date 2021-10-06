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

/*
class binary_tree_node
{
  constructor(val = null)
  {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.val = val;
  }
}

class binary_tree
{
  concstructor(val)
  {
    this.head = new binary_tree_node(val);
  }

  insert_at_depth(val, curr_depth)
  {
  }
  insert_at_depth(val, depth, root = this.head, curr_depth=0)
  {
    if(curr_depth > depth) return;
    if(curr_depth < depth){
      this.insert_at_depth(val, depth, root.left, curr_depth+1);
      this.insert_at_depth(val, depth, root.right, curr_depth+1);
      return;
    }
    root.val = val;
  }
}
*/

export { swap, randomize_array, array_of_indexes };
