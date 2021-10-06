
class TreeNode
{
  constructor(val=null, parent=null)
  {
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.val = val;
  }

  // head of tree is depth 0
  get_depth(node=this)
  {
    if(node.parent === null) return 0;
    return 1 + this.get_depth(node.parent);
  }

}

// TODO clean this up, many of these functions are unecessary and have been implemented as generators (which are actually useful)
// maybe keep them around in a different file, but just get them out of this file
class BinaryTree
{
  constructor(depth)
  {
    this.max_depth = depth-1;
    this.count_ = 0;
    this.head = this.create_sorted_tree(this.max_depth);
  }

  create_sorted_tree(max_depth, root=null, curr_depth=0)
  {
    if(!root)
    {
      let temp = new TreeNode();
      this.max_depth = max_depth;
      this.create_sorted_tree(max_depth, temp, curr_depth);
      console.log(temp);
      this.count_ = 0;
      return temp;
    }

    if(curr_depth > max_depth)
    {
      return;
    }

    if(curr_depth < max_depth)
    {
      root.left = new TreeNode(-1, root);
      this.create_sorted_tree(max_depth, root.left, curr_depth+1);
    }

    root.val = this.count_++;

    if(curr_depth < max_depth)
    {
      root.right = new TreeNode(-1, root);
      this.create_sorted_tree(max_depth, root.right, curr_depth+1);
    }
  }

  find(val, root=this.head)
  {
    if(!root) return null;

    if(val === root.val)
    {
      return root;
    }
    else if(val < root.val)
    {
      return this.find(val, root.left);
    }
    else
    {
      return this.find(val, root.right);
    }
  }

  has_val(val)
  {
    let res = this.find(val);
    return (res != null);
  }

  next_in_order(root)
  {
    let right_subtree = root.right;

    let min_node = right_subtree;
    console.log('THING');
    console.log(min_node.val);
    while(min_node.left)
    {
      console.log(min_node.val);
      min_node = min_node.left;
    }
    console.log(min_node.val);
    return min_node;
  }

  remove(val)
  {
    let node_to_remove = this.find(val);
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
      console.log(this.head);
      this.update_depth();
      return;
    }

    if(node_to_remove.left && node_to_remove.right)
    {
      // just copying the value is ok since the value of the node 
      // is used as an identifier for the node by the rendering code

      let replacement_node = this.next_in_order(node_to_remove);
      let temp_val = replacement_node.val;
      this.remove(replacement_node.val);  // INFINITE LOOP HERE
      node_to_remove.val = temp_val;

      console.log(this.head);
      this.update_depth();
      return;
    }

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
      console.log(this.head);
      this.update_depth();
  }

  insert(val, root=this.head)
  {
    if(!root) return;
    if(val === root.val)
    {
      // TODO what to do with duplicates
      return;
    }
    else if(val < root.val)
    {
      if(!root.left)
      {
        root.left = new TreeNode(val);
        root.left.parent = root;
        if(root.left.get_depth() >= this.max_depth) this.max_depth += 1;
      }
      else
      {
        this.insert(val, root.left);
      }
    }
    else
    {
      if(!root.right)
      {
        root.right = new TreeNode(val);
        root.right.parent = root;
        if(root.right.get_depth() >= this.max_depth) this.max_depth += 1;
      }
      else
      {
        this.insert(val, root.right);
      }
    }
  }

  right_rotate(root)
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

    let B = root.left;
    if(!B) return;  // can't rotate non-existing node into root node position
    let E = B.right;

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
    
    this.update_depth();
  }

  left_rotate(root)
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

    let C = root.right;
    if(!C) return;  // can't rotate non-existing node into root node position
    let D = C.left;

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

    this.update_depth();
  }

  // TODO remake this, go to bottom of tree and get depth, then get max of all the depths of each path
  // also note that it needs to return 0 if it only has 1 node
  update_depth(root=this.head)
  {
    if(!root)
      return 0;

    if(!root.left && !root.right)
      return 0;

    let left_depth = this.update_depth(root.left);
    let right_depth = this.update_depth(root.right);
    let this_depth = 1 + Math.max(left_depth, right_depth);

    console.log(`depth: ${this_depth}`);
    if(root === this.head) this.max_depth = this_depth;
    else return this_depth;
  }
}

export { TreeNode, BinaryTree };
