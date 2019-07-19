// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to add and remove money from a property that represents a bank account balance
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const LABEL_FONT = new PhetFont( 40 );
  const MARGIN = 1;
  const BUTTON_OPTIONS = {
    minXMargin: MARGIN,
    minYMargin: MARGIN,
    fireOnHold: true,
    fireOnHoldDelay: 400,
    fireOnHoldInterval: 30
  };

  class AccountBalanceControllerNode extends VBox {

    /**
     * @param {NumberProperty} balanceProperty
     * @param {Range} range
     * @param {number} changeAmount
     * @param {Object} [options]
     */
    constructor( balanceProperty, range, changeAmount, options ) {

      const changeBalanceBy = balanceChangeAmount => {
        balanceProperty.value = Util.clamp( balanceProperty.value + balanceChangeAmount, range.min, range.max );
      };

      // create the buttons
      const upButton = new RoundPushButton( _.extend( {
        content: new Text( MathSymbols.PLUS, { font: LABEL_FONT } ),
        listener: () => { changeBalanceBy( changeAmount ); }
      }, BUTTON_OPTIONS ) );
      const downButton = new RoundPushButton( _.extend( {
        content: new Text( MathSymbols.MINUS, { font: LABEL_FONT } ),
        listener: () => { changeBalanceBy( -changeAmount ); }
      }, BUTTON_OPTIONS ) );

      // control the enabled states of the buttons
      balanceProperty.link( balance => {
        upButton.enabled = balance < range.max;
        downButton.enabled = balance > range.min;
      } );

      options = _.extend( {
        children: [
          upButton,
          downButton
        ],
        spacing: 15
      }, options );

      super( options );
    }
  }

  return numberLineIntegers.register( 'AccountBalanceControllerNode', AccountBalanceControllerNode );
} );