import React from "react";
import ButtonContainer from "../../ButtonContainer/ButtonContainer";
import TextInputButton2 from "../../Buttons/TextInputButton2";
import LinkedListView from "../LinkedList/LinkedListView";

// TODO
function* insert(list, val)
{
  let last = list.last;
  yield {blue_node: last};
  last.next = new ListNode(val);
  list.last = last.next;
  list.node_count+=1;
  yield {red_node: last};
}

function* search(list, val)
{
  let node = list.head;
  while(node != null)
  {
    yield {blue_node: node};
    if(node.val === val)
    {
      yield {red_node: node};
      break;
    }
    node = node.next;
  }
}

function* remove(list, val)
{
  let prev_node = null;
  let node = list.head;
  while(node != null)
  {
    yield {blue_node: node, green_node: prev_node};
    if(node.val === val)
    {
      yield {red_node: node, green_node: prev_node};
      break;
    }
    prev_node = node;
    node = node.next;
  }

  if(node === null) return;
  if(node === list.head)
  {
    list.head = node.next;
  }
  else if(node === list.last)
  {
    list.last = prev_node;
  }

  if(prev_node) prev_node.next = node.next;
  node.next = null;

  list.node_count -=1;

  //swap around poitners
  // TODO NEED TO HAVE ACCESS TO PREV AND NEXT NODE HERE, RETHINK THIS FUNCTION
  yield {red_node: node};
}

// TODO make this work
// will require modifications to the LinkedListView class
// e.g. the svg lines won't work
/*
function* reverse(list)
{
  let prev = null;
  let curr = list.head;
  let next = null;;
  while(curr)
  {
    yield {green_node: prev, red_node: curr};
    if(!prev) // first node
    {
      list.last = curr;
    }

    if(!curr.next)  // last node
    {
      list.head = curr;
    }

    next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
}
*/


class ListNode
{
  constructor(val)
  {
    this.val = val;
    this.next = null;
  }
}

class LinkedList
{
  constructor(node_count)
  {
    this.last = null;
    this.head = this.create_linked_list(node_count);
    this.node_count = node_count;
    console.log('LINKED LIST CONSTRUCTOR');
    console.log(this);
  }

  create_linked_list(list_node_count, count=0)
  {
    if(count === list_node_count-1)
    {
      let node = new ListNode(count);
      this.last = node;
      return node;
    }

    let node = new ListNode(count);
    node.next = this.create_linked_list(list_node_count, count+1);
    return node;
  }
}

class TestLinkedListContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {list: new LinkedList(5)};
    this.state.func = null;  // TODO is this used??
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

  insert_wrapper_func = (val) => {
    return insert(this.state.list, val);
  };
  search_wrapper_func = (val) => {
    return search(this.state.list, val);
  };
  remove_wrapper_func = (val) => {
    return remove(this.state.list, val);
  };

  render()
  {
    const button_el_arr = 
    [
      <TextInputButton2 initialValue={5} updateContainerCallback={this.update_func_context} 
                        assignedFunction={this.insert_wrapper_func} 
                        functionContext={this.state.func_context} 
                        inputTranslationFunc={(button_val) => parseInt(button_val)} 
                        inputValidatorFunc={val => typeof val == 'number'}>
        INSERT
      </TextInputButton2>,
      <TextInputButton2 initialValue={5} updateContainerCallback={this.update_func_context} 
                        assignedFunction={this.search_wrapper_func} 
                        functionContext={this.state.func_context} 
                        inputTranslationFunc={(button_val) => parseInt(button_val)} 
                        inputValidatorFunc={val => typeof val == 'number'}>
        SEARCH
      </TextInputButton2>,
      <TextInputButton2 initialValue={5} updateContainerCallback={this.update_func_context} 
                        assignedFunction={this.remove_wrapper_func} 
                        functionContext={this.state.func_context} 
                        inputTranslationFunc={(button_val) => parseInt(button_val)} 
                        inputValidatorFunc={val => typeof val == 'number'}>
        REMOVE
      </TextInputButton2>,
    ];
    return (
      <div className='algo-container'>
        <LinkedListView linkedList={this.state.list} funcContext={this.state.func_context.context.last_return_val == null ? this.state.func_context.context.last_return_val : this.state.func_context.context.last_return_val.value}/>
        <ButtonContainer buttonElementArr={button_el_arr} />
      </div>
    );
  }
}


// TODO rename this file (LinkedListContainer)
// TODO convert the LinkedList to having a key value so that it can be identified even if it has duplicate values for 'val'
// TODO add reverse linked list
export default TestLinkedListContainer;
