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
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Range = require( 'DOT/Range' );
  const TemperatureAndColorSensorNode = require( 'SCENERY_PHET/TemperatureAndColorSensorNode' );
  const Text = require( 'SCENERY/nodes/Text' );

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
        new Range( -62, 104 ),
        pointController.fahrenheitTemperatureProperty,
        pointController.colorProperty,
        {
          thermometerNodeOptions: {
            fluidMainColor: new Color( 66, 66, 65 ),
            fluidHighlightColor: new Color( 215, 215, 215 ),
            tickSpacingTemperature: 20
          }
        }
      );
      compositeThermometerNode.addChild( temperatureAndColorSensorNode );

      const thermometerLabel = new Text( pointController.label, {
        font: new PhetFont( 16 ),
        centerX: temperatureAndColorSensorNode.thermometerBounds.centerX,
        top: temperatureAndColorSensorNode.top + 2
      } );
      compositeThermometerNode.addChild( thermometerLabel );

      super( pointController, options );
    }
  }

  return numberLineIntegers.register( 'TemperaturePointControllerNode', TemperaturePointControllerNode );
} );