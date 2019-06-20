// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to add and remove money from a property that represents a bank account balance
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );

  // constants
  const LABEL_FONT = new PhetFont( 40 );
  const MARGIN = 1;

  class AccountBalanceControllerNode extends VBox {

    /**
     * @param {NumberProperty} balanceProperty
     * @param {Range} range
     * @param {number} changeAmount
     * @param {Object} [options]
     */
    constructor( balanceProperty, range, changeAmount, options ) {

      options = _.extend( {
        children: [
          new RoundPushButton( {
            content: new Text( '+', { font: LABEL_FONT } ),
            minXMargin: MARGIN,
            minYMargin: MARGIN,
            listener: () => {
              balanceProperty.set( Math.min( balanceProperty.value + changeAmount, range.max ) );
            }
          } ),
          new RoundPushButton( {
            content: new Text( MathSymbols.MINUS, { font: LABEL_FONT, center: Vector2.ZERO } ),
            minXMargin: MARGIN,
            minYMargin: MARGIN,
            listener: () => {
              balanceProperty.set( Math.max( balanceProperty.value - changeAmount, range.min ) );
            }
          } )
        ],
        spacing: 15
      }, options );

      super( options );
    }
  }

  return numberLineIntegers.register( 'AccountBalanceControllerNode', AccountBalanceControllerNode );
} );