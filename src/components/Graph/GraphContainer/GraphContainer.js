import React from 'react';
import {GraphView, LineList} from '../../GraphView/GraphView';
import TextInputButton2 from "../../Buttons/TextInputButton2";
import ButtonContainer from '../../ButtonContainer/ButtonContainer';

class Edge
{
  constructor(origin, destination, weight = null)
  {
    this.orig = origin;
    this.dest = destination;
    this.weight = weight;
  }
  get_opposite_vert(vert)
  {
    if(vert == this.orig)
      return this.dest;

    if(vert == this.dest)
      return this.orig;

    console.error('called Graph.add_edge() with non-existant vertices');
  }
}

function are_edges_equal(edge1, edge2)
{
  if(edge1.orig == edge2.orig && edge1.dest == edge2.dest)
    return true;

  if(edge1.orig == edge2.dest && edge1.dest == edge2.orig)
    return true;

  return false;
}

// NOTE this assumes that all vertices are unique
// {red_node: , blue_node: , green_node: }
// TODO rename 'node' to 'vert' in this function
function* breadth_first_search(graph, start_vert, search_vert)
{
  if(start_vert == search_vert)
  {
    yield {green_node_set: new Set(start_vert)};
    yield {red_node_set: new Set(start_vert)};
    return;
  }

  let queue = [start_vert];
  let visited_nodes = new Set(start_vert);
  let visited_edges = new Set();
  let back_edges = new Set();
  while(queue.length > 0)
  {
    const curr_vert = queue.pop();
    let incident_edges = graph.get_incident_edges(curr_vert);
    for(let i=0; i<incident_edges.length; i++)
    {
      let edge = incident_edges[i];
      if(visited_edges.has(edge))
        continue;

      let opp_vert = edge.get_opposite_vert(curr_vert);
      if(!visited_nodes.has(opp_vert))
      {
        visited_edges.add(edge);
        yield {green_node_set: new Set(opp_vert), blue_node_set: visited_nodes, dark_blue_node_set: new Set(curr_vert)};
        if(opp_vert == search_vert)
        {
          yield {red_node_set: new Set(opp_vert), blue_node_set: visited_nodes, dark_blue_node_set: new Set(curr_vert)};
          return;
        }
        visited_nodes.add(opp_vert);
        queue.push(opp_vert);
      }
      else
      {
        back_edges.add(edge);
      }
    }
  }
}

// NOTE this assumes that all vertices are unique
// {red_node: , blue_node: , green_node: }
// TODO rename 'node' to 'vert' in this function
function* DFS_recurse(curr_vert, search_vert, visited_verts, visited_edges, back_edges, prev_vert, graph)
{
  yield {green_node_set: new Set(curr_vert), blue_node_set: visited_verts, dark_blue_node_set: new Set(prev_vert)};
  console.log(`VISITED: ${curr_vert}`);
  if(curr_vert == search_vert)
  {
    // TODO
    yield {red_node_set: new Set(curr_vert), blue_node_set: visited_verts, dark_blue_node_set: new Set(prev_vert)};
  } 
  visited_verts.add(curr_vert);

  let incident_edges = graph.get_incident_edges(curr_vert);
  for(let i = 0; i<incident_edges.length; i++)
  {
    let edge = incident_edges[i];
    if(visited_edges.has(edge))
      continue;

    let opp_vert = edge.get_opposite_vert(curr_vert);
    if(!visited_verts.has(opp_vert))
    {
      visited_edges.add(edge);
      // TODO code duplication, this pattern is use everywhere
      // ----
      let iter = DFS_recurse(opp_vert, search_vert, visited_verts, visited_edges, back_edges, curr_vert, graph);
      let ob = iter.next();
      while(!ob.done) { yield ob.value; ob = iter.next(); }
      // ----
    }
    else
    {
      back_edges.add(edge);
    }
  }
}

function* depth_first_search(graph, start_vert, search_vert)
{
  let visited_verts = new Set();
  let visited_edges = new Set();
  let back_edges = new Set();
  // TODO code duplication, this pattern is use everywhere
  // ----
  let iter = DFS_recurse(start_vert, search_vert, visited_verts, visited_edges, back_edges, '', graph);
  let ob = iter.next();
  while(!ob.done) { yield ob.value; if(ob.value.red_node_set) { return; } ob = iter.next(); }
  // ----
}

