// Copyright 2019, University of Colorado Boulder

/**
 * a point on a number line in the "Number Line" suite of sims
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PaintColorProperty = require( 'SCENERY/util/PaintColorProperty' );

  class NumberLinePoint {

    /**
     * {number} initialValue - the value on the number line
     * {Color} color - the color that should be used to portray this point in the view
     * {NumberLine} numberLine - the number line on which this point exists
     * {PointController} [controller] - the controller that will move this point
     */
    constructor( initialValue, color, numberLine, controller = null ) {

      // @public {NumberProperty} - portrayed value on the number line
      this.valueProperty = new NumberProperty( initialValue );

      // @public {PaintColorProperty}
      this.colorProperty = new PaintColorProperty( color );

      // @private
      this.numberLine = numberLine;
      this.controller = controller;
    }

    /**
     * get the position of this number line point in model space
     * @returns {Vector2}
     * @public
     */
    getPositionInModelSpace() {
      return this.numberLine.valueToModelPosition( this.valueProperty.value );
    }
  }

  return numberLineIntegers.register( 'NumberLinePoint', NumberLinePoint );
} );