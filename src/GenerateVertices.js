import Node from './components/Node/Node';

function normalized_coords_to_screen_space_coords(point)
{
  let ret = {
    x: point.x*100,
    y: point.y*100
  };
  return ret;
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
function get_normalized_coords_to_screenspace_coords(normalized_node_coords_map)
{
  let vertex_screenspace_coords_map = {};
  Object.entries(normalized_node_coords_map).forEach((entry, ind) => {
    let key = entry[0];
    let normalized_coords = entry[1];
    let screen_space_coords = normalized_coords_to_screen_space_coords(normalized_coords);
    vertex_screenspace_coords_map[key] = screen_space_coords;
  });
  return vertex_screenspace_coords_map;
}

function generate_vertex_list(node_list, vertex_screenspace_coords_list, context, container_width)
{
  let el_list = Object.entries(node_list).map((entry, ind) => {
    let key = parseInt(entry[0]);
    let node_val = entry[1];
    // TODO this circle_class code is duplicated in BinaryTreeView
    let circle_class = 'default-circle';
    if(context)
    {
      if(context.red_node_set && context.red_node_set.has(key))
      {
        circle_class = 'red-circle';
      }
      if(context.blue_node_set && context.blue_node_set.has(key))
      {
        circle_class = 'blue-circle';
      }
      if(context.green_node_set && context.green_node_set.has(key))
      {
        circle_class = 'green-circle';
      }
      if(context.dark_blue_node_set && context.dark_blue_node_set.has(key))
      {
        circle_class = 'dark-blue-circle';
      }
    }
    let coords = vertex_screenspace_coords_list[key];
    let point = vertex_point_center(coords, container_width, 50);
    let x = `${point.x}%`;
    let y = `${point.y}%`;
    return (
      <Vertex circleClass={circle_class} left={x} top={y}>{node_val}</Vertex>
    );
  });
  return el_list;
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

export {generate_vertex_list, get_normalized_coords_to_screenspace_coords};
