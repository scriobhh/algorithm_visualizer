import React from "react";
import { TreeNode, BinaryTree } from "../../../BinaryTree";
import BinaryTreeView from '../../BinaryTreeView/BinaryTreeView';
import ButtonContainer from "../../ButtonContainer/ButtonContainer";
import TextInputButton2 from "../../Buttons/TextInputButton2";

// TODO this is buggy af
// keep spamming insert and see what happens

// if one of the child nodes are smaller/larger than the parent node:
//    the parent node will be swapped with the smallest/largest child node
//    the heapify will be recursively called on the child node that got swapped
function* heapify(root)
{
  while(root)
  {
    let largest_val_node = root;

    if(root.left)
    {
      yield {blue_node_set: new Set([root.key]), red_node_set: new Set([root.left.key])};
      if(root.left.val > largest_val_node.val)
      {
        largest_val_node = root.left;
      }
    }
    if(root.right)
    {
      yield {blue_node_set: new Set([root.key]), red_node_set: new Set([root.right.key])};
      if(root.right.val > largest_val_node.val)
      {
        largest_val_node = root.right;
      }
    }

    yield {blue_node_set: new Set([root.key]), green_node_set: new Set([largest_val_node.key])};
    
    if(root !== largest_val_node)
    {
      let temp_val = root.val;
      root.val = largest_val_node.val;
      largest_val_node.val = temp_val;
      yield {green_node_set: new Set([root.key]), blue_node_set: new Set([largest_val_node.key])};
      // call hepify 2nd time since largest_val_node could potentially not be largest (if both children of the original root are larger than root)
      // TODO RECURSIVE
      //heapify(largest_val_node);
      // ----
      //let it = heapify(largest_val_node);
      //let ob = it.next();
      //while(!ob.done) { yield ob.value; ob = it.next(); }
      // ----
    }

    root = root.parent;
  }
}

function heapify_entire_tree(root)
{

  if(!root.left && !root.right)
  {
    let it = heapify(root.parent);
    let ob = it.next();
    while(!ob.done) { ob = it.next(); }
    return;
  }

  if(root.left)
    heapify_entire_tree(root.left);
  if(root.right)
    heapify_entire_tree(root.right);
}

/*
function* heapify_entire_tree(root)
{
  if(!root) return;

  // pre-order traversal
  // ----
  let it = heapify_entire_tree(root.left);
  let ob = it.next();
  while(!ob.done) { yield ob.value; ob = it.next(); }
  // ----
  it = heapify_entire_tree(root.right);
  ob = it.next();
  while(!ob.done) { yield ob.value; ob = it.next(); }
  // ----

  yield {blue_node_set: new Set([root.val])};
  // ----
  it = heapify(root);
  ob = it.next();
  while(!ob.done) { yield ob.value; ob = it.next(); }
  // ----
  yield {blue_node_set: new Set([root.val])};
}
*/

function* insert(val, tree)
{
  let queue = [];
  queue.push(tree.head);

  let node;
  while(queue.length > 0)
  {
    node = queue.shift();
    yield {blue_node_set: new Set([node.key])};

    if(!node.left)
    {
      node.left = new TreeNode(tree.count_++, val, node);
      //node.left.parent = node;
      tree.update_depth();
      break;
    }
    else queue.push(node.left);

    if(!node.right)
    {
      node.right = new TreeNode(tree.count_++, val, node);
      //node.right.parent = node;
      tree.update_depth();
      break;
    }
    else queue.push(node.right);
  }

  // heapify from inserted node upwards
  let it = heapify(node);
  let ob = it.next();
  while(!ob.done) { yield ob.value; ob = it.next(); }
}

// TODO switch out the 'search' stuff with pop()
class HeapContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    let tree = new BinaryTree(4);
    heapify_entire_tree(tree.head);
    this.state = {tree: tree};
    this.state.func = null; // TODO is this used???
    this.state.func_context = {
      active_func_ref: null,
      context: {
        generator_obj: null,
        last_return_val: null
      }
    };

  }

  update_func_context = (new_func_context) => {
    // TODO will this work with just:
    // this.setState( {func_context: new_func_context} );
    // ????
    if(new_func_context.context.last_return_val.done)
    {
      this.setState({
        func_context: {
          active_func_ref: null,
          context: {
            generator_obj: null,
            last_return_val: null
          }
        }
      });
    }
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

  insert_wrapper_func = (insert_val) => {
    return insert(insert_val, this.state.tree);
  };

  render()
  {
    const button_el_arr = 
    [
      <TextInputButton2 initial_value={5} updateContainerCallback={this.update_func_context} 
                        assignedFunction={this.insert_wrapper_func} 
                        functionContext={this.state.func_context} 
                        inputTranslationFunc={(button_val) => parseInt(button_val)} 
                        inputValidatorFunc={(val) => typeof val == 'number'}>
        INSERT
      </TextInputButton2>,
    ];
    return (
      <div className='tree-container'>
        <BinaryTreeView tree={this.state.tree} context={this.state.func_context.context.last_return_val == null ? this.state.func_context.context.last_return_val : this.state.func_context.context.last_return_val.value}/>
        <ButtonContainer buttonElementArr={button_el_arr} />
      </div>
    );
  }

}

export default HeapContainer;

// TODO by default the tree is not a valid max heap (everything is in wrong order)
// TODO this is max heap