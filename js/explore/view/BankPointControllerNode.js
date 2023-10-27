// Copyright 2019-2023, University of Colorado Boulder

/**
 * BankPointControllerNode is a Scenery node that is used to control point positions in the "Bank" scene of the Number
 * Line Integers sim
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import PiggyBankDecoration from '../../../../number-line-common/js/explore/model/PiggyBankDecoration.js';
import PiggyBankNode from '../../../../number-line-common/js/explore/view/PiggyBankNode.js';
import merge from '../../../../phet-core/js/merge.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Color, ColorProperty, Node, Text } from '../../../../scenery/js/imports.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import NLIColors from '../../common/NLIColors.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';

// constants
const MIN_WIDTH = 80; // screen coords, empirically determined
const MAX_WIDTH = 200; // screen coords, empirically determined
const TOUCH_DILATION = 7; // dilates piggy banks enough to not overlap touch areas with account balance buttons
const READOUT_DISTANCE_FROM_IMAGE = 5;
const COIN_RADIUS = 10;
const COIN_ANIMATION_DURATION = 0.5; // seconds

const balanceAmountStringProperty = NumberLineIntegersStrings.balanceAmountStringProperty;
const currencyUnitsStringProperty = NumberLineIntegersStrings.currencyUnitsStringProperty;
const debtAmountStringProperty = NumberLineIntegersStrings.debtAmountStringProperty;
const moneyAmountStringProperty = NumberLineIntegersStrings.moneyAmountStringProperty;

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

    // Choose the overlay image source, which is artwork that must exactly match the shape of the outline.
    const piggyBankNode = new PiggyBankNode( { decorationType: decorationType } );
    controllerNode.addChild( piggyBankNode );

    // In order to use a PatternStringProperty for dynamic layout we do not have access to the value property
    // at startup. This wrapper allows us to use a PatternStringProperty without a heavy restructure of the sim
    // architecture. https://github.com/phetsims/number-line-integers/issues/109
    const balanceTextWrapper = new Node();

    controllerNode.addChild( balanceTextWrapper );

    // dilates the touch area for the controllerNode
    controllerNode.touchArea = controllerNode.bounds.dilated( TOUCH_DILATION );

    options = merge( { node: controllerNode }, options );

    super( pointController, options );

    // the readout that will display the absolute value in a phrase
    const absoluteValueNode = new Node();
    const absoluteValueMoneyAmountVisibleProperty = new BooleanProperty( false );
    const absoluteValueDebtAmountVisibleProperty = new BooleanProperty( false );
    const absoluteValueMoneyTextColorProperty = new ColorProperty( NLIColors.bankAbsoluteValueMoneyTextColor );

    const absoluteValueBackground = new BackgroundNode( absoluteValueNode, NLCConstants.LABEL_BACKGROUND_OPTIONS );
    this.addChild( absoluteValueBackground );

    // Get a reference to the number line (there is only one for this scene).
    const numberLine = pointController.numberLines[ 0 ];

    // Control visibility of the absolute value readout.
    numberLine.showAbsoluteValuesProperty.linkAttribute( absoluteValueBackground, 'visible' );

    // Update the position of the absolute value readout (i.e. the text node that says things like, "balance of $2".
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

    // Update the node's appearance as its position changes.
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
        const numberLinePoint = pointController.numberLinePoints.get( 0 );
        const currentBalance = numberLinePoint.valueProperty.value;

        // Scale the size.
        const desiredWidth = MIN_WIDTH + ( Math.abs( currentBalance ) / valueRange.max ) * ( MAX_WIDTH - MIN_WIDTH );
        controllerNode.setScaleMagnitude( desiredWidth / unscaledWidth );

        // Update the color of the point and the node's fill.
        let fill = NLIColors.bankEmptyFillColor;
        if ( currentBalance < 0 ) {
          fill = Color.interpolateRGBA(
            NLIColors.bankLeastNegativeFillColor,
            NLIColors.bankMostNegativeFillColor,
            currentBalance / valueRange.min
          );
        }
        else if ( currentBalance > 0 ) {
          fill = Color.interpolateRGBA(
            NLIColors.bankLeastPositiveFillColor,
            NLIColors.bankMostPositiveFillColor,
            currentBalance / valueRange.max
          );
        }
        piggyBankNode.fill = fill;

        // Add the balance indicator text if it has not been added yet.
        if ( balanceTextWrapper.children.length === 0 ) {
          const balanceNode = new Text( new PatternStringProperty( balanceAmountStringProperty, {
            currencyUnit: currencyUnitsStringProperty,
            value: numberLinePoint.valueProperty
          } ), {
            font: new PhetFont( 30 ),
            fill: 'white',
            stroke: 'black',
            center: Vector2.ZERO,
            maxWidth: 65
          } );
          balanceTextWrapper.children = [ balanceNode ];
        }

        // Update the balance indicator text.
        balanceTextWrapper.center = Vector2.ZERO;

        // Update the absolute value readout.
        const value = numberLinePoint.valueProperty.value;

        if ( absoluteValueNode.children.length === 0 ) {
          const absoluteValueMoneyAmountText = new Text(
            new PatternStringProperty( moneyAmountStringProperty, {
              value: numberLinePoint.valueProperty,
              currencyUnit: currencyUnitsStringProperty
            } ),
            {
              font: new PhetFont( 18 ),
              maxWidth: 250,
              fill: absoluteValueMoneyTextColorProperty,
              visibleProperty: absoluteValueMoneyAmountVisibleProperty
            } );
          const absoluteValueDebtAmountText = new Text(
            new PatternStringProperty( debtAmountStringProperty, { value: numberLinePoint.valueProperty } ),
            {
              font: new PhetFont( 18 ),
              maxWidth: 250,
              fill: NLIColors.bankAbsoluteValueDebtTextColor,
              visibleProperty: absoluteValueDebtAmountVisibleProperty
            } );

          absoluteValueNode.children = [ absoluteValueMoneyAmountText, absoluteValueDebtAmountText ];
        }

        if ( value < 0 ) {
          absoluteValueMoneyAmountVisibleProperty.value = false;
          absoluteValueDebtAmountVisibleProperty.value = true;
        }
        else {
          absoluteValueMoneyAmountVisibleProperty.value = true;
          absoluteValueDebtAmountVisibleProperty.value = false;

          absoluteValueMoneyTextColorProperty.value = value === 0 ? NLIColors.bankZeroFillColor : NLIColors.bankAbsoluteValueMoneyTextColor;
        }
        updateAbsoluteValueReadoutPosition();
      }
    };
    pointController.positionProperty.link( updateController );

    // immediately called so that absolute value texts are positioned correctly
    updateController();

    // Add the layer where the coin animations will occur.
    const coinAnimationLayer = new Node();
    controllerNode.addChild( coinAnimationLayer );

    // Add the coins now so that they don't have to be added on the fly during the animation.
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

    // List of the active animations for coin motions.
    let activeAnimations = [];

    // Watch for when the balance changes due to interaction with the account balance buttons.
    balanceChangedByButtonEmitter.addListener( balanceChange => {
      assert && assert( Math.abs( balanceChange ) === 1, 'balance changes from the button should always be 1 or -1' );
      const isDeposit = balanceChange > 0;

      // Look for a non-visible coin node on the animation layer and only create one if nothing is available.  This
      // way of caching the previously created coin nodes helps to improve performance, see
      // https://github.com/phetsims/number-line-integers/issues/69.
      const coinNodes = coinAnimationLayer.getChildren();
      let coinNode = _.find( coinNodes, testCoinNode => !testCoinNode.visible );
      if ( !coinNode ) {

        // There aren't any invisible, previously created coin nodes available, so add a new one.
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

        // Just hide the coin node so that we can reuse it later if needed.
        coinNode.visible = false;
      } );
      activeAnimations.push( coinMotionAnimation );
      coinMotionAnimation.start();
    } );

    this.visibleProperty.lazyLink( visible => {

      // Cancel any in-progress user interactions when this goes invisible.  This helps to prevent multi-touch issues,
      // see https://github.com/phetsims/number-line-integers/issues/106.
      if ( !visible ) {
        this.interruptSubtreeInput();
      }
    } );
  }
}

class CoinNode extends Circle {

  /**
   * @param {Object} [options]
   * @public
   */
  constructor( options ) {

    options = merge( { stroke: Color.black, fill: NLIColors.coinColor }, options );
    super( COIN_RADIUS, options );

    // Add the currency marking.
    this.addChild( new Text( currencyUnitsStringProperty, {
      font: new PhetFont( 18 ),
      center: Vector2.ZERO,
      maxWidth: 15
    } ) );
  }
}

numberLineIntegers.register( 'BankPointControllerNode', BankPointControllerNode );
export default BankPointControllerNode;
