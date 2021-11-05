import React, { useEffect, useState } from 'react';
import Node from '../Node/Node';
import Line from '../Line/Line';
import {generate_vertex_list, get_normalized_coords_to_screenspace_coords} from '../../GenerateVertices';

// arrange nodes in circular fashion so that edges don't cross over nodes

// equation of circle:
//    (x-cx)^2 + (y-cy)^2 = r^2
// cx and cy are at the center of the graph view
// r should be less than half of the shortest side of the view container (at least 50px less since that is size of node circle)

function get_coord(sin_val, cx, cy, r)
{
  let point = {
    x: Math.sin(sin_val)*r +cx,
    y: Math.cos(sin_val)*r +cy
  };
  return point;
}

// TODO create small random number (positive or negative) and add it to the sin_val to add small amount of randomness to where the vertices are positioned
function* get_next_coords(el_count, cx, cy, r)
{
  // the circle gets divided up starting with 2 nodes at each end of the circle on the x-axis
  // as more nodes are added, to keep things evenly divided with 2 nodes on the x-axis, add spaces (co-ords) for 2 extra nodes to the top and bottom half of the circles
  // the number of spaces for vertices goes up in increments of 4
  // if the number of spaces for vertices will always be (2+ 4*N) where N is any arbitrary value

  let N = (el_count-2) / 4;
  let number_of_coords = (N <= 0) ? 2 : 2 + Math.ceil(N)*4;

  let coords_per_half_circle = number_of_coords / 2;  // this will be same for left, right, top and bottom halves
  console.assert(coords_per_half_circle % 1 == 0, `invalid coords_per_half_circle: ${coords_per_half_circle}`);
  coords_per_half_circle += 1;  // divide the circle up into k+1 parts instead of k parts, this prevents the loop below from reaching the top (sin_val=0) of the circle

  let sin_val = -Math.PI;  // sin value for bottom of circle (y=-r x=0)
  for(let i=0; i<number_of_coords; i++)
  {
    let temp_sin_val;
    if(i % 2 == 0)
    {
      sin_val += Math.PI / coords_per_half_circle;
      temp_sin_val = sin_val;
    }
    else
      temp_sin_val = sin_val + Math.PI;  // move temp_sin_val to opposite side of the circle

    let curr_coord = get_coord(temp_sin_val, cx, cy, r);
    yield curr_coord;
  }
}

function populate_normalized_coords(node_list, cx, cy, r, normalized_node_coords_map)
{
  // the circle gets divided up starting with 2 nodes at each end of the circle on the x-axis
  // as more nodes are added, to keep things evenly divided with 2 nodes on the x-axis, add spaces (co-ords) for 2 extra nodes to the top and bottom half of the circles
  // the number of spaces for vertices goes up in increments of 4
  // if the number of spaces for vertices will always be (2+ 4*N) where N is any arbitrary value

  let el_count = Object.keys(node_list).length;
  let N = (el_count-2) / 4;
  let number_of_coords = (N <= 0) ? 2 : 2 + Math.ceil(N)*4;

  let coords_per_half_circle = number_of_coords / 2;  // this will be same for left, right, top and bottom halves
  console.assert(coords_per_half_circle % 1 == 0, `invalid coords_per_half_circle: ${coords_per_half_circle}`);
  coords_per_half_circle += 1;  // divide the circle up into k+1 parts instead of k parts, this prevents the loop below from reaching the top (sin_val=0) of the circle

  let sin_val = -Math.PI;  // sin value for bottom of circle (y=-r x=0)
  //for(let i=0; i<el_count; i++)
  //{
  Object.keys(node_list).forEach((key, i) => {
    let temp_sin_val;
    if(i % 2 == 0)
    {
      sin_val += Math.PI / coords_per_half_circle;
      temp_sin_val = sin_val;
    }
    else
      temp_sin_val = sin_val + Math.PI;  // move temp_sin_val to opposite side of the circle

    let curr_coord = get_coord(temp_sin_val, cx, cy, r);
    normalized_node_coords_map[key] = curr_coord;
  });
}

/*
function normalized_coords_to_screen_space_coords(point)
{
  const radius = 50;  // 50 represents the css position value 50%
  // NOTE radius + x*radius gives you the offset from the top left corner of screen
  // centering the entire circle of nodes is handled by flexbox and the container html elements
  let ret = {
    x: radius + point.x*radius,
    y: radius + point.y*radius
  };
  return ret;
}
*/
function normalized_coords_to_screen_space_coords(point)
{
  let ret = {
    x: point.x*100,
    y: point.y*100
  };
  return ret;
}

