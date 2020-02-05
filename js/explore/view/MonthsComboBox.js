// Copyright 2019-2020, University of Colorado Boulder

/**
 * A combo box that can be used to change the month of the year for the map in the Temperature scene
 *
 * @author Arnab Purkayastha
 */
define( require => {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const merge = require( 'PHET_CORE/merge' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const januaryString = require( 'string!NUMBER_LINE_INTEGERS/january' );
  const februaryString = require( 'string!NUMBER_LINE_INTEGERS/february' );
  const marchString = require( 'string!NUMBER_LINE_INTEGERS/march' );
  const aprilString = require( 'string!NUMBER_LINE_INTEGERS/april' );
  const mayString = require( 'string!NUMBER_LINE_INTEGERS/may' );
  const juneString = require( 'string!NUMBER_LINE_INTEGERS/june' );
  const julyString = require( 'string!NUMBER_LINE_INTEGERS/july' );
  const augustString = require( 'string!NUMBER_LINE_INTEGERS/august' );
  const septemberString = require( 'string!NUMBER_LINE_INTEGERS/september' );
  const octoberString = require( 'string!NUMBER_LINE_INTEGERS/october' );
  const novemberString = require( 'string!NUMBER_LINE_INTEGERS/november' );
  const decemberString = require( 'string!NUMBER_LINE_INTEGERS/december' );
  
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

  return numberLineIntegers.register( 'MonthsComboBox', MonthsComboBox );
} );
