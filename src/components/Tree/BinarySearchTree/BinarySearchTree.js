import React from "react";
import BinaryTreeView from '../../BinaryTreeView/BinaryTreeView';
import TextInputButton2 from "../../Buttons/TextInputButton2";
import { TreeNode, BinaryTree } from '../../../BinaryTree';
import ButtonContainer from "../../ButtonContainer/ButtonContainer";



// use node.key_ as the identifier for a node
// TODO crash if you keep clicking search and the search value is not in the tree
function* search_binary_tree(root, search_val)
{
  console.log('SEARCH');
  if(!root)
  {
    yield { blue_node_set: new Set(''), node: null};
  }

  yield { blue_node_set: new Set([root.val]), node: root};

  if(search_val === root.val)
  {
    yield { red_node_set: new Set([root.val]), node: root};
  }
  else if(search_val < root.val)
  {
    let it = search_binary_tree(root.left, search_val);
    let ob = it.next();
    while(!ob.done) { yield ob.value; ob = it.next(); }
  }
  else  // if(search_val > root.val)
  {
    let it = search_binary_tree(root.right, search_val);
    let ob = it.next();
    while(!ob.done) { yield ob.value; ob = it.next(); }
  }
}

function* insert(val, root, tree)
{
  if(!root) yield;
  yield {blue_node_set: new Set([root.val])};
  if(val === root.val)
  {
    // TODO what to do with duplicates
    yield {red_node_set: new Set([root.val])};
  }
  else if(val < root.val)
  {
    if(!root.left)
    {
      root.left = new TreeNode(val);
      root.left.parent = root;
      // TODO make this work with the next generator function
      if(root.left.get_depth() >= tree.max_depth) tree.max_depth += 1;
      yield {red_node_set: new Set([root.left.val])};
    }
    else
    {
      let it = insert(val, root.left, tree);
      let ob = it.next();
      while(!ob.done) { yield ob.value; ob = it.next(); }
    }
  }
  else
  {
    if(!root.right)
    {
      root.right = new TreeNode(val);
      root.right.parent = root;
      // TODO make this work with the next generator function
      if(root.right.get_depth() >= tree.max_depth) tree.max_depth += 1;
      yield {red_node_set: new Set([root.right.val])};
    }
    else
    {
      let it = insert(val, root.right, tree);
      let ob = it.next();
      while(!ob.done) { yield ob.value; ob = it.next(); }
    }
  }
}

function* next_in_order(root)
{
  let right_subtree = root.right;

  yield {blue_node_set: new Set([right_subtree.val]), node: right_subtree};

  let min_node = right_subtree;
  while(min_node.left)
  {
    min_node = min_node.left;
    yield {blue_node_set: new Set([min_node.val]), node: min_node};
  }
  yield {red_node_set: new Set([min_node.val]), node: min_node};
}

// TODO crashs if you keep clicking remove on a node that doesn;t exist
function* remove(val, tree)
{
  // ----
  let it = search_binary_tree(tree.head, val);
  let ob = it.next();
  let ret = ob;
  while(!ob.done) { yield ob.value; ret = ob; ob = it.next(); }
  // ----
  let node_to_remove = ret.value.node;
  if(!node_to_remove) return null;

  let node_par = node_to_remove.parent;

  if(!node_to_remove.left && !node_to_remove.right)
  {
    if(node_to_remove === node_par.left)
    {
      node_par.left = null;
    }
    else
    {
      node_par.right = null;
    }
    // TODO make this work with generator
    tree.update_depth();
    yield {red_node_set: new Set([node_to_remove.val])};
  }
  else if(node_to_remove.left && node_to_remove.right)
  {
    // just copying the value is ok since the value of the node 
    // is used as an identifier for the node by the rendering code

    yield {blue_node_set: new Set([node_to_remove.val])};

    // ----
    let it = next_in_order(node_to_remove);
    let ob = it.next();
    let ret = ob;
    while(!ob.done) { ob.value.green_node_set = new Set([node_to_remove.val]); yield ob.value; ret = ob; ob = it.next(); }
    // ----
    let replacement_node = ret.value.node;
    let temp_val = replacement_node.val;
    // TODO recursion
    // ----
    it = remove(replacement_node.val, tree);
    ob = it.next();
    while(!ob.done) { ob.value.green_node_set = new Set([node_to_remove.val]); yield ob.value; ob = it.next(); }
    // ----
    node_to_remove.val = temp_val;

    // TODO make this work with generator
    tree.update_depth();
    yield {red_node_set: new Set([node_to_remove.val])};
  }
  else
  {
    let replacement_node;
    if(node_to_remove.left)
    {
      replacement_node = node_to_remove.left;
    }
    else
    {
      replacement_node = node_to_remove.right;
    }
    node_to_remove.val = replacement_node.val;
    node_to_remove.left = replacement_node.left;
    node_to_remove.right = replacement_node.right;
    if(node_to_remove.left) node_to_remove.left.parent = node_to_remove;
    if(node_to_remove.right) node_to_remove.right.parent = node_to_remove;
    // node_to_remove.parent = replacement_node.parent;
    replacement_node.parent = null;
    // TODO make this work with generator
    tree.update_depth();
    yield {red_node_set: new Set([node_to_remove.val])};
  }
}

