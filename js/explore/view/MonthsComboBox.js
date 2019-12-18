// Copyright 2019, University of Colorado Boulder

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
  const MONTH_STRINGS = [

    // these muse be in order of occurrence, not sorted alphabetically
    require( 'string!NUMBER_LINE_INTEGERS/january' ),
    require( 'string!NUMBER_LINE_INTEGERS/february' ),
    require( 'string!NUMBER_LINE_INTEGERS/march' ),
    require( 'string!NUMBER_LINE_INTEGERS/april' ),
    require( 'string!NUMBER_LINE_INTEGERS/may' ),
    require( 'string!NUMBER_LINE_INTEGERS/june' ),
    require( 'string!NUMBER_LINE_INTEGERS/july' ),
    require( 'string!NUMBER_LINE_INTEGERS/august' ),
    require( 'string!NUMBER_LINE_INTEGERS/september' ),
    require( 'string!NUMBER_LINE_INTEGERS/october' ),
    require( 'string!NUMBER_LINE_INTEGERS/november' ),
    require( 'string!NUMBER_LINE_INTEGERS/december' )
  ];

  // constants
  const COMBO_BOX_ITEM_OPTIONS = { font: new PhetFont( 16 ), maxWidth: 100 };

  class MonthsComboBox extends ComboBox {

    /**
     * @param {NumberProperty} monthProperty
     * @param {Node} listParent - node which the ComboBoxListBox will be added
     * @param {object} options
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
