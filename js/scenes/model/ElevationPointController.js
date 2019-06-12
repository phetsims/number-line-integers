// Copyright 2019, University of Colorado Boulder

/**
 * a point controller with some extensions that are specific to the "Elevation" scene
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );

  class ElevationPointController extends PointController {

    /**
     * {Vector2} initialPosition
     * {Bounds2} elevationAreaBounds
     * {NumberLine} numberLine - the number line on which this controller will be moving points
     */
    constructor( numberLine, elevationAreaBounds, options ) {

      options = _.extend( {

        // this style of point controller never locks to the number line
        lockToNumberLine: 'never'
      }, options );

      super( numberLine, options );
    }
  }


  return numberLineIntegers.register( 'ElevationPointController', ElevationPointController );
} );