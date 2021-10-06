
// TODO use z-index so that the lines and list nodes overlap properly 
// if can't get the z-index working, just change x2 so that it lines up with the left side of the next node
// mess with the z-indexes on the line-containers and the list-node

// TODO should re-write this to be more like tree/graph views??
function LinkedListView(props)
{
  let list_node_z_index = 1;
  let length = props.linkedList.node_count;
  let list_nodes = [];
  let node = props.linkedList.head;
  //for(let i=0; i<length; i++)
  while(node)
  {
    let color_class_str = 'default-list-node';
    if(props.funcContext)
    {
      if(props.funcContext.red_node && node === props.funcContext.red_node)
      {
        color_class_str = 'red-list-node';
      }
      else if(props.funcContext.blue_node && node === props.funcContext.blue_node)
      {
        color_class_str = 'blue-list-node';
      }
      else if(props.funcContext.green_node && node === props.funcContext.green_node)
      {
        color_class_str = 'green-list-node';
      }
    }

    list_nodes.push(
      (
        <div className="list-node-container">
          <div className={"list-node " + color_class_str} style={{zIndex: list_node_z_index}}>
            <div className="val-box"> {node.val} </div>
          </div>
        </div>
      )
    );
    list_node_z_index += 2;
    node = node.next;
  }

  let dist = 100/length;
  let start = 100/(length*2); 
  let x1 = start;
  let x2 = x1+dist;
  let line_container_z_index = 2;

  let lines = [];
  node = props.linkedList.head;
  for(let i=0; i<length-1; i++)
  {
    let x1_str = `${x1}%`;
    let x2_str = `${x2}%`;
    lines.push(
      (
        <svg className="line-container" style={{zIndex: line_container_z_index}}>
          <line id="z-test" class="svg-line" x1={x1_str} y1="52%" x2={x2_str} y2="50%" />
        </svg>
      )
    );
    line_container_z_index += 2;
    x1 = x2;
    x2 += dist;
  }

  return (
    <div className="linked-list">
      {list_nodes.map((node, index) => {
        return node;
      })}
      {lines.map((line, index) => {
        return line;
      })}
    </div>
  );
}

export default LinkedListView;