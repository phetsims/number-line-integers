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
     * {PointController} [controller] - the controller that will move this point
     */
    constructor( initialValue, color, controller = null ) {

      // @public {NumberProperty} - portrayed value on the number line
      this.valueProperty = new NumberProperty( initialValue );

      // @public {PaintColorProperty}
      this.colorProperty = new PaintColorProperty( color );

      // @private
      this.controller = controller;
    }
  }

  return numberLineIntegers.register( 'NumberLinePoint', NumberLinePoint );
} );