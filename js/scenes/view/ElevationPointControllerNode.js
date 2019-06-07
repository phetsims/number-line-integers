// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to control point positions in the "Elevation" scene of the Number Line Integers sim
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );

  class ElevationPointControllerNode extends PointControllerNode {

    /**
     * @param {PointController) pointController
     * @param {Object} [options]
     */
    constructor( pointController, options ) {

      super( pointController, options );
    }
  }

  return numberLineIntegers.register( 'ElevationPointControllerNode', ElevationPointControllerNode );
} );