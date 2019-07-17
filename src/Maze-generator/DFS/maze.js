/**
 * @author Michael Wilson
 * @description Just a fun little project that I decided to tackle after work.
 * @version 1.0.1
 */

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

  /**
   * @method generateGrid
   *
   * @description Creates an MxN grid.
   */
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

  /**
   * @method generateMaze
   *
   * @description Utilizes DFS to generate a maze.
   */
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

  /**
   * @method validNeighbor
   *
   * @description Checks to see if the neighbor is unvisited and within the bounds of the graph.
   *
   * @param {int[]} neighbor
   * @param {Set} visitedSet
   */
  validNeighbor(neighbor, visitedSet) {
    return (
      !visitedSet.has(this.convertToId(neighbor)) &&
      neighbor[0] < this.state.height &&
      neighbor[0] >= 0 &&
      neighbor[1] < this.state.width &&
      neighbor[1] >= 0
    );
  }

  /**
   * @method parseLocation
   *
   * @description Converts a string of coordinates to the numeric value.
   *
   * @param {string} stringCoordinates
   */
  parseLocation(stringCoordinates) {
    let values = stringCoordinates.split(",");
    let row = parseInt(values[0].replace(/[^\d]/, ""));
    let col = parseInt(values[1].replace(/[^\d]/, ""));
    return [row, col];
  }

  /**
   * @method convertToId
   *
   * @description Converts a pair of coordinates to the appropriate ID.
   *
   * @param {coordinates} numbericCoordinates
   */
  convertToId(numbericCoordinates) {
    return "(" + numbericCoordinates[0] + "," + numbericCoordinates[1] + ")";
  }

  /**
   * @method getNeighbors
   *
   * @description Gets the corresponding neighbors to the current cell.
   *
   * @param {int} row
   * @param {int} col
   */
  getNeighbors(row, col) {
    let top = [row - 1, col];
    let right = [row, col + 1];
    let bottom = [row + 1, col];
    let left = [row, col - 1];
    return [top, right, bottom, left];
  }

  /**
   * @method breakWall
   *
   * @description Notes the previous direction to the current cell and breaks down the appropriate wall.
   *
   * @param {int} row
   * @param {int} col
   * @param {coordinates} neighbor
   * @param {HTMLTableCellElement} currCell
   * @param {HTMLTableCellElement} neighborCell
   */
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
