// Copyright 2019-2020, University of Colorado Boulder

/**
 * AccountBalanceControllerNode is a Scenery node that is used to add and remove money from a property that represents
 * a bank account balance.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Emitter = require( 'AXON/Emitter' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
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
  const CURRENCY_SYMBOL_FONT = new PhetFont( 12 );
  const CURRENCY_SYMBOL_MAX_WIDTH = 10;
  const BUTTON_ICON_WIDTH = 38;

  // strings
  const currencyUnitsString = require( 'string!NUMBER_LINE_INTEGERS/currencyUnits' );

  // images
  const depositingCoinsImage = require( 'image!NUMBER_LINE_INTEGERS/coin-in-slot.png' );
  const withdrawingCoinsImage = require( 'image!NUMBER_LINE_INTEGERS/coin-in-hand.png' );

  class AccountBalanceControllerNode extends VBox {

    /**
     * @param {NumberProperty} balanceProperty
     * @param {Emitter} balanceChangedByButtonEmitter
     * @param {Range} range
     * @param {number} changeAmount
     * @param {Object} [options]
     * @public
     */
    constructor( balanceProperty, balanceChangedByButtonEmitter, range, changeAmount, options ) {

      options = merge( {}, { buttonBaseColor: Color.blue }, options );

      // closure for making changes to the balance
      const changeBalance = balanceChangeAmount => {
        if ( ( balanceChangeAmount > 0 && balanceProperty.value < range.max ) ||
             ( balanceChangeAmount < 0 && balanceProperty.value > range.min ) ) {
          balanceProperty.value += balanceChangeAmount;
          balanceChangedByButtonEmitter.emit( balanceChangeAmount );
        }
      };

      // Create the icons that will be used in the buttons.  Sizes and positions were empirically determined.
      const depositIcon = new Node( {
        children: [
          new Image( depositingCoinsImage, { maxWidth: BUTTON_ICON_WIDTH, centerY: -10 } ),
          new Text( currencyUnitsString, {
            center: new Vector2( 21, -9 ),
            font: CURRENCY_SYMBOL_FONT,
            maxWidth: CURRENCY_SYMBOL_MAX_WIDTH
          } )
        ]
      } );
      const withdrawIcon = new Node( {
        children: [
          new Image( withdrawingCoinsImage, { maxWidth: BUTTON_ICON_WIDTH } ),
          new Text( currencyUnitsString, {
            center: new Vector2( 22, 9 ),
            font: CURRENCY_SYMBOL_FONT,
            maxWidth: CURRENCY_SYMBOL_MAX_WIDTH
          } )
        ]
      } );

      // create the buttons that the user can use to add and remove money
      const upButton = new RoundPushButton( merge( {
        content: depositIcon,
        baseColor: options.buttonBaseColor,
        listener: () => { changeBalance( changeAmount ); }
      }, BUTTON_OPTIONS ) );
      const downButton = new RoundPushButton( merge( {
        content: withdrawIcon,
        baseColor: options.buttonBaseColor,
        listener: () => { changeBalance( -changeAmount ); }
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

      // @public (read-only) - emitter that fires when either button is released
      this.buttonReleasedEmitter = new Emitter();

      // monitor the downProperty for each button, locking out the other button and performing emits when released
      upButton.buttonModel.downProperty.lazyLink( down => {
        if ( down ) {

          // to prevent multi-touch issues, don't let the other button be pushed while this one is down
          downButton.pickable = false;
        }
        else {

          // the button has been released, trigger the emitter
          this.buttonReleasedEmitter.emit();

          // restore pickability of peer button
          downButton.pickable = true;
        }
      } );
      downButton.buttonModel.downProperty.lazyLink( down => {
        if ( down ) {

          // to prevent multi-touch issues, don't let the other button be pushed while this one is down
          upButton.pickable = false;
        }
        else {

          // the button has been released, trigger the emitter
          this.buttonReleasedEmitter.emit();

          // restore pickability of peer button
          upButton.pickable = true;
        }
      } );
    }
  }

  return numberLineIntegers.register( 'AccountBalanceControllerNode', AccountBalanceControllerNode );
} );