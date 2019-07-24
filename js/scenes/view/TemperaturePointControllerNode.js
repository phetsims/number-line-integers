// Copyright 2019, University of Colorado Boulder

/**
 * A scenery node that is used to control point positions in the temperature scene
 * based on the temperature of the map below this node
 * TODO: migrate EFAC TemperatureAndColorSensorNode to SCENERY_PHET and make this node extend/add that
 *
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );

  class TemperaturePointControllerNode extends PointControllerNode {

    constructor( pointController, options ) {

      options = _.extend( {
        connectorLine: false
      }, options );

      super( pointController, options );

    }

  }

  return numberLineIntegers.register( 'TemperaturePointControllerNode', TemperaturePointControllerNode );
} );