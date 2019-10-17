// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to add and remove money from a property that represents a bank account balance
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const MARGIN = 10;
  const BUTTON_OPTIONS = {
    minXMargin: MARGIN,
    minYMargin: MARGIN,
    fireOnHold: true,
    fireOnHoldDelay: 400,
    fireOnHoldInterval: 30
  };
  const CURRENCY_TEXT_CENTER = new Vector2( 24, 17 );

  // strings
  const currencyUnitsString = require( 'string!NUMBER_LINE_INTEGERS/currencyUnits' );

  // images
  const depositingCoinsImage = require( 'image!NUMBER_LINE_INTEGERS/coin_icons-01.png' );
  const withdrawingCoinsImage = require( 'image!NUMBER_LINE_INTEGERS/coin_icons-02.png' );

  class AccountBalanceControllerNode extends VBox {

    /**
     * @param {NumberProperty} balanceProperty
     * @param {Emitter} balanceChangedByButtonEmitter
     * @param {Range} range
     * @param {number} changeAmount
     * @param {Object} [options]
     */
    constructor( balanceProperty, balanceChangedByButtonEmitter, range, changeAmount, options ) {

      options = merge( {}, { buttonBaseColor: Color.blue }, options );

      // TODO: no need for this function to be here, pull it into a helper function
      const makeCoinIcon = image => new Node( {
        children: [
          new Image( image, { scale: 0.15 } ),
          new Text( currencyUnitsString, { center: CURRENCY_TEXT_CENTER, scale: 1.15 } )
        ]
      } );

      const changeBalanceBy = balanceChangeAmount => {
        if ( ( balanceChangeAmount > 0 && balanceProperty.value < range.max ) ||
             ( balanceChangeAmount < 0 && balanceProperty.value > range.min ) ) {
          balanceProperty.value += balanceChangeAmount;
          balanceChangedByButtonEmitter.emit( balanceChangeAmount );
        }
      };

      // create the buttons
      const upButton = new RoundPushButton( merge( {
        content: makeCoinIcon( depositingCoinsImage ),
        baseColor: options.buttonBaseColor,
        listener: () => { changeBalanceBy( changeAmount ); }
      }, BUTTON_OPTIONS ) );
      const downButton = new RoundPushButton( merge( {
        content: makeCoinIcon( withdrawingCoinsImage ),
        baseColor: options.buttonBaseColor,
        listener: () => { changeBalanceBy( -changeAmount ); }
      }, BUTTON_OPTIONS ) );

      // control the enabled states of the buttons
      balanceProperty.link( balance => {
        upButton.enabled = balance < range.max;
        downButton.enabled = balance > range.min;
      } );

      options = merge( {
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