class Graph
{
  constructor(vertex_list=null, _edge_list=null)
  {
    this.adjacency_list = {};
    if(vertex_list)
    {
      vertex_list.forEach((vert) => {
        this.add_vertex(vert);
      });
    }
    // TODO is the edge_list necessary???
    this.edge_list = [];
    _edge_list.forEach((edge) => {
      this.add_edge(edge);
    });
  }
  already_has_edge(edge)
  {
    this.adjacency_list[edge.orig].forEach((curr_edge) => {
      if(are_edges_equal(edge, curr_edge))
        return true;
    });
    this.adjacency_list[edge.dest].forEach((curr_edge) => {
      if(are_edges_equal(edge, curr_edge))
        return true;
    });

    return false;
  }
  add_edge(edge, weight=null)
  {
    if(this.already_has_edge(edge))
    {
      console.error('called Graph.add_edge() with edge that already exists');
      return;
    }
    //let edge = new Edge(orig_vert, dest_vert, weight);
    this.edge_list.push(edge);
    this.adjacency_list[edge.orig].push(edge);
    this.adjacency_list[edge.dest].push(edge);
  }
  add_vertex(vert)
  {
    if(this.adjacency_list.hasOwnProperty(vert))
    {
      console.error('called Graph.add_vertex() on already existing vertex');
      return;
    }
    this.adjacency_list[vert] = [];
  }
  get_adjacency_list()
  {
    return this.adjacency_list;
  }
  get_vertices()
  {
    return Object.keys(this.adjacency_list);
  }
  get_edges()
  {
    return this.edge_list;
  }
  get_incident_edges(vertex)
  {
    return this.adjacency_list[vertex];
  }
  has_vertex = (vertex) => {
    console.log('HAS_VERTEX')
    return this.adjacency_list.hasOwnProperty(vertex);
  }
}

class GraphContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {};
    let vertex_list = ['A', 'B', 'C', 'D', 'E', 'F'];
    let edge_list = [new Edge('A', 'B'), new Edge('A', 'F'), new Edge('B', 'E'), new Edge('B', 'D'), new Edge('C', 'D'), new Edge('E', 'F'), new Edge('F', 'B')];
    this.state.graph = new Graph(vertex_list, edge_list);
    console.log('CONSTRUCTED');
    this.state.func = null;   // TODO is this used???
    this.state.func_context = {
      active_func_ref: null,
      context: {
        generator_obj: null,
        last_return_val: null
      }
    }

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

  DFS_wrapper_func = (search_val) => {
    return depth_first_search(this.state.graph, 'A', search_val);
  };

  BFS_wrapper_func = (search_val) => {
    return breadth_first_search(this.state.graph, 'A', search_val);
  };

  render()
  {
    const button_el_arr =
    [
      <TextInputButton2 initialValue={'C'} updateContainerCallback={this.update_func_context} 
                        assignedFunction={this.BFS_wrapper_func} 
                        functionContext={this.state.func_context} 
                        inputTranslationFunc={(button_val) => button_val} 
                        inputValidatorFunc={this.state.graph.has_vertex}>
        BREADTH FIRST SEARCH
      </TextInputButton2>,
      <TextInputButton2 initialValue={'C'} updateContainerCallback={this.update_func_context} 
                        assignedFunction={this.DFS_wrapper_func} 
                        functionContext={this.state.func_context} 
                        inputTranslationFunc={(button_val) => button_val} 
                        inputValidatorFunc={this.state.graph.has_vertex}>
        DEPTH FIRST SEARCH
      </TextInputButton2>
    ];
    return (
      <div className='tree-container'>
        <GraphView graphObj={this.state.graph} context={this.state.func_context.context.last_return_val == null ? this.state.func_context.context.last_return_val : this.state.func_context.context.last_return_val.value}/>
        <ButtonContainer buttonElementArr={button_el_arr} />
      </div>
    );
  }
}



export {GraphContainer, Edge};
