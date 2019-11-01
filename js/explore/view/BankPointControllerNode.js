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
  const Animation = require( 'TWIXT/Animation' );
  const BackgroundNode = require( 'SCENERY_PHET/BackgroundNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Color = require( 'SCENERY/util/Color' );
  const Easing = require( 'TWIXT/Easing' );
  const merge = require( 'PHET_CORE/merge' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PiggyBankNode = require( 'NUMBER_LINE_INTEGERS/explore/view/PiggyBankNode' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const MIN_WIDTH = 80; // screen coords, empirically determined
  const MAX_WIDTH = 200; // screen coords, empirically determined
  const TOUCH_DILATION = 7; // dilates piggy banks enough to not overlap touch areas with account balance buttons
  const MOST_POSITIVE_FILL = Color.toColor( '#1fb493' );
  const LEAST_POSITIVE_FILL = Color.toColor( '#a5e1d4' );
  const MOST_NEGATIVE_FILL = Color.toColor( '#fb1d25' );
  const LEAST_NEGATIVE_FILL = Color.toColor( '#fda5a8' );
  const EMPTY_FILL = Color.WHITE;
  const ZERO_FILL = Color.BLACK;
  const READOUT_DISTANCE_FROM_IMAGE = 5;
  const COIN_RADIUS = 10;
  const COIN_COLOR = new Color( 213, 196, 39 );

  // strings
  const balanceAmountString = require( 'string!NUMBER_LINE_INTEGERS/balanceAmount' );
  const currencyUnitsString = require( 'string!NUMBER_LINE_INTEGERS/currencyUnits' );
  const debtAmountString = require( 'string!NUMBER_LINE_INTEGERS/debtAmount' );
  const moneyAmountString = require( 'string!NUMBER_LINE_INTEGERS/moneyAmount' );

  class BankPointControllerNode extends PointControllerNode {

    /**
     * @param {PointController} pointController
     * @param {Emitter} balanceChangedByButtonEmitter
     * @param {String} decorationType - indicates artwork on bank, either 'flowers' or 'lightning'
     * @param {Object} [options]
     */
    constructor( pointController, balanceChangedByButtonEmitter, decorationType, options ) {

      assert && assert( !options || !options.node, 'options should not include a node for this constructor' );

      // TODO: Why does this create a separate controller node and not just use the parent? (noted by jbphet 9/16/2019)

      const controllerNode = new Node();

      // choose the overlay image source, which is artwork that must exactly match the shape of the outline
      const piggyBankNode = new PiggyBankNode( { decorationType: decorationType } );
      controllerNode.addChild( piggyBankNode );

      // add the balance indicator node
      const balanceNode = new Text( 'X', {
        font: new PhetFont( 30 ),
        fill: 'white',
        stroke: 'black',
        center: Vector2.ZERO,
        maxWidth: 65
      } );
      controllerNode.addChild( balanceNode );

      // dilates the touch area for the controllerNode
      controllerNode.touchArea = controllerNode.bounds.dilated( TOUCH_DILATION );

      options = merge( { node: controllerNode }, options );

      super( pointController, options );

      // the readout that will display the absolute value in a phrase
      const absoluteValueText = new Text( '', { font: new PhetFont( 18 ), maxWidth: 150 } );
      const absoluteValueBackground = new BackgroundNode( absoluteValueText, NLIConstants.LABEL_BACKGROUND_OPTIONS );
      this.addChild( absoluteValueBackground );

      // control visibility of the absolute value readout
      pointController.numberLine.showAbsoluteValuesProperty.linkAttribute( absoluteValueBackground, 'visible' );

      // update the position of the absolute value readout (i.e. the text node that says things like, "balance of $2"
      const updateAbsoluteValueReadoutPosition = () => {
        if ( decorationType === 'flowers' ) {
          absoluteValueBackground.centerX = controllerNode.centerX - 9; // tweaked a bit to be centered under feet
          absoluteValueBackground.top = controllerNode.y +
                                        piggyBankNode.height / 2 * controllerNode.getScaleVector().y +
                                        READOUT_DISTANCE_FROM_IMAGE;
        }
        else {
          absoluteValueBackground.centerX = controllerNode.centerX - 2; // tweaked a bit to be centered over coin slot
          absoluteValueBackground.bottom = controllerNode.y -
                                           piggyBankNode.height / 2 * controllerNode.getScaleVector().y -
                                           READOUT_DISTANCE_FROM_IMAGE;
        }
      };

      // update the node's appearance as its position changes
      const valueRange = pointController.numberLine.displayedRangeProperty.value;
      const unscaledWidth = controllerNode.width;
      const updateController = () => {

        // variables needed to make the updates
        const numberLinePoint = pointController.associatedNumberLinePoint;
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
          currencyUnit: currencyUnitsString,
          value: Math.abs( currentBalance )
        } );
        balanceNode.center = Vector2.ZERO;

        // update the absolute value readout
        const value = pointController.associatedNumberLinePoint.valueProperty.value;
        let stringTemplate;
        if ( value < 0 ) {
          stringTemplate = debtAmountString;
          absoluteValueText.fill = MOST_NEGATIVE_FILL;
        }
        else {
          stringTemplate = balanceAmountString;
          absoluteValueText.fill = value > 0 ? '#0e977b' : ZERO_FILL;
        }
        absoluteValueText.text = StringUtils.fillIn( stringTemplate, { value: Math.abs( value ) } );
        updateAbsoluteValueReadoutPosition();
      };
      pointController.positionProperty.link( updateController );

      // immediately called so that absolute value texts are positioned correctly
      updateController();

      // add the layer where the coin animations will occur
      const coinAnimationLayer = new Node();
      controllerNode.addChild( coinAnimationLayer );

      // Add a clipping area so that the coins look like they are going in and out.  This must be manually updated if
      // the artwork for the piggy bank changes.  Since the clipping area is intended to make the coins visible when
      // they are outside the bank but invisible inside, this must be drawn as a set of two shapes, one inside the
      // other, with the inner one drawn with the opposite winding order.
      const coinClipArea = Shape.rectangle( -100, -100, 200, 200 );
      coinClipArea.moveTo( -20, -40 );
      coinClipArea.lineTo( -20, 40 );
      coinClipArea.lineTo( 20, 40 );
      coinClipArea.lineTo( 20, -40 );
      coinClipArea.close();
      coinAnimationLayer.clipArea = coinClipArea;

      // list of the active animations for coin motions
      let activeAnimations = [];

      // watch for when the balance changes due to interaction with the account balance buttons
      balanceChangedByButtonEmitter.addListener( balanceChange => {
        assert && assert( Math.abs( balanceChange ) === 1, 'balance changes from the button should always be 1 or -1' );
        const isDeposit = balanceChange > 0;
        const coinNode = new CoinNode( { centerX: -3 } );
        const startY = isDeposit ? -60 : 30;
        const endY = isDeposit ? 0 : 60;
        coinAnimationLayer.addChild( coinNode );
        if ( isDeposit ) {
          coinNode.moveToBack();
        }
        const coinMotionAnimation = new Animation( {
          duration: 0.5, // TODO - make this a constant
          easing: Easing.CUBIC_IN_OUT,
          setValue: value => { coinNode.centerY = value; },
          from: startY,
          to: endY
        } );
        coinMotionAnimation.endedEmitter.addListener( () => {
          coinAnimationLayer.removeChild( coinNode );
          activeAnimations = _.without( activeAnimations, coinMotionAnimation );
        } );
        activeAnimations.push( coinMotionAnimation );
        coinMotionAnimation.start();
      } );
    }
  }

  class CoinNode extends Circle {

    constructor( options ) {

      options = merge( { stroke: Color.black, fill: COIN_COLOR }, options );
      super( COIN_RADIUS, options );

      // add the currency marking
      this.addChild( new Text( currencyUnitsString, {
        font: new PhetFont( 18 ),
        center: Vector2.ZERO,
        maxWidth: 15
      } ) );
    }
  }

  return numberLineIntegers.register( 'BankPointControllerNode', BankPointControllerNode );
} );
