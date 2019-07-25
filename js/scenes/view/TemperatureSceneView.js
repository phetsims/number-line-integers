// Copyright 2019, University of Colorado Boulder

/**
 * view for the "Temperature" scene
 * TODO: discus how to reduce code duplication between this and ElevationSceneView
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/scenes/view/SceneView' );
  const TemperaturePointControllerNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/TemperaturePointControllerNode' );

  // strings
  //const temperatureAmountCelsiusString = require( 'string!NUMBER_LINE_INTEGERS/temperatureAmountCelsius' );
  const temperatureAmountFahrenheitString = require( 'string!NUMBER_LINE_INTEGERS/temperatureAmountFahrenheit' );

  // images
  const temperatureMap = require( 'image!NUMBER_LINE_INTEGERS/temperature-map.png' );

  class TemperatureSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds, {
        numberLineOptions: {
          numberDisplayTemplate: temperatureAmountFahrenheitString
        }
      } );

      // TODO: temporary version of the map image
      const temperatureMapImage = new Image( temperatureMap );
      temperatureMapImage.scale(
        sceneModel.mapBounds.width / temperatureMapImage.width,
        sceneModel.mapBounds.height / temperatureMapImage.height
      );

      this.temperatureMap = new Node( {
        children: [ temperatureMapImage ]
      } );

      this.temperatureMap.center = sceneModel.mapBounds.center;

      this.addChild( this.temperatureMap );

      // add the node that represents the box that will hold the thermometers
      this.addChild( new Rectangle.bounds( sceneModel.thermometerBoxBounds, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 6
      } ) );

      this.addChild( new Node( {
        children: sceneModel.permanentPointControllers.map(
          pointController => new TemperaturePointControllerNode( pointController )
        )
      } ) );

      // add the layer where the attached point controllers go
      const attachedPointControllersLayer = new Node();
      this.addChild( attachedPointControllersLayer );
      attachedPointControllersLayer.moveToBack(); // so that they are behind the number line in z-order

      // the visibility of the attached point controllers should be the same as the number line
      sceneModel.showNumberLineProperty.linkAttribute( attachedPointControllersLayer, 'visible' );

      // add/remove the nodes that represent the point controllers that are attached to the number line
      //TODO: disable dragging on these new PointControllerNodes
      sceneModel.numberLineAttachedPointControllers.addItemAddedListener( addedPointController => {
        const pointControllerNode = new PointControllerNode( addedPointController );
        attachedPointControllersLayer.addChild( pointControllerNode );
        const handlePointControllerRemoved = removedPointController => {
          if ( addedPointController === removedPointController ) {
            attachedPointControllersLayer.removeChild( pointControllerNode );
            pointControllerNode.dispose();
            sceneModel.numberLineAttachedPointControllers.removeItemRemovedListener( handlePointControllerRemoved );
          }
        };
        sceneModel.numberLineAttachedPointControllers.addItemRemovedListener( handlePointControllerRemoved );
      } );

    }
  }

  return numberLineIntegers.register( 'TemperatureSceneView', TemperatureSceneView );
} );