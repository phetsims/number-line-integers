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
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const TICK_MARK_LABEL_DISTANCE = 5;

  class NumberLineNode extends Node {

    /**
     * {NumberLine} numberLine - model of a number line
     * {Bounds2} displayBounds - the bounds in which the number line should be displayed
     * {Object} [options] - options that control the appearance of the number line
     */
    constructor( numberLine, displayBounds, options ) {

      options = _.extend( {

        // TODO: organize and document when finalized (or close)
        numberLineWidth: 1,
        tickMarkLineWidth: 1,
        tickMarkLength: 10,
        zeroTickMarkLineWidth: 2,
        zeroTickMarkLength: 16,
        tickMarkLabelFont: new PhetFont( 20 ),
        color: 'black'
      }, options );

      // since the position is set based on the model, don't pass options through to parent class
      super();

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

        // remove the previous representation
        numberLineNode.removeAllChildren();

        if ( orientation === 'horizontal' ) {

          // add the arrow node that represents the number line
          numberLineNode.addChild( new ArrowNode(
            displayBounds.minX,
            numberLine.centerPosition.y,
            displayBounds.maxX,
            numberLine.centerPosition.y,
            numberLineOptions
          ) );

          // add the tick mark for the 0 position, which is always visible
          addVerticalTickMark(
            numberLineNode,
            numberLineNode.centerX,
            numberLineNode.centerY,
            options.zeroTickMarkLength,
            options.zeroTickMarkLineWidth,
            options.color,
            '0',
            options.tickMarkLabelFont
          );
        }
        else {
          assert && assert( false, 'vertical orientation not handled yet (please add it!)' );
        }
      } );

      // handle the tick marks at the ends of the display range
      const endTickMarksRootNode = new Node();
      this.addChild( endTickMarksRootNode );
      Property.multilink(
        [ numberLine.displayedRangeProperty, numberLine.orientationProperty, numberLine.scaleProperty ],
        ( displayedRange, orientation, scale ) => {
          endTickMarksRootNode.removeAllChildren();
          if ( orientation === 'horizontal' ) {
            const leftValue = displayedRange.min;
            const leftXPosition = numberLine.centerPosition.x + scale * leftValue;
            addVerticalTickMark(
              endTickMarksRootNode,
              leftXPosition,
              numberLine.centerPosition.y,
              options.tickMarkLength,
              options.tickMarkLineWidth,
              options.color,
              leftValue,
              options.tickMarkLabelFont
            );
            const rightValue = displayedRange.max;
            const rightXPosition = numberLine.centerPosition.x + scale * rightValue;
            addVerticalTickMark(
              endTickMarksRootNode,
              rightXPosition,
              numberLine.centerPosition.y,
              options.tickMarkLength,
              options.tickMarkLineWidth,
              options.color,
              rightValue,
              options.tickMarkLabelFont
            );
          }
          else {
            assert && assert( false, 'vertical orientation not handled yet (please add it!)' );
          }
        }
      );

      // add the root node for the tick marks
      const tickMarksNode = new Node();
      this.addChild( tickMarksNode );

      // only show the

      // the following function closure will update the tick marks when

    }
  }

  function addVerticalTickMark( parentNode, centerX, centerY, height, lineWidth, stroke, value, labelFont ) {
    const tickMark = new Line( centerX, centerY - height, centerX, centerY + height, {
      stroke: stroke,
      lineWidth: lineWidth
    } );
    parentNode.addChild( tickMark );
    parentNode.addChild( new Text( value, {
      font: labelFont,
      centerX: tickMark.centerX,
      top: tickMark.bottom + TICK_MARK_LABEL_DISTANCE
    } ) );

  }

  return numberLineIntegers.register( 'NumberLineNode', NumberLineNode );
} );