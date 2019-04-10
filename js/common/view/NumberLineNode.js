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
        tickMarkWidth: 1,
        zeroTickMarkWidth: 2,
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
            displayBounds.centerY,
            displayBounds.maxX,
            displayBounds.centerY,
            numberLineOptions
          ) );

          // add the tick mark for the 0 position, which is always visible
          const zeroTickMark = new Line(
            numberLineNode.centerX,
            numberLineNode.centerY - options.zeroTickMarkLength,
            numberLineNode.centerX,
            numberLineNode.centerY + options.zeroTickMarkLength,
            {
              stroke: options.color,
              lineWidth: options.zeroTickMarkWidth
            }
          );
          numberLineNode.addChild( zeroTickMark );
          numberLineNode.addChild( new Text( '0', {
            font: options.tickMarkLabelFont,
            centerX: zeroTickMark.centerX,
            top: zeroTickMark.bottom + TICK_MARK_LABEL_DISTANCE
          } ) );
        }
        numberLineNode.center = displayBounds.center;
      } );

      // add the tick marks at zero and the ends, which are always visible, and update

      // add the root node for the tick marks
      const tickMarksNode = new Node();
      this.addChild( tickMarksNode );

      // only show the

      // the following function closure will update the tick marks when

    }
  }

  return numberLineIntegers.register( 'NumberLineNode', NumberLineNode );
} );