function get_reversed_edge(edge)
{
  let reversed_edge = [edge[1], edge[0]];
  return reversed_edge;
}

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

function line_point_center(point, container_height_pixels, node_width_pixels)
{
  // let node_width_pixels = 50;  // this is square, so width == height
  // TODO
  // assuming that the width of a node is 50px:
  //  offset from the left by: 50px/2 / clientWidth
  //  offset from the top by: 50px/2 / clientHeight
  let top_offset = node_width_pixels / 2 / container_height_pixels;
  let top_offset_as_percentage = top_offset*100;
  let p = {
    x: point.x,
    y: point.y + top_offset_as_percentage
  }
  return p;
}

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

function populate_node_list(node_list)
{
  let nodes = {};
  node_list.forEach(node => {
    nodes[node] = node;
  });
  return nodes;
}

function GraphView(props)
{
  let graph = props.graphObj;
  let node_list = populate_node_list(graph.get_vertices());

  // TODO code re-use with BinaryTreeView by passing function to shared code in GenerateVertices
  let normalized_node_coords_map = {};
  populate_normalized_coords(node_list, 0.5, 0.5, 0.5, normalized_node_coords_map);  // normalized from -1 to 1 (inclusive)

  // TODO this causes the graph view to get rendered twice
  let [width, setWidth] = useState(0);
  let [height, setHeight] = useState(0);
  let [nodeWidth, setNodeWidth] = useState(0);
  useEffect(() => {
    console.log('UPDATED');
    const el = document.getElementsByClassName('graph-view')[0];
    const node_el = document.getElementsByClassName('sort-container')[0];
    setWidth(el.clientWidth);
    setHeight(el.clientHeight);
    setNodeWidth(node_el.clientWidth);
    window.onresize = () => {
      const el = document.getElementsByClassName('graph-view')[0];
      let width = el.clientWidth;
      let height = el.clientHeight;
      console.log(`${width}, ${height}`);
      setWidth(el.clientWidth);
      setHeight(el.clientHeight);
    };
  });

  let vertex_screenspace_coords_list = get_normalized_coords_to_screenspace_coords(normalized_node_coords_map);
  let node_el_list = generate_vertex_list(node_list, vertex_screenspace_coords_list, props.context, width);
  
  let edge_list = generate_edge_list_for_graph(graph);

  return (
    <div className='graph-view-container'>
      <div className='graph-view'>
        {node_el_list.map((node) => node)}
        <LineList vertexScreenspaceCoordsList={vertex_screenspace_coords_list} edgeList={edge_list} containerWidth={width} containerHeight={height} nodeWidth={nodeWidth}/>
      </div>
    </div>
  );
}

function LineList(props)
{
  let vertex_screenspace_coords_map = props.vertexScreenspaceCoordsList;
  let edge_screenspace_coords = [];
  let visited_edges = new Set();
  let edge_list = props.edgeList;

  let cont_w = props.containerWidth;
  let cont_h = props.containerHeight;
  let node_w = props.nodeWidth;
  console.log(`CONT_W ${cont_w}   CONT_H ${cont_h}`);
  Object.entries(edge_list).forEach((entry, ind) => {
    let key = entry[0];
    let edge_arr = entry[1];
    edge_arr.forEach(edge => {
      if(!visited_edges.has(edge))
      {
        let orig = line_point_center(vertex_screenspace_coords_map[edge.orig], cont_h, 50);
        let dest = line_point_center(vertex_screenspace_coords_map[edge.dest], cont_h, 50);
        let edge_coords = {
          orig: orig,
          dest: dest
        };
        edge_screenspace_coords.push(edge_coords);
      }
    });
  });

  let line_list = edge_screenspace_coords.map((edges_coords) => {
    let x1 = `${edges_coords.orig.x}%`;
    let y1 = `${edges_coords.orig.y}%`;
    let x2 = `${edges_coords.dest.x}%`;
    let y2 = `${edges_coords.dest.y}%`;
    return (
      <Line x1={x1} y1={y1} x2={x2} y2={y2}/>
    );
  });

  return (
    <div style={{width: '100%', height: '100%', position: 'relative', backgroundColor: 'red'}}>
      {line_list.map((line) => line)}
    </div>
  );
}

function generate_edge_list_for_graph(graph)
{
  let edge_list = {};
  graph.get_edges().forEach(edge => {
    let key = edge.orig;
    if(!edge_list[key]) edge_list[key] = [];
    edge_list[key].push(edge);
  });
  return edge_list;
}

export {GraphView, LineList};
