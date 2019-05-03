// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that represents the span of an absolute value separated from the number line
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const Path = require( 'SCENERY/nodes/Path' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Shape = require( 'KITE/Shape' );

  // const
  const CAP_LENGTH = 10;

  class AbsoluteValueSpanNode extends Node {

    // TODO: document when finalized
    constructor( numberLine, numberLinePoint, initialDistanceFromNumberLine ) {

      super();

      // control the visibility of this node
      const visibilityMultilink = Property.multilink(
        [ numberLine.showAbsoluteValuesProperty, numberLinePoint.valueProperty ],
        ( showAbsoluteValues, pointValue ) => {
          this.visible = showAbsoluteValues && pointValue !== 0;
        }
      );

      // @public {number} - the distance in model/view coordinates of the line portion of the span from the number line
      this.distanceFromNumberLineProperty = new Property( initialDistanceFromNumberLine );

      // @public (read-only) {NumberLinePoint} - point whose absolute value is being displayed by this span
      this.numberLinePoint = numberLinePoint;

      // add the equation text
      const equationTextNode = new Text( '', { font: new PhetFont( 14 ) } );
      this.addChild( equationTextNode );

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
        if ( numberLine.isHorizontal() ) {
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
        spanIndicatorNode.setShape( spanIndicatorShape );
      };

      // define a function to update the text label
      const updateTextLabel = () => {
        const value = numberLinePoint.valueProperty.value;
        equationTextNode.setText( '|' + value + '|' + ' = ' + Math.abs( value ) );
        const distanceFromNumberLine = this.distanceFromNumberLineProperty.value;
        const pointPosition = numberLinePoint.getPositionInModelSpace();
        if ( numberLine.isHorizontal() ) {
          equationTextNode.centerX = ( numberLine.centerPosition.x + pointPosition.x ) / 2;
          equationTextNode.bottom = numberLine.centerPosition.y - distanceFromNumberLine - CAP_LENGTH / 2 - 4;
        }
        else {
          equationTextNode.centerX = pointPosition.x - distanceFromNumberLine;
          if ( value > 0 ) {
            equationTextNode.bottom = pointPosition.y - 5;
          }
          else {
            equationTextNode.top = pointPosition.y + 5;
          }
        }
      };

      // update when the point value changes
      numberLinePoint.valueProperty.link( () => {
        updateSpanShape();
        updateTextLabel();
      } );

      // update position when the orientation or displayed range of the number line changes
      const positionAndShapeMultilink = Property.multilink(
        [ numberLine.orientationProperty, numberLine.displayedRangeProperty, this.distanceFromNumberLineProperty ],
        () => {
          updateSpanShape();
          updateTextLabel();
        }
      );

      // @private
      this.disposeAbsoluteValueSpanNode = () => {
        positionAndShapeMultilink.dispose();
        visibilityMultilink.dispose();
      };
    }

    dispose() {
      this.disposeAbsoluteValueSpanNode();
      super.dispose();
    }
  }

  return numberLineIntegers.register( 'AbsoluteValueSpanNode', AbsoluteValueSpanNode );
} );