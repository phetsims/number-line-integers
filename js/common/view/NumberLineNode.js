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
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
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

          // Draw the tick marks.  This could be optimized to be a single Path node for the ticks if a performance
          // improvement is ever needed.
          const tickMarkSpacing = numberLine.tickMarkSpacingProperty.value;
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

      if ( this.numberLine.orientationProperty.value === NumberLineOrientation.HORIZONTAL ) {

        // determine the location of this tick mark
        const centerX = this.numberLine.centerPosition.x + this.numberLineScale * value;
        const centerY = this.numberLine.centerPosition.y;

        const tickMark = new Line( centerX, centerY - length, centerX, centerY + length, tickMarkOptions );
        parentNode.addChild( tickMark );
        parentNode.addChild( new Text( value, {
          font: this.options.tickMarkLabelFont,
          centerX: tickMark.centerX,
          top: tickMark.bottom + TICK_MARK_LABEL_DISTANCE
        } ) );
      }
      else {

        // determine the location of this tick mark
        const centerX = this.numberLine.centerPosition.x;
        const centerY = this.numberLine.centerPosition.y - this.numberLineScale * value;

        const tickMark = new Line( centerX - length, centerY, centerX + length, centerY, tickMarkOptions );
        parentNode.addChild( tickMark );
        parentNode.addChild( new Text( value, {
          font: this.options.tickMarkLabelFont,
          left: tickMark.right + 5,
          centerY: tickMark.centerY
        } ) );
      }
    }
  }

  return numberLineIntegers.register( 'NumberLineNode', NumberLineNode );
} );