function* right_rotate(tree, root)
{
  //      A   <- root
  //    /  \
  //   B    C
  //  / \ 
  // D   E

  //    B 
  //  /  \
  // D    A
  //     / \
  //    E   C

  yield {blue_node_set: new Set([root.val])};
  let B = root.left;
  if(!B) yield {red_node_set: new Set([root.val])};  // can't rotate non-existing node into root node position
  let E = B.right;

  yield {blue_node_set: new Set([root.val]), green_node_set: new Set([B.val]), red_node_set: new Set([root.right.val])};

  B.right = root;
  let original_root_parent = root.parent;
  B.parent = original_root_parent;
  root.parent = B;

  root.left = E;
  if(E) E.parent = root;

  if(B.parent)
  {
    if(root === original_root_parent.left) original_root_parent.left = B;
    else original_root_parent.right = B;
  }
  
  tree.update_depth();
  yield {blue_node_set: new Set([root.val]), green_node_set: new Set([B.val]), red_node_set: new Set([root.right.val])};
}

function* left_rotate(tree, root)
{
  //      A   <- root
  //    /  \
  //   B    C
  //       / \ 
  //      D   E

  //     C  
  //    / \
  //   A   E
  //  / \
  // B   D

  yield {blue_node_set: new Set([root.val])};
  let C = root.right;
  if(!C) return;  // can't rotate non-existing node into root node position
  let D = C.left;

  yield {blue_node_set: new Set([root.val]), green_node_set: new Set([C.val]), red_node_set: new Set([root.left.val])};

  C.left = root;
  let original_root_parent = root.parent;
  C.parent = original_root_parent;
  root.parent = C;

  root.right = D;
  if(D) D.parent = root;

  if(C.parent)
  {
    if(root === original_root_parent.left) original_root_parent.left = C;
    else original_root_parent.right = C;
  }

  tree.update_depth();
  yield {blue_node_set: new Set([root.val]), green_node_set: new Set([C.val]), red_node_set: new Set([root.left.val])};
}

class TestTree extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = { tree: new BinaryTree(4) };
    // TODO add coroutines for insert, remove, search
    this.state.func = null;
    this.state.is_right_rotate=false;
    // TODO update this so it doesn't cause errors if .next() returns done === true
    this.state.func_context = null;

    this.state.func_context = {
      active_func_ref: null,
      context: {
        generator_obj: null,
        last_return_val: null
      }
    }
    // TODO there must be a better way to make this button_val, is_button, update_button(), button_step() etc. pattern
    // NOTE this pattern is repeated in multiple other data structures/algorithm containers too...

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

  search_wrapper_func = (val) => {
    return search_binary_tree(this.state.tree.head, val);
  };
  insert_wrapper_func = (val) => {
    return insert(val, this.state.tree.head, this.state.tree);
  };
  remove_wrapper_func = (val) => {
    return remove(val, this.state.tree);
  };

  render()
  {
    const button_el_arr =
    [
      <TextInputButton2 initialValue={5} updateContainerCallback={this.update_func_context} 
                        assignedFunction={this.search_wrapper_func} 
                        functionContext={this.state.func_context} 
                        inputTranslationFunc={(button_val) => parseInt(button_val)} 
                        inputValidatorFunc={(val) => typeof val == 'number'}>
        SEARCH
      </TextInputButton2>,
      <TextInputButton2 initialValue={5} updateContainerCallback={this.update_func_context} 
                        assignedFunction={this.insert_wrapper_func} 
                        functionContext={this.state.func_context} 
                        inputTranslationFunc={(button_val) => parseInt(button_val)} 
                        inputValidatorFunc={(val) => typeof val == 'number'}>
        INSERT
      </TextInputButton2>,
      <TextInputButton2 initialValue={5} updateContainerCallback={this.update_func_context} 
                        assignedFunction={this.remove_wrapper_func} 
                        functionContext={this.state.func_context} 
                        inputTranslationFunc={(button_val) => parseInt(button_val)} 
                        inputValidatorFunc={(val) => typeof val == 'number'}>
        REMOVE
      </TextInputButton2>,
    ];
    return (
      <div className='tree-container'>
        <BinaryTreeView tree={this.state.tree} context={this.state.func_context.context.last_return_val == null ? this.state.func_context.context.last_return_val : this.state.func_context.context.last_return_val.value} />
        <ButtonContainer buttonElementArr={button_el_arr} />
      </div>
    );
  }
}

export default TestTree;

// TODO cleanup this file big time..........
// TODO rename to Binary Search Tree 
// TODO adapt the contents of this file to AVL tree 

// TODO generalize the css that is used by this file
// e.g. the button container (class = "button-container") can be used by all other containers