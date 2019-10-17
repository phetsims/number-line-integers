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
  const aprilString = require( 'string!NUMBER_LINE_INTEGERS/april' );
  const augustString = require( 'string!NUMBER_LINE_INTEGERS/august' );
  const decemberString = require( 'string!NUMBER_LINE_INTEGERS/december' );
  const februaryString = require( 'string!NUMBER_LINE_INTEGERS/february' );
  const januaryString = require( 'string!NUMBER_LINE_INTEGERS/january' );
  const julyString = require( 'string!NUMBER_LINE_INTEGERS/july' );
  const juneString = require( 'string!NUMBER_LINE_INTEGERS/june' );
  const marchString = require( 'string!NUMBER_LINE_INTEGERS/march' );
  const mayString = require( 'string!NUMBER_LINE_INTEGERS/may' );
  const novemberString = require( 'string!NUMBER_LINE_INTEGERS/november' );
  const octoberString = require( 'string!NUMBER_LINE_INTEGERS/october' );
  const septemberString = require( 'string!NUMBER_LINE_INTEGERS/september' );

  // constants
  const itemOptions = { font: new PhetFont( 16 ) };

  class MonthsComboBox extends ComboBox {

    /**
     * @param {EnumerationProperty} monthProperty
     * @param {Node} listParent - node which the ComboBoxListBox will be added
     * @param {object} options
     */
    constructor( monthProperty, listParent, options ) {

      options = merge( {
        xMargin: 13,
        yMargin: 6
      }, options );

      const items = [
        new ComboBoxItem( new Text( januaryString, itemOptions ), 1 ),
        new ComboBoxItem( new Text( februaryString, itemOptions ), 2 ),
        new ComboBoxItem( new Text( marchString, itemOptions ), 3 ),
        new ComboBoxItem( new Text( aprilString, itemOptions ), 4 ),
        new ComboBoxItem( new Text( mayString, itemOptions ), 5 ),
        new ComboBoxItem( new Text( juneString, itemOptions ), 6 ),
        new ComboBoxItem( new Text( julyString, itemOptions ), 7 ),
        new ComboBoxItem( new Text( augustString, itemOptions ), 8 ),
        new ComboBoxItem( new Text( septemberString, itemOptions ), 9 ),
        new ComboBoxItem( new Text( octoberString, itemOptions ), 10 ),
        new ComboBoxItem( new Text( novemberString, itemOptions ), 11 ),
        new ComboBoxItem( new Text( decemberString, itemOptions ), 12 )
      ];

      super( items, monthProperty, listParent, options );
    }
  }

  return numberLineIntegers.register( 'MonthsComboBox', MonthsComboBox );

} );