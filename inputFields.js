import React, { Component } from 'react';
import {TextField, SelectField, MenuItem} from 'material-ui/';

class AddItem extends Component {
  state = {
    }

  onKeyPress(e, feildName) {
    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
      let focusName = this.moveToField(e, feildName);
      let targetField = this[focusName];

      switch (focusName) {
        case 'tax':
          ReactDOM.findDOMNode(targetField)
            .querySelector('button')
            .focus();
          break;
        default:
          targetField.focus();
          console.log('case');
      }
    }
  }

  moveToField(e, key) {
    let navigationArr = [
      ['name', 'sku'],
      ['sell', 'units'],
      ['description'],
      ['hsn', 'tax'],
      ['availableQty', 'discountAmount']
    ];

    let nextItemToFocus;
    console.log(e.keyCode);
    for (let i = 0; i < navigationArr.length; i++) {
      for (let j = 0; j < navigationArr[i].length; j++) {
        if (navigationArr[i][j] === key) {
          switch (e.keyCode) {
            case 39:
              // right arrow key
              nextItemToFocus = this.right(nextItemToFocus, navigationArr, i, j);
              break;
            case 37 :
              // left arrow key
              nextItemToFocus = this.left(nextItemToFocus, navigationArr, i, j);
              break;
            case 13 :
              // left arrow key
              nextItemToFocus = this.left(nextItemToFocus, navigationArr, i, j);
              break;
            case 38:
              // up arrow key
              nextItemToFocus = this.up(nextItemToFocus, navigationArr, i, j);
              break;
            case 40:
              // down arrow key
              nextItemToFocus = this.down(nextItemToFocus, navigationArr, i, j);
              break;
            default:
              console.log('keyCode');
              break;
          }
        }
      }
    }
    return nextItemToFocus;
  }

  right(nextItemToFocus, navigationArr, i, j) {
    if (typeof navigationArr[i][j + 1] !== 'undefined') {
      console.log('first right if');
      nextItemToFocus = navigationArr[i][j + 1];
    }
     else {
      nextItemToFocus = navigationArr[i + 1][j - 1];
    }
    return nextItemToFocus;
  }

  left(nextItemToFocus, navigationArr, i, j) {
    debugger;
    if (typeof navigationArr[i][j - 1] !== 'undefined') {
      console.log('first left if');
      nextItemToFocus = navigationArr[i][j - 1];
    } else {
      nextItemToFocus = navigationArr[i-1][j+1];
    }
    return nextItemToFocus;
  }

  up(nextItemToFocus, navigationArr, i, j) {
    nextItemToFocus = navigationArr[i - 1][j];
    return nextItemToFocus;
  }

  down(nextItemToFocus, navigationArr, i, j) {
    nextItemToFocus = navigationArr[i + 1][j];
    return nextItemToFocus;
  }

  capitalizeFirstLetter(string) {
    console.log(string);
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {

    return (
        <div>
          <TextField
            id="nameItems"
            width="220px"
            hint="Invock"
            ref={input => (this.name = input)}
            onKeyUp={e => this.onKeyPress(e, 'name')}
          />

          <TextField
            id="SkuCode"
            width="220px"
            labelText="Sku Code"
            ref={input => {
              this.sku = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'sku');
            }}
          />

          <TextField
            id="sellPrice"
            width="220px"
            ref={input => {
              this.sell = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'sell');
            }}
            labelText="Sell Price*"
          />

          <TextField
            id="units"
            width="220px"
            labelText="Unit*"
            ref={input => {
              this.units = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'units');
            }}
            value={this.state.payload.unit}
          />

        <Fields>
          <TextField
            id="desciption"
            value={this.state.payload.description}
            ref={input => {
              this.description = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'description');
            }}
          />
        </Fields>

        <Fields>
          <TextField
            lableText="hsn"
            ref={input => {
              this.hsn = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'hsn');
            }}
            labelText="HSN Code"
          />

          <SelectField
            labelText="tax"
            onKeyUp={e => this.onKeyPress(e, 'tax')}
            value={this.state.payload.taxPercentage}
            ref={select => (this.tax = select)}
          >
            <MenuItem value="3%" primaryText="GST @ 3%" />
            <MenuItem value="5%" primaryText="GST @ 5%" />
            <MenuItem value="12%" primaryText="GST @ 12%" />
            <MenuItem value="18%" primaryText="GST @ 18%" />
            <MenuItem value="28%" primaryText="GST @ 28%" />
          </SelectField>
        </Fields>

          <TextField
            id="availableQuantity"
            width="220px"
            labelText="Available Quantity"
            value={this.state.payload.availableQty}
            ref={input => {
              this.availableQty = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'availableQty');
            }}
          />

            <TextField
              id="discount"
              width="190px"
              labelText="Discount"
              ref={input => {
                this.inputDiscountAmount = input;
              }}
              onKeyUp={e => {
                this.onKeyPress(e, 'discountAmount');
              }}
            />
        </div>


    );
  }
}

export default AddItem;
