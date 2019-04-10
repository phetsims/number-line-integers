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
  const Node = require( 'SCENERY/nodes/Node' );

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
        color: 'black'
      }, options );

      // since the position is set based on the model, don't pass options through to parent class
      super();

      // add the number line itself
      const numberLineOptions = {
        doubleHead: true,
        lineWidth: options.numberLineWidth,
        tailWidth: options.numberLineWidth,
        headHeight: 10,
        headWidth: 10,
        stroke: options.color,
        fill: options.color
      };

      let numberLineNode = null;
      numberLine.orientationProperty.link( orientation => {

        // remove the previous representation if present
        if ( numberLineNode ) {
          this.removeChild( numberLineNode );
        }

        // add the arrow node that represents the number line
        if ( orientation === 'horizontal' ) {
          numberLineNode = new ArrowNode(
            displayBounds.minX,
            displayBounds.centerY,
            displayBounds.maxX,
            displayBounds.centerY,
            numberLineOptions
          );
          numberLineNode.center = displayBounds.center;
          this.addChild( numberLineNode );
        }
      } );

    }
  }

  return numberLineIntegers.register( 'NumberLineNode', NumberLineNode );
} );