// Copyright 2019, University of Colorado Boulder

/**
 * BankPointControllerNode is a Scenery node that is used to control point positions in the "Bank" scene of the Number
 * Line Integers sim
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PiggyBankNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/PiggyBankNode' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const MIN_WIDTH = 80; // screen coords, empirically determined
  const MAX_WIDTH = 200; // screen coords, empirically determined
  const MOST_POSITIVE_FILL = Color.toColor( '#1fb493' );
  const LEAST_POSITIVE_FILL = Color.toColor( '#a5e1d4' );
  const MOST_NEGATIVE_FILL = Color.toColor( '#fb1d25' );
  const LEAST_NEGATIVE_FILL = Color.toColor( '#fda5a8' );
  const EMPTY_FILL = Color.toColor( '#fff' );
  const READOUT_DISTANCE_FROM_IMAGE = 5;

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
        stroke: 'black',
        center: Vector2.ZERO
      } );
      controllerNode.addChild( balanceNode );

      options = _.extend( { node: controllerNode }, options );

      super( pointController, options );

      // the readout that will display the absolute value in a phrase
      const absoluteValueText = new Text( '', { font: new PhetFont( 14 ) } );
      const absoluteValueBackground = new Rectangle( 0, 0, 0, 0, 3, 3, {
        fill: 'white',
        opacity: NLIConstants.LABEL_BACKGROUND_OPACITY
      } );
      this.addChild( absoluteValueBackground );
      absoluteValueBackground.addChild( absoluteValueText );

      // control visibility of the absolute value readout
      pointController.numberLine.showAbsoluteValuesProperty.linkAttribute( absoluteValueBackground, 'visible' );

      // update the node's appearance as its position changes
      const valueRange = pointController.numberLine.displayedRangeProperty.value;
      const unscaledWidth = controllerNode.width;
      const updateController = () => {

        // variables needed to make the updates
        const numberLinePoint = pointController.numberLinePoint;
        const currentBalance = numberLinePoint.valueProperty.value;

        // scale the size
        const desiredWidth = MIN_WIDTH + ( Math.abs( currentBalance ) / valueRange.max ) * ( MAX_WIDTH - MIN_WIDTH );
        controllerNode.setScaleMagnitude( desiredWidth / unscaledWidth );

        // update the color of the point and the node's fill
        let fill = EMPTY_FILL;
        if ( currentBalance < 0 ) {
          fill = Color.interpolateRGBA(
            LEAST_NEGATIVE_FILL,
            MOST_NEGATIVE_FILL,
            currentBalance / valueRange.min
          );
        }
        else if ( currentBalance > 0 ) {
          fill = Color.interpolateRGBA(
            LEAST_POSITIVE_FILL,
            MOST_POSITIVE_FILL,
            currentBalance / valueRange.max
          );
        }
        piggyBankNode.fill = fill;

        // update the balance indicator text
        const signIndicator = currentBalance < 0 ? '-' : '';
        balanceNode.text = signIndicator + StringUtils.fillIn( moneyAmountString, {
          value: Math.abs( currentBalance )
        } );
        balanceNode.center = Vector2.ZERO;

        // update the absolute value readout
        const value = pointController.numberLinePoint.valueProperty.value;
        let stringTemplate;
        if ( value < 0 ) {
          stringTemplate = debtAmountString;
          absoluteValueText.fill = MOST_NEGATIVE_FILL;
        }
        else {
          stringTemplate = balanceAmountString;
          absoluteValueText.fill = MOST_POSITIVE_FILL;
        }
        absoluteValueText.text = StringUtils.fillIn( stringTemplate, { value: Math.abs( value ) } );
        absoluteValueBackground.setRect( 0, 0, absoluteValueText.width + 5, absoluteValueText.height + 5 );
        if ( overlayType === 'flowers' ) {
          absoluteValueBackground.centerX = controllerNode.centerX - 9; // tweaked a bit to be centered under feet
          absoluteValueBackground.top = controllerNode.bottom + READOUT_DISTANCE_FROM_IMAGE;
        }
        else {
          absoluteValueBackground.centerX = controllerNode.centerX - 2; // tweaked a bit to be centered over coin slot
          absoluteValueBackground.bottom = controllerNode.top - READOUT_DISTANCE_FROM_IMAGE;
        }
        absoluteValueText.center = absoluteValueBackground.localBounds.center;
      };
      pointController.positionProperty.link( updateController );
    }
  }

  return numberLineIntegers.register( 'BankPointControllerNode', BankPointControllerNode );
} );
