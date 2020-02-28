// Copyright 2019-2020, University of Colorado Boulder

/**
 * a Scenery node that represents the span of an absolute value separated from the number line
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import NLIConstants from '../NLIConstants.js';

// constants
const CAP_LENGTH = 10; // the "cap" is the end portion of the span, value is in screen coords
const ANIMATION_SPEED = 160; // in screen coords per second
const MAX_ANIMATION_DURATION = 0.5; // in seconds
const EQUATION_NUMBER_FONT = new PhetFont( 18 );
const EXAMPLE_EQUATION_NUMBER_NODE = new Text( 8, { font: EQUATION_NUMBER_FONT } );
const ABSOLUTE_VALUE_LINE_TOP = new Vector2( 0, EXAMPLE_EQUATION_NUMBER_NODE.top );
const ABSOLUTE_VALUE_LINE_BOTTOM = new Vector2( 0, EXAMPLE_EQUATION_NUMBER_NODE.bottom );
const ABSOLUTE_VALUE_LINE_SPACING = 1;
const EQUALS_SIGN_SPACING = 4;

class AbsoluteValueSpanNode extends Node {

  /**
   * @param {NumberLine} numberLine - the number line for which this will be displayed
   * @param {NumberLinePoint} numberLinePoint
   * @param {number} initialDistanceFromNumberLine
   * @public
   */
  constructor( numberLine, numberLinePoint, initialDistanceFromNumberLine ) {

    super();

    // control the visibility of this node
    const visibilityUpdater = showAbsoluteValues => { this.visible = showAbsoluteValues; };
    numberLine.showAbsoluteValuesProperty.link( visibilityUpdater );

    // @public {number} - the distance in model/view coordinates of the line portion of the span from the number line
    this.distanceFromNumberLineProperty = new NumberProperty( initialDistanceFromNumberLine );

    // @public (read-only) {NumberLinePoint} - point whose absolute value is being displayed by this span
    this.numberLinePoint = numberLinePoint;

    // @private {null|Animation} - null when this span node is not animating
    this.translateAnimation = null;

    // add the equation text
    const equationNode = new Node();
    const equationBackground = new BackgroundNode( equationNode, NLIConstants.LABEL_BACKGROUND_OPTIONS );
    this.addChild( equationBackground );

    // add the span indicator shape
    const spanIndicatorNode = new Path( null, {
      stroke: numberLinePoint.colorProperty,
      lineWidth: 2
    } );
    this.addChild( spanIndicatorNode );

    // define a function to update the span shape
    const updateSpanShape = () => {
      const spanIndicatorShape = new Shape();
      const distanceFromNumberLine = this.distanceFromNumberLineProperty.value;
      const pointPosition = numberLinePoint.getPositionInModelSpace();
      if ( numberLine.isHorizontal ) {
        spanIndicatorShape.moveTo(
          numberLine.centerPosition.x,
          numberLine.centerPosition.y - distanceFromNumberLine - CAP_LENGTH / 2
        );
        spanIndicatorShape.lineTo(
          numberLine.centerPosition.x,
          numberLine.centerPosition.y - distanceFromNumberLine + CAP_LENGTH / 2
        );
        spanIndicatorShape.moveTo(
          numberLine.centerPosition.x,
          numberLine.centerPosition.y - distanceFromNumberLine
        );
        spanIndicatorShape.lineTo( pointPosition.x, pointPosition.y - distanceFromNumberLine );
        spanIndicatorShape.moveTo(
          pointPosition.x,
          numberLine.centerPosition.y - distanceFromNumberLine - CAP_LENGTH / 2
        );
        spanIndicatorShape.lineTo(
          pointPosition.x,
          numberLine.centerPosition.y - distanceFromNumberLine + CAP_LENGTH / 2
        );
      }
      else {
        spanIndicatorShape.moveTo(
          numberLine.centerPosition.x - distanceFromNumberLine - CAP_LENGTH / 2,
          numberLine.centerPosition.y
        );
        spanIndicatorShape.lineTo(
          numberLine.centerPosition.x - distanceFromNumberLine + CAP_LENGTH / 2,
          numberLine.centerPosition.y
        );
        spanIndicatorShape.moveTo( numberLine.centerPosition.x - distanceFromNumberLine, numberLine.centerPosition.y );
        spanIndicatorShape.lineTo( pointPosition.x - distanceFromNumberLine, pointPosition.y );
        spanIndicatorShape.moveTo(
          pointPosition.x - distanceFromNumberLine - CAP_LENGTH / 2,
          pointPosition.y
        );
        spanIndicatorShape.lineTo(
          pointPosition.x - distanceFromNumberLine + CAP_LENGTH / 2,
          pointPosition.y
        );
      }
      spanIndicatorNode.shape = spanIndicatorShape;
    };

    // define a function to update the text label
    const updateEquation = () => {
      const value = numberLinePoint.valueProperty.value;
      equationNode.removeAllChildren();
      equationNode.addChild( new AbsoluteValueLine() );
      equationNode.addChild( new Text( value, {
        font: EQUATION_NUMBER_FONT,
        left: equationNode.width + ABSOLUTE_VALUE_LINE_SPACING
      } ) );
      equationNode.addChild( new AbsoluteValueLine( {
        left: equationNode.width + ABSOLUTE_VALUE_LINE_SPACING
      } ) );
      equationNode.addChild( new Text( '=', {
        font: EQUATION_NUMBER_FONT,
        left: equationNode.width + EQUALS_SIGN_SPACING
      } ) );
      equationNode.addChild( new Text( Math.abs( value ), {
        font: EQUATION_NUMBER_FONT,
        left: equationNode.width + EQUALS_SIGN_SPACING
      } ) );

      const distanceFromNumberLine = this.distanceFromNumberLineProperty.value;
      const pointPosition = numberLinePoint.getPositionInModelSpace();
      if ( numberLine.isHorizontal ) {
        equationBackground.centerX = ( numberLine.centerPosition.x + pointPosition.x ) / 2;
        equationBackground.bottom = numberLine.centerPosition.y - distanceFromNumberLine - CAP_LENGTH / 2;
      }
      else {
        equationBackground.centerX = pointPosition.x - distanceFromNumberLine;
        if ( value > 0 ) {
          equationBackground.bottom = pointPosition.y - 5;
        }
        else {
          equationBackground.top = pointPosition.y + 5;
        }
      }
    };

    // update when the point value changes
    numberLinePoint.valueProperty.link( () => {
      updateSpanShape();
      updateEquation();
    } );

    // update position when the orientation or displayed range of the number line changes
    const positionAndShapeMultilink = Property.multilink(
      [ numberLine.orientationProperty, numberLine.displayedRangeProperty, this.distanceFromNumberLineProperty ],
      () => {
        updateSpanShape();
        updateEquation();
      }
    );

    // @private
    this.disposeAbsoluteValueSpanNode = () => {
      positionAndShapeMultilink.dispose();
      numberLine.showAbsoluteValuesProperty.unlink( visibilityUpdater );
    };
  }

  /**
   * @param {number} distance
   * @param {boolean} doAnimation
   * @public
   */
  setDistanceFromNumberLine( distance, doAnimation ) {
    const currentDistanceFromNumberLine = this.distanceFromNumberLineProperty.value;
    if ( distance === currentDistanceFromNumberLine ) {
      return;
    }

    if ( doAnimation ) {
      const animationDuration = Math.min(
        Math.abs( currentDistanceFromNumberLine - distance ) / ANIMATION_SPEED,
        MAX_ANIMATION_DURATION
      );
      const animationOptions = {
        property: this.distanceFromNumberLineProperty,
        to: distance,
        duration: animationDuration,
        easing: Easing.CUBIC_IN_OUT
      };

      // if an animation is in progress, stop it
      if ( this.translateAnimation ) {
        this.translateAnimation.stop();
      }

      // create and start a new animation
      this.translateAnimation = new Animation( animationOptions );
      this.translateAnimation.start();

      // set the current animation to null once it finishes (or is stopped)
      this.translateAnimation.endedEmitter.addListener( () => {
        this.translateAnimation = null;
      } );
    }
    else {
      this.distanceFromNumberLineProperty.value = distance;
    }
  }

  /**
   * @public
   */
  dispose() {
    this.disposeAbsoluteValueSpanNode();
    super.dispose();
  }
}

/**
 * line used to indicate an absolute value indicator
 * @private
 */
class AbsoluteValueLine extends Line {

  /**
   * @param {Object} [options] - options that will be pass to the constructor of the line node
   * @public
   */
  constructor( options ) {
    options = merge( { stroke: 'black' }, options );
    super( ABSOLUTE_VALUE_LINE_TOP, ABSOLUTE_VALUE_LINE_BOTTOM, options );
  }
}

numberLineIntegers.register( 'AbsoluteValueSpanNode', AbsoluteValueSpanNode );
export default AbsoluteValueSpanNode;