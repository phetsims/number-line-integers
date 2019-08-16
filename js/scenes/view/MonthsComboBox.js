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
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const TemperatureSceneModel = require( 'NUMBER_LINE_INTEGERS/scenes/model/TemperatureSceneModel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );

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

  // constants
  const itemOptions = { font: new PhetFont( 16 ) };

  class MonthsComboBox extends ComboBox {

    /**
     * @param {EnumerationProperty} monthProperty
     * @param {Node} listParent - node which the ComboBoxListBox will be added
     * @param {object} options
     */
    constructor( monthProperty, listParent, options ) {

      options = _.extend( {
        xMargin: 13,
        yMargin: 6
      }, options );

      const items = [
        new ComboBoxItem( new Text( januaryString, itemOptions ), TemperatureSceneModel.Months.JANUARY ),
        new ComboBoxItem( new Text( februaryString, itemOptions ), TemperatureSceneModel.Months.FEBRUARY ),
        new ComboBoxItem( new Text( marchString, itemOptions ), TemperatureSceneModel.Months.MARCH ),
        new ComboBoxItem( new Text( aprilString, itemOptions ), TemperatureSceneModel.Months.APRIL ),
        new ComboBoxItem( new Text( mayString, itemOptions ), TemperatureSceneModel.Months.MAY ),
        new ComboBoxItem( new Text( juneString, itemOptions ), TemperatureSceneModel.Months.JUNE ),
        new ComboBoxItem( new Text( julyString, itemOptions ), TemperatureSceneModel.Months.JULY ),
        new ComboBoxItem( new Text( augustString, itemOptions ), TemperatureSceneModel.Months.AUGUST ),
        new ComboBoxItem( new Text( septemberString, itemOptions ), TemperatureSceneModel.Months.SEPTEMBER ),
        new ComboBoxItem( new Text( octoberString, itemOptions ), TemperatureSceneModel.Months.OCTOBER ),
        new ComboBoxItem( new Text( novemberString, itemOptions ), TemperatureSceneModel.Months.NOVEMBER ),
        new ComboBoxItem( new Text( decemberString, itemOptions ), TemperatureSceneModel.Months.DECEMBER )
      ];

      super( items, monthProperty, listParent, options );
    }
  }

  return numberLineIntegers.register( 'MonthsComboBox', MonthsComboBox );

} );