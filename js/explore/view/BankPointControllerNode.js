// Copyright 2019-2020, University of Colorado Boulder

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
  const PiggyBankDecoration = require( 'NUMBER_LINE_INTEGERS/explore/model/PiggyBankDecoration' );
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
  const POSITIVE_ABSOLUTE_VALUE_TEXT_COLOR = '#0e977b';
  const NEGATIVE_ABSOLUTE_VALUE_TEXT_COLOR = MOST_NEGATIVE_FILL;
  const EMPTY_FILL = Color.WHITE;
  const ZERO_FILL = Color.BLACK;
  const READOUT_DISTANCE_FROM_IMAGE = 5;
  const COIN_RADIUS = 10;
  const COIN_COLOR = new Color( 213, 196, 39 );
  const COIN_ANIMATION_DURATION = 0.5; // seconds

  // strings
  const balanceAmountString = require( 'string!NUMBER_LINE_INTEGERS/balanceAmount' );
  const currencyUnitsString = require( 'string!NUMBER_LINE_INTEGERS/currencyUnits' );
  const debtAmountString = require( 'string!NUMBER_LINE_INTEGERS/debtAmount' );
  const moneyAmountString = require( 'string!NUMBER_LINE_INTEGERS/moneyAmount' );

  // constants
  const COIN_DEPOSIT_ANIMATION_START_Y = -60; // above the piggy bank, in screen coordinates, empirically determined
  const COIN_DEPOSIT_ANIMATION_END_Y = 0; // inside the piggy bank, in screen coordinates, empirically determined
  const COIN_WITHDRAWAL_ANIMATION_START_Y = 30; // inside the piggy bank, in screen coordinates, empirically determined
  const COIN_WITHDRAWAL_ANIMATION_END_Y = 60; // below the piggy bank, in screen coordinates, empirically determined
  const NUMBER_OF_COINS_TO_PRE_CREATE = 20; // number of coins to create for animation, empirically determined
  const COIN_NODE_X_POSITION = -3;

  class BankPointControllerNode extends PointControllerNode {

    /**
     * @param {PointController} pointController
     * @param {Emitter} balanceChangedByButtonEmitter
     * @param {PiggyBankDecoration} decorationType - indicates artwork on bank
     * @param {Object} [options]
     * @public
     */
    constructor( pointController, balanceChangedByButtonEmitter, decorationType, options ) {

      assert && assert( !options || !options.node, 'options should not include a node for this constructor' );

      // root node for draggable controller portion, separate for absolute value display and coin animation
      const controllerNode = new Node();

      // choose the overlay image source, which is artwork that must exactly match the shape of the outline
      const piggyBankNode = new PiggyBankNode( { decorationType: decorationType } );
      controllerNode.addChild( piggyBankNode );

      // add the balance indicator node
      const balanceNode = new Text( '', {
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
      const absoluteValueText = new Text( '', { font: new PhetFont( 18 ), maxWidth: 250 } );
      const absoluteValueBackground = new BackgroundNode( absoluteValueText, NLIConstants.LABEL_BACKGROUND_OPTIONS );
      this.addChild( absoluteValueBackground );

      // get a reference to the number line (there is only one for this scene)
      const numberLine = pointController.numberLines[ 0 ];

      // control visibility of the absolute value readout
      numberLine.showAbsoluteValuesProperty.linkAttribute( absoluteValueBackground, 'visible' );

      // update the position of the absolute value readout (i.e. the text node that says things like, "balance of $2"
      const updateAbsoluteValueReadoutPosition = () => {
        if ( decorationType === PiggyBankDecoration.FLOWERS ) {
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
      const valueRange = numberLine.displayedRangeProperty.value;
      const unscaledWidth = controllerNode.width;
      const updateController = () => {

        if ( pointController.numberLinePoints.length > 0 ) {

          // state checking
          assert && assert(
            pointController.numberLinePoints.length === 1,
            'point controllers in the bank scene should never control multiple points'
          );

          // variables needed to make the updates
          const numberLinePoint = pointController.numberLinePoints[ 0 ];
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
          const value = numberLinePoint.valueProperty.value;
          let stringTemplate;
          if ( value < 0 ) {
            stringTemplate = debtAmountString;
            absoluteValueText.fill = NEGATIVE_ABSOLUTE_VALUE_TEXT_COLOR;
          }
          else {
            stringTemplate = balanceAmountString;
            absoluteValueText.fill = value > 0 ? POSITIVE_ABSOLUTE_VALUE_TEXT_COLOR : ZERO_FILL;
          }
          absoluteValueText.text = StringUtils.fillIn( stringTemplate, { value: Math.abs( value ) } );
          updateAbsoluteValueReadoutPosition();
        }
      };
      pointController.positionProperty.link( updateController );

      // immediately called so that absolute value texts are positioned correctly
      updateController();

      // add the layer where the coin animations will occur
      const coinAnimationLayer = new Node();
      controllerNode.addChild( coinAnimationLayer );

      // add the coins now so that they don't have to be added on the fly during the animation
      _.times( NUMBER_OF_COINS_TO_PRE_CREATE, () => {
        coinAnimationLayer.addChild( new CoinNode( { centerX: COIN_NODE_X_POSITION, visible: false } ) );
      } );

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

        // Look for a non-visible coin node on the animation layer and only create one if nothing is available.  This
        // way of caching the previously created coin nodes helps to improve performance, see
        // https://github.com/phetsims/number-line-integers/issues/69.
        const coinNodes = coinAnimationLayer.getChildren();
        let coinNode = coinNodes.find( testCoinNode => !testCoinNode.visible );
        if ( !coinNode ) {

          // there aren't any invisible, previously created coin nodes available, so add a new one
          coinNode = new CoinNode( { centerX: COIN_NODE_X_POSITION, visible: false } );
          coinAnimationLayer.addChild( coinNode );
        }

        const startY = isDeposit ? COIN_DEPOSIT_ANIMATION_START_Y : COIN_WITHDRAWAL_ANIMATION_START_Y;
        const endY = isDeposit ? COIN_DEPOSIT_ANIMATION_END_Y : COIN_WITHDRAWAL_ANIMATION_END_Y;
        if ( isDeposit ) {
          coinNode.moveToBack();
        }
        else {
          coinNode.moveToFront();
        }
        coinNode.visible = true;
        const coinMotionAnimation = new Animation( {
          duration: COIN_ANIMATION_DURATION,
          easing: Easing.CUBIC_IN_OUT,
          setValue: value => { coinNode.centerY = value; },
          from: startY,
          to: endY
        } );
        coinMotionAnimation.endedEmitter.addListener( () => {
          activeAnimations = _.without( activeAnimations, coinMotionAnimation );

          // just hide the coin node so that we can reuse it later if needed
          coinNode.visible = false;
        } );
        activeAnimations.push( coinMotionAnimation );
        coinMotionAnimation.start();
      } );
    }
  }

  class CoinNode extends Circle {

    /**
     * @param {Object} [options]
     * @public
     */
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
