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
        tickMarkLabelFont: new PhetFont( 16 ),
        color: 'black',

        // {number} - the distance between the edge of the display bounds and the ends of the displayed range
        displayedRangeInset: 40
      }, options );

      // since the position is set based on the model, don't pass options through to parent class
      super();

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
          this.addTickMark( numberLineNode, 0 );
        }
        else {
          assert && assert( false, 'vertical orientation not handled yet (please add it!)' );
        }
      } );

      // handle the tick marks at the ends of the display range
      const endTickMarksRootNode = new Node();
      this.addChild( endTickMarksRootNode );

      // add the root node for the tick marks that exist between the middle and the end
      const middleTickMarksRootNode = new Node();
      numberLine.tickMarksVisibleProperty.linkAttribute( middleTickMarksRootNode, 'visible' );
      this.addChild( middleTickMarksRootNode );

      // update the middle and end tick marks based on the properties that affect it
      Property.multilink(
        [ numberLine.displayedRangeProperty, numberLine.orientationProperty ],
        ( displayedRange, orientation ) => {

          // remove previous representations
          middleTickMarksRootNode.removeAllChildren();
          endTickMarksRootNode.removeAllChildren();

          // Draw the tick marks.  This could be optimized to be a single Path node for the ticks if a performance
          // improvement is ever needed.
          const tickMarkSpacing = numberLine.tickMarkSpacingProperty.value;
          const minTickMarkValue = numberLine.displayedRangeProperty.value.min + tickMarkSpacing;
          const maxTickMarkValue = numberLine.displayedRangeProperty.value.max - tickMarkSpacing;
          if ( orientation === 'horizontal' ) {

            // update the scale
            this.numberLineScale = ( displayBounds.width - options.displayedRangeInset * 2 ) / displayedRange.getLength();

            const leftValue = displayedRange.min;
            this.addTickMark( endTickMarksRootNode, leftValue );
            const rightValue = displayedRange.max;
            this.addTickMark( endTickMarksRootNode, rightValue );

            for ( let tmValue = minTickMarkValue; tmValue <= maxTickMarkValue; tmValue += tickMarkSpacing ) {
              if ( tmValue !== 0 ) {
                this.addTickMark( middleTickMarksRootNode, tmValue );
              }
            }
          }
          else {
            assert && assert( false, 'vertical orientation not handled yet (please add it!)' );
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

      if ( this.numberLine.orientationProperty.value === 'horizontal' ) {

        // determine the location of this tick mark
        const centerX = this.numberLine.centerPosition.x + this.numberLineScale * value;
        const centerY = this.numberLine.centerPosition.y;

        // the value for zero is a special case, and uses a longer and thinker tick mark
        const height = value === 0 ? this.options.zeroTickMarkLength : this.options.tickMarkLength;
        const lineWidth = value === 0 ? this.options.zeroTickMarkLineWidth : this.options.tickMarkLineWidth;
        const tickMark = new Line( centerX, centerY - height, centerX, centerY + height, {
          stroke: this.options.color,
          lineWidth: lineWidth
        } );
        parentNode.addChild( tickMark );
        parentNode.addChild( new Text( value, {
          font: this.options.tickMarkLabelFont,
          centerX: tickMark.centerX,
          top: tickMark.bottom + TICK_MARK_LABEL_DISTANCE
        } ) );
      }
    }
  }

  return numberLineIntegers.register( 'NumberLineNode', NumberLineNode );
} );