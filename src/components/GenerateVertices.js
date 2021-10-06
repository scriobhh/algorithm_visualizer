import Node from './Node/Node';

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

// TODO rename node_normlaized_coords to map
function generate_node_list(node_list, node_normalized_coords, context, container_width)
{

  let vertex_screenspace_coords_list = {};
  node_list.forEach((el, ind) => {
    let coords = node_normalized_coords[el];
    coords = normalized_coords_to_screen_space_coords(coords);
    vertex_screenspace_coords_list[el] = coords;
  });

  let el_list = node_list.map((el, ind) => {
    // TODO this circle_class code is duplicated in BinaryTreeView
    let circle_class = 'default-circle';
    if(context)
    {
      if(context.red_node_set && context.red_node_set.has(el))
      {
        circle_class = 'red-circle';
      }
      if(context.blue_node_set && context.blue_node_set.has(el))
      {
        circle_class = 'blue-circle';
      }
      if(context.green_node_set && context.green_node_set.has(el))
      {
        circle_class = 'green-circle';
      }
      if(context.dark_blue_node_set && context.dark_blue_node_set.has(el))
      {
        circle_class = 'dark-blue-circle';
      }
    }
    let coords = vertex_screenspace_coords_list[el];
    let point = vertex_point_center(coords, container_width, 50);
    let x = `${point.x}%`;
    let y = `${point.y}%`;
    return (
      <Vertex circleClass={circle_class} left={x} top={y}>{el}</Vertex>
    );
  });

  return el_list;
}

export default generate_node_list;