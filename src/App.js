//import BubbleSortContainer from '../Sort/BubbleSortContainer/BubbleSortContainer';
// import logo from './logo.svg';
import './App.css';
import SideBar from './components/SideBar/SideBar';
import MainWindow from './components/MainWindow/MainWindow.js';
//import {BubbleSortContainer} from './components/SortContainer/SortContainer.js';
//import {BubbleSort} from './sort_functions';
import React from 'react';
import BubbleSortContainer from './components/Sort/BubbleSortContainer/BubbleSortContainer';

// TODO functionality for passing data from sidebar to MainWindow goes here
// use SideBar to select which MainWindow component to display
// right now it is hardcoded to display bubble sort container

// TODO is it necessary for MainWindow to be a component??
class App extends React.Component
{
  constructor(props)
  {
    super(props);
    //this.state = {};
    this.state = {mainWindowComp: <BubbleSortContainer/>, selectedButtonKey: 'bubble-sort'};
  }
  onSideBarSelection = (component, component_key) => {
    console.log(component);
    this.setState( {mainWindowComp: component} );
    this.setState( {selectedButtonKey: component_key} );
    //this.forceUpdate();
  }
  render()
  {
    return (
      <div className="App">
        <SideBar onSideBarSelection={this.onSideBarSelection} selectedButtonKey={this.state.selectedButtonKey}/>
        <MainWindow>
          {this.state.mainWindowComp}
        </MainWindow>
      </div>
    );
  }
}

export default App;
