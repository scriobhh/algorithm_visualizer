import './MainWindow.css';
import React from 'react';
// import BubbleSortContainer from '../Sort/BubbleSortContainer/BubbleSortContainer.js';

//let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// randomize list
//randomize_array(nums);

// TODO sort_gen is replaced with specific sort function
// MainWindow gets passed a sort function
// MainWindow initializes or chooses the array-container based on the sort function
// find out how to debug react code in browser tools
// figure out how to highlight different element for each sort iteration
// do we need a different array container for each sort type? maybe call it SortContainer or something
// draw legend on screen (e.g. [red-block] = pivot [grey-block] = current element etc.)
// allow arrayView to take values for pivot, curr_element, etc., and set default values for them for sorts that don't use them
// consider what to do for sorts that require multiple arrays (e.g. merge sort, radix sort) (probably implement sort containers with multiple array views)
// consider fact that mainwindow will have to contain things like trees, graphs, stacks, queues etc.

// NOTE react doesn't seem to like when you re-order things in place...
// re-orderings should be done by creating a new array and returning it, then setting the component state to the new array with setState()

//mainwindow -> sortcontainer -> arraycontainer

/* 
function* sort_gen(arr)
{
  while(true)
  {
    randomize_array(arr);
    console.log('ITERATOR');
    yield arr.slice();
  }
}
*/

// TODO binary tree view and graph view use 2 completely different approaches for drawing a bunch of vertices on screen
// binary trees uses HTML elements to contain nodes and uses css & html to arrange the elements
// graphs just have a big container and use geometry to figure out where to place everything in the container
// the graph approach is much easier to implement & debug, consider changing the binary tree to the graph way of doing things

// TODO switch all sort/search/wahtever containers to putting their buttons into something like a .button-container instead of sort-button-container (which only holds 1 button)
// TODO consider adding multi-color to array elements etc., maybe the currently selected elements get a more vibrant version of their color, and the already sorted elements get a duller version of their color??
// TODO add queue and stack (stack should be treated like LIFO queue) (have something at side of screen that displays the last entered object)
// TODO add heap
// TODO add linked list
// TODO AVL tree
// TODO red-black tree
// TODO hash map
// TODO rename heap to MaxHeap
// TODO add graph

// TODO remove console.logs
// TODO change default icon & page title
// TODO non-development deployment
// TODO clean up comments
// TODO cleanup MainWindow.css (it is bloated, has css for components that should be moved into their own file)

// TODO lots of code re-use, see:
/*
let it = insert(val, root.right);
let ob = it.next();
while(!ob.done) { yield ob.value; ob = it.next(); }
*/
// TODO and see the _step functions in Tree code

// TODO lots of re-use of css e.g. list-container, algo-container, tree-container
// TODO re-think hte file structure, lots of nested files that are maybe uncessary
// TODO consider making things like the sort containers and button containers their own react component
// TODO there are many components that are class componenets when they should probably just be function components

// TODO lots of compiler warnings, fix them

// TODO make unit tests for the algorithms/data structures

// TOOD make sure tabs/spaces/indentation is consistent across files

// rename graph stuff to UndirectedGraph

// TODO put const everywhere

// TODO make the graph view a proper circle (it is currently an elipse if the browser window is not square)
// (you will need to find the aspect ratio of hte screen, then use the aspect ratio to multiple the widith of the containing html element)

// TODO go through all TODOs in the code

function MainWindow(props)
{
    return (
      <div className="main-window">
        {props.children}
      </div>
    );
}

export default MainWindow;
