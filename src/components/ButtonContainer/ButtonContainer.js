
function ButtonContainer(props)
{
  return (
    <div className='button-container'>
      { props.buttonElementArr.map(button_el => button_el) }
    </div>        
  );
}

export default ButtonContainer;
