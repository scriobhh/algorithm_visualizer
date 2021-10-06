
/* TODO is it necessary to make centerX & centerY programmable ??? shouldn't they just be the exact same every time??? */
function Node(props)
{
  return(
    <div className='node-container'>
      <svg class="node-circle">
        <circle class={props.circleClass} r='20px' cy={props.centerY} cx={props.centerX} stroke-width="2" />
      </svg>
      <div class="val-container">
        { props.nodeValue }
      </div>
    </div>
  );
}

export default Node;