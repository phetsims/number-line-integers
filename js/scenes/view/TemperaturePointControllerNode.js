// Copyright 2019, University of Colorado Boulder

/**
 * A scenery node that is used to control point positions in the temperature scene
 * based on the temperature of the map below this node
 * TODO: decide how to merge this and EFAC TemperatureAndColorSensorNode to SCENERY_PHET
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
  const Path = require( 'SCENERY/nodes/Path' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Shape = require( 'KITE/Shape' );
  const ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );

  // constants
  const TRIANGLE_SIDE_LENGTH = 18; // in screen coordinates

  class TemperaturePointControllerNode extends PointControllerNode {

    /**
     * @param {PointController} pointController
     * @param {Object} [options]
     */
    constructor( pointController, options ) {

      // create a node that contains thermometer and triangle
      const compositeThermometerNode = new Node();

      options = _.extend( {
        node: compositeThermometerNode,
        connectorLine: false
      }, options );

      const triangleShape = new Shape();
      triangleShape.moveTo( 0, 0 )
        .lineTo( Math.cos( Math.PI / 6 ) * TRIANGLE_SIDE_LENGTH, -Math.sin( Math.PI / 6 ) * TRIANGLE_SIDE_LENGTH )
        .lineTo( Math.cos( Math.PI / 6 ) * TRIANGLE_SIDE_LENGTH, Math.sin( Math.PI / 6 ) * TRIANGLE_SIDE_LENGTH )
        .close();

      const colorIndicatorNode = new Path( triangleShape, {
        fill: new Color( 0, 0, 0, 0 ),
        lineWidth: 2,
        stroke: 'black',
        lineJoin: 'round'
      } );
      pointController.colorProperty.link( color => {
        colorIndicatorNode.fill = color;
      } );
      compositeThermometerNode.addChild( colorIndicatorNode );

      // TODO: min/max Temp values will need to be put into constants file
      const thermometerNode = new ThermometerNode(
        -100,
        100,
        pointController.temperatureProperty,
        {
          bulbDiameter: 30,
          tubeWidth: 18,
          lineWidth: 2,
          tickSpacingTemperature: 25,
          majorTickLength: 10,
          minorTickLength: 5,
          backgroundFill: new Color( 256, 256, 256, 0.67 ),
          left: colorIndicatorNode.right + 3,
          bottom: colorIndicatorNode.bottom + 5
        } );
      compositeThermometerNode.addChild( thermometerNode );

      super( pointController, options );

      pointController.positionProperty.link( () => { this.moveToFront(); } );

    }

  }

  return numberLineIntegers.register( 'TemperaturePointControllerNode', TemperaturePointControllerNode );
} );