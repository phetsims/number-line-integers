// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to control point positions in the "Bank" scene of the Number Line Integers sim
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PiggyBankNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/PiggyBankNode' );
  const Property = require( 'AXON/Property' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const MIN_WIDTH = 80; // screen coords, empirically determined
  const MAX_WIDTH = 200; // screen coords, empirically determined
  const PIGGY_BANK_MOST_POSITIVE_FILL = Color.toColor( '#1fb493' );
  const PIGGY_BANK_LEAST_POSITIVE_FILL = Color.toColor( '#a5e1d4' );
  const PIGGY_BANK_MOST_NEGATIVE_FILL = Color.toColor( '#fb1d25' );
  const PIGGY_BANK_LEAST_NEGATIVE_FILL = Color.toColor( '#fda5a8' );
  const PIGGY_BANK_EMPTY_FILL = Color.toColor( '#ffffff' );

  // images
  const piggyBankWithFlowers = require( 'image!NUMBER_LINE_INTEGERS/piggy-bank-with-flowers.png' );
  const piggyBankWithLightning = require( 'image!NUMBER_LINE_INTEGERS/piggy-bank-with-lightning.png' );

  // strings
  const moneyAmountString = require( 'string!NUMBER_LINE_INTEGERS/moneyAmount' );
  const balanceAmountString = require( 'string!NUMBER_LINE_INTEGERS/balanceAmount' );
  const debtAmountString = require( 'string!NUMBER_LINE_INTEGERS/debtAmount' );

  class BankPointControllerNode extends PointControllerNode {

    /**
     * @param {PointController} pointController
     * @param {String} overlayType - indicates artwork on bank, either 'flowers' or 'lightning'
     * @param {Object} [options]
     */
    constructor( pointController, overlayType, options ) {

      assert && assert( !options || !options.node, 'options should not include a node for this constructor' );

      const controllerNode = new Node();

      // choose the overlay image source, which is artwork that must exactly match the shape of the outline
      const piggyBankNode = new PiggyBankNode( overlayType === 'flowers' ? piggyBankWithFlowers : piggyBankWithLightning );
      controllerNode.addChild( piggyBankNode );

      // add the balance indicator node
      const balanceNode = new Text( 'X', {
        font: new PhetFont( 30 ),
        fill: 'white',
        center: Vector2.ZERO
      } );
      controllerNode.addChild( balanceNode );

      options = _.extend( { node: controllerNode }, options );

      // update the node's appearance as its position changes
      const maxBalance = pointController.numberLine.displayedRangeProperty.value.max;
      const unscaledWidth = controllerNode.width;
      const updateController = () => {

        // variables needed to make the updates
        const numberLinePoint = pointController.numberLinePoint;
        const currentBalance = numberLinePoint.valueProperty.value;

        // scale the size
        const desiredWidth = MIN_WIDTH + ( Math.abs( currentBalance ) / maxBalance ) * ( MAX_WIDTH - MIN_WIDTH );
        controllerNode.setScaleMagnitude( desiredWidth / unscaledWidth );

        // update the color of the point and the node's fill
        piggyBankNode.fill = PIGGY_BANK_EMPTY_FILL;
        if ( currentBalance < 0 ) {
          piggyBankNode.fill = Color.interpolateRGBA(
            PIGGY_BANK_LEAST_NEGATIVE_FILL,
            PIGGY_BANK_MOST_NEGATIVE_FILL,
            ( currentBalance + 1 ) / -99
          );
        }
        else if ( currentBalance > 0 ) {
          piggyBankNode.fill = Color.interpolateRGBA(
            PIGGY_BANK_LEAST_POSITIVE_FILL,
            PIGGY_BANK_MOST_POSITIVE_FILL,
            ( currentBalance - 1 ) / 99
          );
        }

        // update the balance indicator text
        const signIndicator = currentBalance < 0 ? '-' : '';
        balanceNode.text = signIndicator + StringUtils.fillIn( moneyAmountString, {
          value: Math.abs( currentBalance )
        } );
        balanceNode.center = Vector2.ZERO;
      };
      pointController.positionProperty.link( updateController );

      super( pointController, options );
      updateController();

      // the rectangle and text that display the absolute value of the piggy bank's value
      const absoluteValueText = new Text( '', { font: new PhetFont( 14 ) } );
      const absoluteValueBackground = new Rectangle( 0, 0, 0, 0, 3, 3, {
        fill: 'white',
        opacity: 0.85
      } );
      this.addChild( absoluteValueBackground );
      this.addChild( absoluteValueText );

      // how the absoluteValueText and absoluteValueBackground are updated and shown
      Property.multilink( [ pointController.numberLine.showAbsoluteValuesProperty, pointController.positionProperty ], () => {
        if ( pointController.numberLinePoint && pointController.numberLine.showAbsoluteValuesProperty.value ) {
          absoluteValueText.visible = true;
          absoluteValueBackground.visible = true;

          const value = pointController.numberLinePoint.valueProperty.value;
          let stringTemplate;
          if ( value < 0 ) {
            stringTemplate = debtAmountString;
            absoluteValueText.fill = PIGGY_BANK_MOST_NEGATIVE_FILL;
          } else {
            stringTemplate = balanceAmountString;
            absoluteValueText.fill = PIGGY_BANK_MOST_POSITIVE_FILL;
          }
          absoluteValueText.text = StringUtils.fillIn( stringTemplate, { value: Math.abs( value ) } );

          absoluteValueText.centerX = controllerNode.centerX;
          if ( overlayType === 'flowers' ) {
            absoluteValueText.top = controllerNode.bottom + 5;
          } else {
            absoluteValueText.bottom = controllerNode.top - 5;
          }

          absoluteValueBackground.setRect( 0, 0, absoluteValueText.width + 5, absoluteValueText.height + 5 );
          absoluteValueBackground.center = absoluteValueText.center;

        } else {
          absoluteValueText.visible = false;
          absoluteValueBackground.visible = false;
        }
      } );
    }
  }

  return numberLineIntegers.register( 'BankPointControllerNode', BankPointControllerNode );
} );
