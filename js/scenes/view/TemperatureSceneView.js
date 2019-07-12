// Copyright 2019, University of Colorado Boulder

/**
 * view for the "Temperature" scene
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/scenes/view/SceneView' );

  // images
  const temperatureMap = require( 'image!NUMBER_LINE_INTEGERS/temperature-map.png' );

  class TemperatureSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds );

      // TODO: temporary version of the map image
      const temperatureMapImage = new Image( temperatureMap, { scale: 0.7 } );
      temperatureMapImage.center = layoutBounds.center;
      this.addChild( temperatureMapImage );
    }
  }

  return numberLineIntegers.register( 'TemperatureSceneView', TemperatureSceneView );
} );