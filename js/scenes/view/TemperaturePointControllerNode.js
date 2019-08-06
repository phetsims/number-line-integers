// Copyright 2019, University of Colorado Boulder

/**
 * A scenery node that is used to control point positions in the temperature scene
 * based on the temperature of the map below this node
 *
 * @author Arnab Purkayastha
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const TemperatureAndColorSensorNode = require( 'SCENERY_PHET/TemperatureAndColorSensorNode' );

  class TemperaturePointControllerNode extends PointControllerNode {

    /**
     * @param {TemperaturePointController} pointController
     * @param {Object} [options]
     */
    constructor( pointController, options ) {

      // create a node that contains thermometer and triangle
      const compositeThermometerNode = new Node();

      options = _.extend( {
        node: compositeThermometerNode,
        connectorLine: false
      }, options );

      // TODO: min/max Temp values will need to be put into constants file
      const temperatureAndColorSensorNode = new TemperatureAndColorSensorNode(
        -62,
        104,
        pointController.fahrenheitTemperatureProperty,
        {
          thermometerNodeOptions: {
            fluidMainColor: new Color( 66, 66, 65 ),
            fluidHighlightColor: new Color( 215, 215, 215 ),
            tickSpacingTemperature: 20
          }
        }
      );
      pointController.colorProperty.link( color => { temperatureAndColorSensorNode.changeColor( color ); } );
      compositeThermometerNode.addChild( temperatureAndColorSensorNode );

      super( pointController, options );

    }

  }

  return numberLineIntegers.register( 'TemperaturePointControllerNode', TemperaturePointControllerNode );
} );