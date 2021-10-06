
function Line(props)
{
  return (
    <svg className="line-container">
      <line class="svg-line" x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} />
    </svg>
  );
}

export default Line;
