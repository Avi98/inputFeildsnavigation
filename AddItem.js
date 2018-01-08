import cookie from 'react-cookies';
import styled from 'styled-components';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Drawer, MenuItem } from 'material-ui/';

import { ListHeader } from '../containers';
import { Cancel, HandShake, Discount, Rupees } from '../images';
import { COMPANY_ID, I_USER_ID } from '../constants';
import { setValidationRules, validate } from '../utils';
import { Button, TextInputField, Dropdown } from '../components';
import fiberDvr from 'material-ui/svg-icons/av/fiber-dvr';
import description from 'material-ui/svg-icons/action/description';

const Fields = styled.div`
  display: flex;
  padding: 30px 30px 0px 30px;
  justify-content: space-between;
`;

const ButtonPostion = styled.div`
  width: 100%;
  display: flex;
  padding-top: 60px;
  align-items: center;
  justify-content: center;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Img = styled.img`
  height: 15px;
  weidth: 15px;
  padding: 30px 0px 0px 10px;
  &: hover {
    cursor: pointer;
  }
`;
const FormValidationRules = {
  name: ['notEmpty'],
  unitSellPrice: ['notEmpty'],
  unit: ['notEmpty', 'weightUnits']
};

class AddItem extends Component {
  state = {
    payload: {
      hsn: '',
      name: '',
      unit: '',
      skuBarcode: '',
      description: '',
      availableQty: '',
      taxPercentage: '',
      unitSellPrice: '',
      discountPercentage: ''
    },
    itemFormValidations: {},
    iUserId: cookie.load(I_USER_ID),
    iCompanyId: cookie.load(COMPANY_ID)
  };

  componentDidMount() {
    setValidationRules(FormValidationRules);
  }

  componentWillReceiveProps(nextProps) {
    const { clearAddItemFormFields } = nextProps;

    if (clearAddItemFormFields) {
      this.getInitialState();
    }
  }

  getInitialState() {
    this.setState({
      payload: {
        hsn: '',
        name: '',
        unit: '',
        skuBarcode: '',
        description: '',
        availableQty: '',
        taxPercentage: '',
        unitSellPrice: '',
        discountPercentage: ''
      },
      iconChange: false
    });
  }

  validateFormFields() {
    const { name, unitSellPrice, unit } = this.state.payload;

    let validatorFlag = true;

    validatorFlag &= validate(this, 'name', name, 'itemFormValidations');
    validatorFlag &= validate(this, 'unit', unit, 'itemFormValidations');
    validatorFlag &= validate(this, 'unitSellPrice', unitSellPrice, 'itemFormValidations');

    return validatorFlag;
  }

  onKeyPress(e, feildName) {
    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
      let focusName = this.moveToField(e, feildName);
      let targetField = this['input' + this.capitalizeFirstLetter(focusName)];

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
    // locate index of existing key
    // left then increment j
    // right then decrement j
    // up then decrement i
    // down then decrement i
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
    console.log('first right if');
    console.log('i'+i+'j'+j);
    if (typeof navigationArr[i][j + 1] !== 'undefined') {
      nextItemToFocus = navigationArr[i][j + 1];

    }
     else {
      nextItemToFocus = navigationArr[i + 1][j - 1];
    }
    console.log('nextItemToFocus',nextItemToFocus)
    return nextItemToFocus;
  }

  left(nextItemToFocus, navigationArr, i, j) {
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
    const { openAddItem, itemCloseClick } = this.props;

    return (
      <Drawer width="45%" docked={false} openSecondary={true} open={openAddItem}>
        <ListHeader
          imgWidth="15px"
          imgHeight="15px"
          title="Add Items"
          icon={Cancel}
          to="#"
          onClick={itemCloseClick}
        />
        <Fields>
          <TextInputField
            id="nameItems"
            width="220px"
            hint="Invock"
            labelSize="2px"
            imgSrc={HandShake}
            value={this.state.payload.name}
            labelText="Name*"
            inputRef={input => (this.inputName = input)}
            onKeyUp={e => this.onKeyPress(e, 'name')}
            onBlur={event => validate(this, 'name', event.target.value, 'itemFormValidations')}
            errorText={
              this.state.itemFormValidations.name && !this.state.itemFormValidations.name.isValid
                ? this.state.itemFormValidations.name.message
                : ''
            }
            onChange={value =>
              this.setState({
                payload: {
                  ...this.state.payload,
                  name: value
                }
              })
            }
          />
          <TextInputField
            id="SkuCode"
            width="220px"
            hint="ASODFH89FDF5S"
            labelSize="2%"
            imgSrc={HandShake}
            labelText="Sku Code"
            inputRef={input => {
              this.inputSku = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'sku');
            }}
            value={this.state.payload.skuBarcode}
            onChange={value =>
              this.setState({
                payload: {
                  ...this.state.payload,
                  skuBarcode: value.toUpperCase()
                }
              })
            }
          />
        </Fields>

        <Fields>
          <TextInputField
            id="sellPrice"
            width="220px"
            hint="20"
            labelSize="2px"
            imgSrc={HandShake}
            inputRef={input => {
              this.inputSell = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'sell');
            }}
            labelText="Sell Price*"
            errorText={
              this.state.itemFormValidations.unitSellPrice &&
              !this.state.itemFormValidations.unitSellPrice.isValid
                ? this.state.itemFormValidations.unitSellPrice.message
                : ''
            }
            onBlur={event =>
              validate(this, 'unitSellPrice', event.target.value, 'itemFormValidations')
            }
            onChange={value => {
              let tempValue = parseInt(value, 10);
              this.setState({
                payload: {
                  ...this.state.payload,
                  unitSellPrice: isNaN(tempValue) ? '' : tempValue
                }
              });
            }}
          />
          <TextInputField
            id="units"
            width="220px"
            labelSize="2%"
            labelText="Unit*"
            imgSrc={HandShake}
            hint="pcs/gms/kgs"
            inputRef={input => {
              this.inputUnits = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'units');
            }}
            value={this.state.payload.unit}
            errorText={
              this.state.itemFormValidations.unit && !this.state.itemFormValidations.unit.isValid
                ? this.state.itemFormValidations.unit.message
                : ''
            }
            onBlur={event => validate(this, 'unit', event.target.value, 'itemFormValidations')}
            onChange={value =>
              this.setState({
                payload: {
                  ...this.state.payload,
                  unit: value
                }
              })
            }
          />
        </Fields>

        <Fields>
          <TextInputField
            id="desciption"
            width="486px"
            hint="Invock"
            labelSize="2px"
            imgSrc={HandShake}
            value={this.state.payload.description}
            inputRef={input => {
              this.inputDescription = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'description');
            }}
            labelText="Description"
            onChange={value =>
              this.setState({
                payload: {
                  ...this.state.payload,
                  description: value
                }
              })
            }
          />
        </Fields>

        <Fields>
          <TextInputField
            id="hsnCode"
            width="220px"
            hint="Invock"
            labelSize="2px"
            imgSrc={HandShake}
            value={this.state.payload.hsn}
            onFocus={t => console.log(t)}
            inputRef={input => {
              this.inputHsn = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'hsn');
            }}
            labelText="HSN Code"
            onChange={value =>
              this.setState({
                payload: {
                  ...this.state.payload,
                  hsn: value.toUpperCase()
                }
              })
            }
          />

          <Dropdown
            id="tax"
            width="220px"
            hint="Invock"
            labelSize="2%"
            imgSrc={HandShake}
            labelText="tax"
            onKeyUp={e => this.onKeyPress(e, 'tax')}
            value={this.state.payload.taxPercentage}
            inputRef={select => (this.inputTax = select)}
            onChange={value =>
              this.setState({
                payload: {
                  ...this.state.payload,
                  taxPercentage: value
                }
              })
            }
          >
            <MenuItem value="3%" primaryText="GST @ 3%"  inputRef={select => (this.inputTax = select)} />
            <MenuItem value="5%" primaryText="GST @ 5%" />
            <MenuItem value="12%" primaryText="GST @ 12%" />
            <MenuItem value="18%" primaryText="GST @ 18%" />
            <MenuItem value="28%" primaryText="GST @ 28%" />
          </Dropdown>
        </Fields>

        <Fields>
          <TextInputField
            id="availableQuantity"
            width="220px"
            hint="22"
            labelSize="2px"
            imgSrc={HandShake}
            labelText="Available Quantity"
            value={this.state.payload.availableQty}
            inputRef={input => {
              this.inputAvailableQty = input;
            }}
            onKeyUp={e => {
              this.onKeyPress(e, 'availableQty');
            }}
            onChange={value => {
              let tempValue = parseInt(value, 10);
              this.setState({
                payload: {
                  ...this.state.payload,
                  availableQty: isNaN(tempValue) ? '' : tempValue
                }
              });
            }}
          />

          <Flex>
            <TextInputField
              id="discount"
              width="190px"
              hint="30"
              labelSize="2%"
              imgSrc={HandShake}
              imgSrcSec={this.state.iconChange ? Discount : Rupees}
              iconHeight={'20px'}
              iconWeidth={'20px'}
              labelText="Discount"
              inputRef={input => {
                this.inputDiscountAmount = input;
              }}
              onKeyUp={e => {
                this.onKeyPress(e, 'discountAmount');
              }}
              value={this.state.payload.discountPercentage}
              OnClickImg={() =>
                this.setState({
                  iconChange: !this.state.iconChange
                })
              }
              onChange={value => {
                this.setState({
                  payload: {
                    ...this.state.payload,
                    discountPercentage: parseFloat(value) || ''
                  }
                });
              }}
            />
            <Img
              onClick={() => this.setState({ iconChange: !this.state.iconChange })}
              src={this.state.iconChange ? Discount : Rupees}
            />
          </Flex>
        </Fields>

        <ButtonPostion>
          <Button
            to="#"
            replace
            margintop="20px"
            onClick={() => {
              if (this.validateFormFields()) {
                this.props.saveButtonClick(this.state.payload);
              }
            }}
          >
            Save
          </Button>
        </ButtonPostion>
      </Drawer>
    );
  }
}

export default AddItem;
