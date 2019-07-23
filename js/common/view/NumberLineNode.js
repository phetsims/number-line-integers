// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that presents a number line to the user
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AbsoluteValueSpanNode = require( 'NUMBER_LINE_INTEGERS/common/view/AbsoluteValueSpanNode' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Line = require( 'SCENERY/nodes/Line' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const TICK_MARK_LABEL_DISTANCE = 5;
  const POINT_NODE_RADIUS = 4.5;
  const ABS_VAL_MIN_LINE_WIDTH = 2;
  const ABS_VAL_LINE_EXPANSION_FACTOR = 3;
  const ABS_VAL_SPAN_NL_DISTANCE_Y = 55;
  const ABS_VAL_SPAN_SPACING_Y = 40;
  const ABS_VAL_SPAN_NL_DISTANCE_X = 75;
  const ABS_VAL_SPAN_SPACING_X = 65;

  // convenience function to calculate distance of an absolute value span node from the number line
  const getIndicatorDistanceFromNL = ( numberLine, count ) => {
    return numberLine.isHorizontal ?
           ABS_VAL_SPAN_NL_DISTANCE_Y + count * ABS_VAL_SPAN_SPACING_Y :
           ABS_VAL_SPAN_NL_DISTANCE_X + count * ABS_VAL_SPAN_SPACING_X;
  };

  class NumberLineNode extends Node {

    /**
     * {NumberLine} numberLine - model of a number line
     * {Bounds2} displayBounds - the bounds in which the number line should be displayed
     * {Object} [options] - options that control the appearance of the number line
     */
    constructor( numberLine, options ) {

      options = _.extend( {

        numberLineWidth: 1,
        tickMarkLineWidth: 1,
        tickMarkLength: 10,
        zeroTickMarkLineWidth: 2,
        zeroTickMarkLength: 16,
        tickMarkLabelFont: new PhetFont( 16 ),
        color: 'black',
        pointRadius: 10,
        numberDisplayTemplate: '{{number}}',
        numberDisplayUnits: '',

        // {boolean} - controls whether the absolute value span indicators, which are a little ways away from the number
        // line itself, are portrayed
        showAbsoluteValueSpans: false,

        // {number} - the distance between the edge of the display bounds and the ends of the displayed range
        displayedRangeInset: NLIConstants.GENERIC_SCREEN_DISPLAYED_RANGE_INSET
      }, options );

      // since the position is set based on the model, don't pass options through to parent class
      super();

      const displayBounds = numberLine.modelProjectionBounds.dilated( options.displayedRangeInset );

      // @private {Object} - make options available to methods
      this.options = options;

      // @private {NumberLine} - make the number line model available to methods
      this.numberLine = numberLine;

      // assemble the options that control the appearance of the main number into one place
      const numberLineOptions = {
        doubleHead: true,
        lineWidth: options.numberLineWidth,
        tailWidth: options.numberLineWidth,
        headHeight: 10,
        headWidth: 10,
        stroke: options.color,
        fill: options.color
      };

      // add the number line, and update it if the orientation changes
      const numberLineNode = new Node();
      this.addChild( numberLineNode );
      numberLine.orientationProperty.link( orientation => {

        assert && assert(
          orientation === NumberLineOrientation.HORIZONTAL || orientation === NumberLineOrientation.VERTICAL,
          `Invalid orientation: ${orientation}`
        );

        // remove the previous representation
        numberLineNode.removeAllChildren();

        if ( orientation === NumberLineOrientation.HORIZONTAL ) {

          // add the arrow node that represents the number line
          numberLineNode.addChild( new ArrowNode(
            displayBounds.minX,
            numberLine.centerPosition.y,
            displayBounds.maxX,
            numberLine.centerPosition.y,
            numberLineOptions
          ) );

          // add the tick mark for the 0 position, which is always visible
          this.addTickMark( numberLineNode, 0 );
        }
        else {

          // add the arrow node that represents the number line
          numberLineNode.addChild( new ArrowNode(
            numberLine.centerPosition.x,
            displayBounds.minY,
            numberLine.centerPosition.x,
            displayBounds.maxY,
            numberLineOptions
          ) );

          // add the tick mark for the 0 position, which is always visible
          this.addTickMark( numberLineNode, 0 );
        }
      } );

      // handle the tick marks at the ends of the display range
      const endTickMarksRootNode = new Node();
      this.addChild( endTickMarksRootNode );

      // add the root node for the tick marks that exist between the middle and the end
      const middleTickMarksRootNode = new Node();
      numberLine.tickMarksVisibleProperty.linkAttribute( middleTickMarksRootNode, 'visible' );
      this.addChild( middleTickMarksRootNode );

      // add the layer where the lines the are used to indicate the absolute value of a point will be displayed
      const absoluteValueLineLayer = new Node();
      this.addChild( absoluteValueLineLayer );
      numberLine.showAbsoluteValuesProperty.linkAttribute( absoluteValueLineLayer, 'visible' );

      // add the layer where opposite points on the number line will be displayed
      const oppositePointDisplayLayer = new Node();
      this.addChild( oppositePointDisplayLayer );

      // add the layer where the points on the number line will be displayed
      const pointDisplayLayer = new Node();
      this.addChild( pointDisplayLayer );

      // closure that updates the lines that indicate absolute value
      const absoluteValueLines = [];
      const updateAbsoluteValueIndicators = ( doAnimation = false ) => {

        // if there aren't enough absolute value indicator lines available, add new ones until there are enough
        while ( absoluteValueLines.length < numberLine.residentPoints.length ) {
          const absoluteValueLine = new Line( 0, 0, 1, 1 ); // position is arbitrary, will be updated below
          absoluteValueLines.push( absoluteValueLine );
          absoluteValueLineLayer.addChild( absoluteValueLine );
        }

        // if there are too many absolute value indicator lines, remove them until we have the right amount
        while ( absoluteValueLines.length > numberLine.residentPoints.length ) {
          const absoluteValueLine = absoluteValueLines.pop();
          absoluteValueLineLayer.removeChild( absoluteValueLine );
        }

        // create a list of the resident points on the number line sorted by absolute value
        const pointsSortedByValue = _.sortBy( numberLine.residentPoints.getArray(), point => {
          return Math.abs( point.valueProperty.value );
        } );

        // update the position, color, thickness, and layering of each of the lines and the spacing of the spans
        let pointsAboveZeroCount = 0;
        let pointsBelowZeroCount = 0;
        const zeroPosition = numberLine.centerPosition;
        pointsSortedByValue.forEach( ( point, index ) => {

          // get a line that will display the absolute value on the number line itself
          const lineOnNumberLine = absoluteValueLines[ index ];

          // get the span indicator that is associated with this point
          const pointValue = point.valueProperty.value;
          if ( pointValue === 0 ) {

            // just hide the line entirely in this case
            lineOnNumberLine.visible = false;
          }
          else {
            lineOnNumberLine.visible = true;
            lineOnNumberLine.moveToBack(); // the last line processed will end up at the back of the layering
            lineOnNumberLine.stroke = point.colorProperty.value;
            const pointPosition = point.getPositionInModelSpace();
            lineOnNumberLine.setLine( zeroPosition.x, zeroPosition.y, pointPosition.x, pointPosition.y );
            if ( pointValue > 0 ) {
              pointsAboveZeroCount++;
              lineOnNumberLine.lineWidth = ABS_VAL_MIN_LINE_WIDTH + pointsAboveZeroCount * ABS_VAL_LINE_EXPANSION_FACTOR;
            }
            else {
              pointsBelowZeroCount++;
              lineOnNumberLine.lineWidth = ABS_VAL_MIN_LINE_WIDTH + pointsBelowZeroCount * ABS_VAL_LINE_EXPANSION_FACTOR;
            }
          }
        } );

        // create a list of the absolute value span indicators sorted by their distance from the number line
        const sortedAbsValSpanNodes = _.sortBy( absoluteValueSpanNodes, absValSpanNode => {
          return absValSpanNode.distanceFromNumberLineProperty.value;
        } );

        // Make sure the absolute value span indicators are at the correct distances - this is mostly done to handle
        // changes in the number line orientation.
        sortedAbsValSpanNodes.forEach( ( absValSpanNode, index ) => {
          absValSpanNode.setDistanceFromNumberLine(
            getIndicatorDistanceFromNL( numberLine, index ),
            doAnimation
          );
        } );
      };

      // array where absolute value span nodes are tracked if displayed for this number line node
      let absoluteValueSpanNodes = [];

      // handler for number line points that are added to the number line
      const handlePointAdded = point => {

        // add the node that will represent the point on the number line
        const pointNode = new PointNode( point, numberLine );
        pointDisplayLayer.addChild( pointNode );

        // add the point that will represent the opposite point
        const oppositePointNode = new PointNode( point, numberLine, { isDoppelganger: true } );
        oppositePointDisplayLayer.addChild( oppositePointNode );

        // if enabled, add an absolute value "span indicator", which depicts the absolute value at some distance from
        // the number line
        let absValSpanNode = null;
        if ( options.showAbsoluteValueSpans ) {
          const absValSpanNodeDistance = getIndicatorDistanceFromNL( numberLine, absoluteValueSpanNodes.length );
          absValSpanNode = new AbsoluteValueSpanNode( numberLine, point, absValSpanNodeDistance );
          absoluteValueSpanNodes.push( absValSpanNode );
          this.addChild( absValSpanNode );
        }

        // add a listener that will update the absolute value indicators
        point.valueProperty.link( updateAbsoluteValueIndicators );

        // add a listener that will unhook everything if and when this point is removed
        const removeItemListener = removedPoint => {
          if ( removedPoint === point ) {
            pointDisplayLayer.removeChild( pointNode );
            pointNode.dispose();
            oppositePointDisplayLayer.removeChild( oppositePointNode );
            oppositePointNode.dispose();
            if ( absValSpanNode ) {
              this.removeChild( absValSpanNode );
              absValSpanNode.dispose();
              absoluteValueSpanNodes = _.without( absoluteValueSpanNodes, absValSpanNode );
            }
            updateAbsoluteValueIndicators( true );
            point.valueProperty.unlink( updateAbsoluteValueIndicators );
            numberLine.residentPoints.removeItemRemovedListener( removeItemListener );
          }
        };
        numberLine.residentPoints.addItemRemovedListener( removeItemListener );
      };

      // add nodes for any points that are initially on the number line
      numberLine.residentPoints.forEach( handlePointAdded );

      // handle comings and goings of number line points
      numberLine.residentPoints.addItemAddedListener( handlePointAdded );

      // update portions of the representation that change if the displayed range or orientation changes
      Property.multilink(
        [ numberLine.displayedRangeProperty, numberLine.orientationProperty ],
        ( displayedRange, orientation ) => {

          assert && assert(
            orientation === NumberLineOrientation.HORIZONTAL || orientation === NumberLineOrientation.VERTICAL,
            `Invalid orientation: ${orientation}`
          );

          // remove previous middle and end tickmarks
          middleTickMarksRootNode.removeAllChildren();
          endTickMarksRootNode.removeAllChildren();

          // Derive the tick mark spacing from the range.  This mapping was taken from the Number Line Integers design
          // spec, and could be made into a optional mapping function if more flexibility is needed.
          let tickMarkSpacing;
          switch( numberLine.displayedRangeProperty.value.getLength() ) {
            case 20:
              tickMarkSpacing = 1;
              break;
            case 60:
              tickMarkSpacing = 5;
              break;
            case 200:
              tickMarkSpacing = 25;
              break;
            default:
              tickMarkSpacing = 1;
              break;
          }

          // Draw the tick marks.  These could be optimized to be a single Path node for the ticks if a performance
          // improvement is ever needed.
          const minTickMarkValue = numberLine.displayedRangeProperty.value.min + tickMarkSpacing;
          const maxTickMarkValue = numberLine.displayedRangeProperty.value.max - tickMarkSpacing;

          this.addTickMark( endTickMarksRootNode, displayedRange.min );
          this.addTickMark( endTickMarksRootNode, displayedRange.max );

          for ( let tmValue = minTickMarkValue; tmValue <= maxTickMarkValue; tmValue += tickMarkSpacing ) {
            if ( tmValue !== 0 ) {
              this.addTickMark( middleTickMarksRootNode, tmValue );
            }
          }

          // update absolute value representations
          updateAbsoluteValueIndicators();
        }
      );
    }

    /**
     * method to add a tick mark to the provided parent node for the provided value
     * @param {Node} parentNode
     * @param {number} value
     * @private
     */
    addTickMark( parentNode, value ) {

      // the value for zero is a special case, and uses a longer and thicker tick mark
      const length = value === 0 ? this.options.zeroTickMarkLength : this.options.tickMarkLength;
      const lineWidth = value === 0 ? this.options.zeroTickMarkLineWidth : this.options.tickMarkLineWidth;
      const tickMarkOptions = {
        stroke: this.options.color,
        lineWidth: lineWidth
      };

      // get the center position of the tick mark
      const tmCenter = this.numberLine.valueToModelPosition( value );

      const stringValue = StringUtils.fillIn( this.options.numberDisplayTemplate, {
        number: value,
        units: this.options.numberDisplayUnits
      } );

      if ( this.numberLine.isHorizontal ) {

        const tickMark = new Line( tmCenter.x, tmCenter.y - length, tmCenter.x, tmCenter.y + length, tickMarkOptions );
        parentNode.addChild( tickMark );
        parentNode.addChild( new Text( stringValue, {
          font: this.options.tickMarkLabelFont,
          centerX: tickMark.centerX,
          top: tickMark.bottom + TICK_MARK_LABEL_DISTANCE
        } ) );
      }
      else {

        const tickMark = new Line( tmCenter.x - length, tmCenter.y, tmCenter.x + length, tmCenter.y, tickMarkOptions );
        parentNode.addChild( tickMark );
        parentNode.addChild( new Text( stringValue, {
          font: this.options.tickMarkLabelFont,
          left: tickMark.right + 5,
          centerY: tickMark.centerY
        } ) );
      }
    }
  }

  /**
   * inner class for the point nodes that appear on the number line
   */
  class PointNode extends Node {

    /**
     * @param {NumberLinePoint} numberLinePoint
     * @param {NumberLine} numberLine
     * @param {Object} [options]
     */
    constructor( numberLinePoint, numberLine, options ) {

      options = _.extend( {
        isDoppelganger: false
      }, options );

      super();

      // add the dot
      const circle = new Circle( POINT_NODE_RADIUS, {
        fill: numberLinePoint.colorProperty,
        stroke: options.isDoppelganger ? 'gray' : numberLinePoint.colorProperty
      } );
      this.addChild( circle );

      // create the label text
      const labelTextNode = new Text( numberLinePoint.valueProperty.value, {
        font: new PhetFont( 16 ),
        fill: numberLinePoint.colorProperty
      } );

      // update the background to be the correct size and shape for the given text node
      const updateBackgroundSize = ( backgroundNode, textNode ) => {
        const textBounds = new Bounds2( textNode.left, textNode.top, textNode.right, textNode.bottom );
        textBounds.dilate( 3 );
        backgroundNode.setRectBounds( textBounds );
        backgroundNode.setCornerRadius( 4 );
        return backgroundNode;
      };

      // create a background and add the label text to it
      let labelNode = new Rectangle( 0, 0, 1, 1, { fill: 'white', opacity: 0.85 } );
      labelNode.addChild( labelTextNode );
      labelNode = updateBackgroundSize( labelNode, labelTextNode );

      // add the label and link a listener for visibility
      labelNode.visible = false;
      this.addChild( labelNode );
      const labelVisibilityListener = numberLine.labelsVisibleProperty.linkAttribute( labelNode, 'visible' );

      // move in front of other points when being dragged
      const dragStateHandler = isDragging => {
        isDragging && this.moveToFront();
      };
      numberLinePoint.isDraggingProperty.link( dragStateHandler );

      // update the point representation as it moves
      const multilink = Property.multilink(
        [ numberLinePoint.valueProperty,
          numberLine.oppositesVisibleProperty,
          numberLine.orientationProperty,
          numberLine.displayedRangeProperty
        ], ( value, oppositesVisible ) => {
          if ( options.isDoppelganger ) {
            value = -value;
            this.visible = oppositesVisible;
          }
          circle.center = numberLine.valueToModelPosition( value );

          // update the label text and position
          labelTextNode.text = value;
          labelNode = updateBackgroundSize( labelNode, labelTextNode );
          if ( numberLine.isHorizontal ) {
            labelNode.centerX = circle.centerX;
            labelNode.bottom = circle.y - 20;
          }
          else {
            labelNode.right = circle.x - 20;
            labelNode.centerY = circle.centerY;
          }
        }
      );

      /**
       * @private
       */
      this.disposePointNode = () => {
        numberLine.labelsVisibleProperty.unlinkAttribute( labelVisibilityListener );
        numberLinePoint.isDraggingProperty.unlink( dragStateHandler );
        multilink.dispose();
      };
    }

    // @public
    dispose() {
      this.disposePointNode();
      super.dispose();
    }
  }

  return numberLineIntegers.register( 'NumberLineNode', NumberLineNode );
} );