// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to add and remove money from a property that represents a bank account balance
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const MARGIN = 1;
  const BUTTON_OPTIONS = {
    minXMargin: MARGIN,
    minYMargin: MARGIN,
    fireOnHold: true,
    fireOnHoldDelay: 400,
    fireOnHoldInterval: 30
  };

  // images TODO: replace the coin PNG images with SVGs
  const depositingCoinsImage = require( 'image!NUMBER_LINE_INTEGERS/coin_icons-01.png' );
  const withdrawingCoinsImage = require( 'image!NUMBER_LINE_INTEGERS/coin_icons-02.png' );

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

      // create the buttons TODO use SVGs instead of PNG images
      const upButton = new RoundPushButton( _.extend( {
        content: new Image( depositingCoinsImage, { scale: 0.2 } ),
        listener: () => { changeBalanceBy( changeAmount ); }
      }, BUTTON_OPTIONS ) );
      const downButton = new RoundPushButton( _.extend( {
        content: new Image( withdrawingCoinsImage, { scale: 0.2 } ),
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