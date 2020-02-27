// Copyright 2019-2020, University of Colorado Boulder

/**
 * A combo box that can be used to change the month of the year for the map in the Temperature scene
 *
 * @author Arnab Purkayastha
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import numberLineIntegersStrings from '../../number-line-integers-strings.js';
import numberLineIntegers from '../../numberLineIntegers.js';

const januaryString = numberLineIntegersStrings.january;
const februaryString = numberLineIntegersStrings.february;
const marchString = numberLineIntegersStrings.march;
const aprilString = numberLineIntegersStrings.april;
const mayString = numberLineIntegersStrings.may;
const juneString = numberLineIntegersStrings.june;
const julyString = numberLineIntegersStrings.july;
const augustString = numberLineIntegersStrings.august;
const septemberString = numberLineIntegersStrings.september;
const octoberString = numberLineIntegersStrings.october;
const novemberString = numberLineIntegersStrings.november;
const decemberString = numberLineIntegersStrings.december;

const MONTH_STRINGS = [

  // these must be in order of occurrence, not sorted alphabetically
  januaryString,
  februaryString,
  marchString,
  aprilString,
  mayString,
  juneString,
  julyString,
  augustString,
  septemberString,
  octoberString,
  novemberString,
  decemberString
];

// constants
const COMBO_BOX_ITEM_OPTIONS = { font: new PhetFont( 16 ), maxWidth: 100 };

class MonthsComboBox extends ComboBox {

  /**
   * @param {NumberProperty} monthProperty
   * @param {Node} listParent - node which the ComboBoxListBox will be added
   * @param {Object} [options]
   * @public
   */
  constructor( monthProperty, listParent, options ) {

    options = merge( {
      xMargin: 13,
      yMargin: 6
    }, options );

    const comboBoxItems = [];
    MONTH_STRINGS.forEach( ( monthString, index ) => {
      comboBoxItems.push( new ComboBoxItem( new Text( monthString, COMBO_BOX_ITEM_OPTIONS ), index + 1 ) );
    } );

    super( comboBoxItems, monthProperty, listParent, options );
  }
}

numberLineIntegers.register( 'MonthsComboBox', MonthsComboBox );
export default MonthsComboBox;