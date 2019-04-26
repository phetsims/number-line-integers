// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that presents a number line to the user
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Line = require( 'SCENERY/nodes/Line' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const TICK_MARK_LABEL_DISTANCE = 5;
  const POINT_NODE_RADIUS = 5;

  class NumberLineNode extends Node {

    /**
     * {NumberLine} numberLine - model of a number line
     * {Bounds2} displayBounds - the bounds in which the number line should be displayed
     * {Object} [options] - options that control the appearance of the number line
     */
    constructor( numberLine, options ) {

      options = _.extend( {

        // TODO: organize and document when finalized (or close)
        numberLineWidth: 1,
        tickMarkLineWidth: 1,
        tickMarkLength: 10,
        zeroTickMarkLineWidth: 2,
        zeroTickMarkLength: 16,
        tickMarkLabelFont: new PhetFont( 16 ),
        color: 'black',
        pointRadius: 10,

        // {number} - the distance between the edge of the display bounds and the ends of the displayed range
        displayedRangeInset: NLIConstants.GENERIC_SCREEN_DISPLAYED_RANGE_INSET
      }, options );

      // since the position is set based on the model, don't pass options through to parent class
      super();

      assert && assert( numberLine.modelProjectionBounds, 'this number line is net set up to be displayed' );
      const displayBounds = numberLine.modelProjectionBounds.dilated( options.displayedRangeInset );

      // @private {Object} - make options available to methods
      this.options = options;

      // @private {NumberLine} - make the number line model available to methods
      this.numberLine = numberLine;

      // @private {number}
      this.numberLineScale = 1;

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

      // add the layer where the points on the number line will be displayed
      const pointDisplayLayer = new Node();
      this.addChild( pointDisplayLayer );

      // handler for adding point nodes that correspond to points
      function addNodeForPoint( point ) {
        const pointNode = new PointNode( point, numberLine );
        pointDisplayLayer.addChild( pointNode );

        const removeItemListener = removedPoint => {
          if ( removedPoint === point ) {
            pointDisplayLayer.removeChild( pointNode );
            pointNode.dispose();
            numberLine.residentPoints.removeItemRemovedListener( removeItemListener );
          }
        };
        numberLine.residentPoints.addItemRemovedListener( removeItemListener );
      }

      // add nodes for any points that are initially on the number line
      numberLine.residentPoints.forEach( addNodeForPoint );

      // handle comings and goings of number line points
      numberLine.residentPoints.addItemAddedListener( addNodeForPoint );

      // update the middle and end tick marks based on the properties that affect it
      Property.multilink(
        [ numberLine.displayedRangeProperty, numberLine.orientationProperty ],
        ( displayedRange, orientation ) => {

          assert && assert(
            orientation === NumberLineOrientation.HORIZONTAL || orientation === NumberLineOrientation.VERTICAL,
            `Invalid orientation: ${orientation}`
          );

          // remove previous representations
          middleTickMarksRootNode.removeAllChildren();
          endTickMarksRootNode.removeAllChildren();

          // Derive the tick mark spacing from the range.  This mapping was taken from the Number Line Integers design
          // spec, and could be made into a optional mapping function if more flexibility is needed.
          let tickMarkSpacing;
          switch( numberLine.displayedRangeProperty.value.getLength() ) {
            case 20:
              tickMarkSpacing = 1;
              break;
            case 40:
              tickMarkSpacing = 5;
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

          // Draw the tick marks.  This could be optimized to be a single Path node for the ticks if a performance
          // improvement is ever needed.
          const minTickMarkValue = numberLine.displayedRangeProperty.value.min + tickMarkSpacing;
          const maxTickMarkValue = numberLine.displayedRangeProperty.value.max - tickMarkSpacing;

          if ( orientation === NumberLineOrientation.HORIZONTAL ) {

            // update the scale
            this.numberLineScale = ( displayBounds.width - options.displayedRangeInset * 2 ) / displayedRange.getLength();
          }
          else {

            // update the scale
            this.numberLineScale = ( displayBounds.height - options.displayedRangeInset * 2 ) / displayedRange.getLength();
          }

          this.addTickMark( endTickMarksRootNode, displayedRange.min );
          this.addTickMark( endTickMarksRootNode, displayedRange.max );

          for ( let tmValue = minTickMarkValue; tmValue <= maxTickMarkValue; tmValue += tickMarkSpacing ) {
            if ( tmValue !== 0 ) {
              this.addTickMark( middleTickMarksRootNode, tmValue );
            }
          }
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

      if ( this.numberLine.isHorizontal() ) {

        const tickMark = new Line( tmCenter.x, tmCenter.y - length, tmCenter.x, tmCenter.y + length, tickMarkOptions );
        parentNode.addChild( tickMark );
        parentNode.addChild( new Text( value, {
          font: this.options.tickMarkLabelFont,
          centerX: tickMark.centerX,
          top: tickMark.bottom + TICK_MARK_LABEL_DISTANCE
        } ) );
      }
      else {

        const tickMark = new Line( tmCenter.x - length, tmCenter.y, tmCenter.x + length, tmCenter.y, tickMarkOptions );
        parentNode.addChild( tickMark );
        parentNode.addChild( new Text( value, {
          font: this.options.tickMarkLabelFont,
          left: tickMark.right + 5,
          centerY: tickMark.centerY
        } ) );
      }
    }
  }

  class PointNode extends Node {

    /**
     * @param {NumberLinePoint} numberLinePoint
     * @param {numberLine} numberLine
     */
    constructor( numberLinePoint, numberLine ) {

      super();

      // add the dot
      const circle = new Circle( POINT_NODE_RADIUS, { fill: numberLinePoint.colorProperty } );
      this.addChild( circle );

      // update the point representation as it moves
      this.multilink = Property.multilink(
        [ numberLinePoint.valueProperty, numberLine.orientationProperty, numberLine.displayedRangeProperty ], () => {
          circle.center = numberLinePoint.getPositionInModelSpace();
        }
      );
    }

    // @public
    dispose() {
      this.multilink.dispose();
      super.dispose();
    }
  }

  return numberLineIntegers.register( 'NumberLineNode', NumberLineNode );
} );