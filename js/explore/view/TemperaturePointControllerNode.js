// Copyright 2019, University of Colorado Boulder

/**
 * A scenery node that is used to control point positions in the temperature scene based on the temperature of the map
 * below this node
 *
 * @author Arnab Purkayastha
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Range = require( 'DOT/Range' );
  const TemperatureAndColorSensorNode = require( 'SCENERY_PHET/TemperatureAndColorSensorNode' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const TOUCH_DILATION = 5;

  class TemperaturePointControllerNode extends PointControllerNode {

    /**
     * @param {TemperaturePointController} pointController
     * @param {Object} [options]
     */
    constructor( pointController, options ) {

      // create a node that contains thermometer and triangle
      const compositeThermometerNode = new Node();

      options = merge( {
        node: compositeThermometerNode,
        connectorLine: false
      }, options );

      // TODO: min/max Temp values will need to be put into constants file
      const temperatureAndColorSensorNode = new TemperatureAndColorSensorNode(
        new Range( -85, 104 ),
        pointController.fahrenheitTemperatureProperty,
        pointController.colorProperty,
        {
          thermometerNodeOptions: {
            fluidMainColor: new Color( 0, 120, 0 ),
            fluidHighlightColor: new Color( 0, 210, 0 ),
            backgroundFill: 'rgba( 255, 255, 255, 0.9 )',
            tickSpacingTemperature: 20,
            majorTickLength: 0,
            minorTickLength: 0
          }
        }
      );
      compositeThermometerNode.addChild( temperatureAndColorSensorNode );

      const thermometerLabel = new Text( pointController.label, {
        font: new PhetFont( 16 ),
        centerX: temperatureAndColorSensorNode.thermometerBounds.centerX,
        top: temperatureAndColorSensorNode.top + 3 // offset empirically determined
      } );
      compositeThermometerNode.addChild( thermometerLabel );

      compositeThermometerNode.touchArea = compositeThermometerNode.bounds.dilated( TOUCH_DILATION );

      super( pointController, options );
    }
  }

  return numberLineIntegers.register( 'TemperaturePointControllerNode', TemperaturePointControllerNode );
} );
