import React, { useEffect, useState } from 'react';
import Node from '../Node/Node';
import Line from '../Line/Line';
import {Edge} from '../Graph/GraphContainer/GraphContainer';
import {LineList} from '../GraphView/GraphView';
import {generate_vertex_list, get_normalized_coords_to_screenspace_coords} from '../../GenerateVertices';

function in_order_populate_node_list(root, node_list)
{
  if(!root) return;
  in_order_populate_node_list(root.left, node_list);
  node_list[root.key] = root.val;
  in_order_populate_node_list(root.right, node_list);
}

function in_order_populate_node_coords(root, curr_depth, curr_horizontal_pos, max_depth, normalized_node_coords_map)
{
  if(!root) return;
  in_order_populate_node_coords(root.left, curr_depth+1, curr_horizontal_pos*2, max_depth, normalized_node_coords_map);
  const nodes_on_curr_depth = Math.pow(2, curr_depth);
  const x_level_count = nodes_on_curr_depth+1;
  const x = (1/x_level_count) * (curr_horizontal_pos+1);
  const y_level_count = max_depth+2;  // max_deoth+1 is the number of depth levels to the tree, the extra +1 is so the last level is left empty
  const y = (1/y_level_count) * (curr_depth+1); // curr_depth+1 since curr_depth=0 is the first level, curr_depth=1 is the 2nd level etc
  normalized_node_coords_map[root.key] = {x: x, y: y};
  in_order_populate_node_coords(root.right, curr_depth+1, curr_horizontal_pos*2+1, max_depth, normalized_node_coords_map);
}

function BinaryTreeView(props)
{
  console.log(props.context);
  // TODO this circle_class code is duplicated in GraphView
  // TODO there must be a better way to design this instead of checking against each node...

  // TODO this is completely duplicated from GraphView.js
  let [width, setWidth] = useState(0);
  let [height, setHeight] = useState(0);
  let [nodeWidth, setNodeWidth] = useState(0);
  useEffect(() => {
    console.log('UPDATED');
    const el = document.getElementsByClassName('sort-container')[0];
    const node_el = document.getElementsByClassName('node-container')[0];
    setWidth(el.clientWidth);
    setHeight(el.clientHeight);
    setNodeWidth(node_el.clientWidth);
    window.onresize = () => {
      const el = document.getElementsByClassName('binary-tree-view-container')[0];
      let width = el.clientWidth;
      let height = el.clientHeight;
      console.log(`${width}, ${height}`);
      setWidth(el.clientWidth);
      setHeight(el.clientHeight);
    };
  });

  let node_list = {};
  in_order_populate_node_list(props.tree.head, node_list)

  // TODO code re-use with GraphView by passing function to shared code in GenerateVertices
  let normalized_node_coords_map = {};
  in_order_populate_node_coords(props.tree.head, 0, 0, props.tree.max_depth, normalized_node_coords_map)

  console.log('YUP');
  console.log(node_list);
  console.log(normalized_node_coords_map);
  let node_screenspace_coords_list = get_normalized_coords_to_screenspace_coords(normalized_node_coords_map);
  console.log(node_screenspace_coords_list);
  let node_el_list = generate_vertex_list(node_list, node_screenspace_coords_list, props.context, width);

  let edge_list = {};
  generate_edge_list_for_binary_tree(props.tree.head, edge_list);

  console.log('EDGE LIST TREE');
  console.log(edge_list);

  return (
    <div className='binary-tree-view-container'>
      {node_el_list.map((el) => el)}
      <LineList vertexScreenspaceCoordsList={node_screenspace_coords_list} edgeList={edge_list} containerWidth={width} containerHeight={height} nodeWidth={nodeWidth}/>
    </div>
  );
}

function generate_edge_list_for_binary_tree(root, edge_list)
{
  if(!root) return;
  edge_list[root.key] = [];
  if(root.left)
  {
    let edge = new Edge(root.key, root.left.key)
    edge_list[root.key].push(edge);
    generate_edge_list_for_binary_tree(root.left, edge_list)
  }

  if(root.right)
  {
    let edge = new Edge(root.key, root.right.key)
    edge_list[root.key].push(edge);
    generate_edge_list_for_binary_tree(root.right, edge_list)
  }

  if(edge_list[root.key].length === 0)
    delete edge_list[root.key];
}

// TODO this is completely duplicated from GraphView.js
function Vertex(props)
{
  let pos_obj = 
  {
    left: props.left,
    top: props.top
  };
  return (
    <div class='vertex' style={pos_obj}>
      <Node circleClass={props.circleClass} centerX={'50%'} centerY={'50%'} nodeValue={props.children}/>
    </div>
  );
}
// TODO this is duplicated from GraphView.js
function vertex_point_center(point, container_width_pixels, node_width_pixels)
{
  let left_offset = node_width_pixels / 2 / container_width_pixels;
  let left_offset_as_percentage = left_offset*100;
  let p = {
    x: point.x - left_offset_as_percentage,
    y: point.y 
  }
  return p;
}

export default BinaryTreeView;
