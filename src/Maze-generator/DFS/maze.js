import React, { Component } from "react";
import "./maze.css";
var prevCell = "";
var currCell = "";

export default class Maze extends Component {
  constructor() {
    super();
    this.state = {
      height: 10,
      width: 10
    };
    this.generateMaze = this.generateMaze.bind(this);
    this.validNeighbor = this.validNeighbor.bind(this);
    this.convertToId = this.convertToId.bind(this);
    this.getNeighbors = this.getNeighbors.bind(this);
    this.breakWall = this.breakWall.bind(this);
  }

  generateGrid() {
    let rows = [];
    for (var row = 0; row < this.state.height; row++) {
      let cols = [];
      for (var col = 0; col < this.state.width; col++) {
        cols.push(
          <td
            id={`(${row},${col})`}
            key={`(${row},${col})`}
            className="cell untouched-cell"
          />
        );
      }
      rows.push(<tr key={row}>{cols}</tr>);
    }
    return rows;
  }

  generateMaze() {
    var start = "(0,0)";
    let visited = new Set();
    let stack = [];
    stack.push(start);
    while (stack.length > 0) {
      let currentCell = stack.pop();
      currCell = currentCell;
      if (!visited.has(currentCell)) {
        let cellToModify = document.getElementById(currentCell);
        cellToModify.classList.remove("untouched-cell");
        cellToModify.className += " touched-cell";
        visited.add(currentCell);

        let row,
          col = this.parseLocation(currentCell);
        row = col[0];
        col = col[1];
        // break down the walls
        if (prevCell !== "") {
          let k,
            i = this.parseLocation(prevCell);
          let neighbor = [];
          neighbor[0] = i[0];
          neighbor[1] = i[1];
          this.breakWall(
            row,
            col,
            neighbor,
            document.getElementById(currCell),
            document.getElementById(prevCell)
          );
        }

        // explore the possible neighbors
        this.shuffleArray(this.getNeighbors(row, col)).forEach(neighbor => {
          if (this.validNeighbor(neighbor, visited)) {
            let coordinates = this.convertToId(neighbor);
            stack.push(coordinates);
          }
        });
        prevCell = currentCell;
      }
    }
  }

  validNeighbor(neighbor, visitedSet) {
    return (
      !visitedSet.has(this.convertToId(neighbor)) &&
      neighbor[0] < 10 &&
      neighbor[0] >= 0 &&
      neighbor[1] < 10 &&
      neighbor[1] >= 0
    );
  }

  parseLocation(stringCoordinates) {
    let values = stringCoordinates.split(",");
    let row = parseInt(values[0].replace(/[^\d]/, ""));
    let col = parseInt(values[1].replace(/[^\d]/, ""));
    return [row, col];
  }

  convertToId(numbericCoordinates) {
    return "(" + numbericCoordinates[0] + "," + numbericCoordinates[1] + ")";
  }

  getNeighbors(row, col) {
    let top = [row - 1, col];
    let right = [row, col + 1];
    let bottom = [row + 1, col];
    let left = [row, col - 1];
    return [top, right, bottom, left];
  }

  // Find out which wall to break down
  breakWall(row, col, neighbor, currCell, neighborCell) {
    // top wall?
    if (row - 1 === neighbor[0] && col === neighbor[1]) {
      currCell.style.borderTop = "0";
      neighborCell.style.borderBottom = "0";
    }

    // right wall?
    else if (row === neighbor[0] && col + 1 === neighbor[1]) {
      currCell.style.borderRight = "0";
      neighborCell.style.borderLeft = "0";
    }

    // bottom wall?
    else if (row + 1 === neighbor[0] && col === neighbor[1]) {
      currCell.style.borderBottom = "0";
      neighborCell.style.borderTop = "0";
    }

    // left wall?
    else {
      currCell.style.borderLeft = "0";
      neighborCell.style.borderRight = "0";
    }
  }

  render() {
    return (
      <div className="container">
        <table>
          <tbody>{this.generateGrid()}</tbody>
        </table>
        <button onClick={this.generateMaze}>Generate Maze!</button>
      </div>
    );
  }
}
