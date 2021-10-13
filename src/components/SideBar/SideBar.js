import BubbleSortContainer from '../Sort/BubbleSortContainer/BubbleSortContainer';
import MergeSortContainer from '../Sort/MergeSortContainer/MergeSortContainer';
import QuickSortContainer from '../Sort/QuickSortContainer/QuickSortContainer';
import RadixSortContainer from '../Sort/RadixSortContainer/RadixSortContainer.js';
import LinearSearchContainer from '../Search/LinearSearchContainer/LinearSearchContainer';
import BinarySearchContainer from '../Search/BinarySearchContainer/BinarySearchContainer';
import BinarySearchTree from '../Tree/BinarySearchTree/BinarySearchTree.js';
import LinkedListContainer from '../List/LinkedList/LinkedListContainer';
import HeapContainer from '../Heap/HeapContainer/HeapContainer';
import {GraphContainer} from '../Graph/GraphContainer/GraphContainer';
import './SideBar.css';
//import {BubbleSort, QuickSort, MergeSort, RadixSort} from '../../sort_functions';


// TODO move these <button>s to their own components
// make a way for the MainWindow to change which button is selected

function SideBarButton(props)
{
  return (
    <button onClick={() => props.onSelect(props.componentToLink, props.key_)} key={props.key_} className="select-algo" type="button" id={props.id}>{props.children}</button>
  );
}
function SideBar(props)
{
  // add new entries here
  let button_states =
  [
    {
      componentToLink: <BubbleSortContainer/>,
      key: 'bubble-sort',
      text: 'Bubble Sort'
    },

    {
      componentToLink: <MergeSortContainer/>,
      key: 'merge-sort',
      text: 'Merge Sort'
    },

    {
      componentToLink: <QuickSortContainer/>,
      key: 'quick-sort',
      text: 'Quick Sort'
    },

    {
      componentToLink: <RadixSortContainer/>,
      key: 'radix-sort',
      text: 'Radix Sort'
    },

    {
      componentToLink: <LinearSearchContainer/>,
      key: 'linear-search',
      text: 'Linear Search'
    },

    {
      componentToLink: <BinarySearchContainer/>,
      key: 'binary-search',
      text: 'Binary Search'
    },

    {
      componentToLink: <BinarySearchTree/>,
      key: 'binary-search-tree',
      text: 'Binary Search Tree'
    },

    {
      componentToLink: <HeapContainer/>,
      key: 'heap',
      text: 'Heap'
    },

    {
      componentToLink: <LinkedListContainer/>,
      key: 'test-linked-list',
      text: 'Test Linked List'
    },

    {
      componentToLink: <GraphContainer/>,
      key: 'graph',
      text: 'Graph'
    },

  ];
  return (
    <div className="sidebar">
      {button_states.map((state, ind) => {
        let id='';
        console.log(`key: ${state.key}`);
        if(state.key === props.selectedButtonKey)
        {
          id = 'selected-algo' 
        }
        return <SideBarButton onSelect={props.onSideBarSelection} componentToLink={state.componentToLink} key_={state.key} id={id}>{state.text}</SideBarButton>;
      })}
    </div>
  );
  /*
  return (
    <div className="sidebar">
      <button onClick={() => onSelect(<BubbleSortContainer/>)} className="select-algo" type="button">Bubble Sort</button>
      <button onClick={() => onSelect(<QuickSortContainer/>)} className="select-algo" type="button">Quick Sort</button>
      <button onClick={() => onSelect(<MergeSortContainer/>)} className="select-algo" type="button">Merge Sort</button>
      <button onClick={() => onSelect(<RadixSortContainer/>)} className="select-algo" id="selected-algo" type="button">Radix Sort</button>
      <button onClick={() => onSelect()} className="select-algo" type="button">Linear Search</button>
      <button onClick={() => onSelect()} className="select-algo" type="button">Binary Search</button>
    </div>
  );
  */
}

export default SideBar;
