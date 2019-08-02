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
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/scenes/view/SceneView' );
  const TemperaturePointControllerNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/TemperaturePointControllerNode' );
  const TemperatureSceneModel = require( 'NUMBER_LINE_INTEGERS/scenes/model/TemperatureSceneModel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // constants
  const NUMBER_LINE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  const UNIT_PICKER_LABEL_FONT = new PhetFont( { size: 18 } );

  // strings
  const temperatureString = require( 'string!NUMBER_LINE_INTEGERS/temperature' );
  const temperatureAmountCelsiusString = require( 'string!NUMBER_LINE_INTEGERS/temperatureAmountCelsius' );
  const temperatureAmountFahrenheitString = require( 'string!NUMBER_LINE_INTEGERS/temperatureAmountFahrenheit' );
  const temperatureLabelFahrenheitString = require( 'string!NUMBER_LINE_INTEGERS/temperatureLabelFahrenheit' );
  const temperatureLabelCelsiusString = require( 'string!NUMBER_LINE_INTEGERS/temperatureLabelCelsius' );

  // images
  const temperatureMap = require( 'image!NUMBER_LINE_INTEGERS/temperature-map.png' );

  class TemperatureSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      // TODO: this change should be specific to the TemperatureScene implementation of the numberline
      const numberLineUnits = sceneModel.temperatureUnitsProperty.value === TemperatureSceneModel.Units.FAHRENHEIT ?
                              temperatureAmountFahrenheitString : temperatureAmountCelsiusString;

      super( sceneModel, layoutBounds, {
        numberLineOptions: {
          numberDisplayTemplate: numberLineUnits,
          flipSideOfLabels: true
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

      // add label for the number line
      const numberLineLabel = new Text( temperatureString, {
        font: NUMBER_LINE_LABEL_FONT,
        centerX: sceneModel.numberLine.centerPosition.x,
        bottom: this.numberLineNode.top - 5
      } );
      sceneModel.showNumberLineProperty.linkAttribute( numberLineLabel, 'visible' );
      this.addChild( numberLineLabel );

      const temperatureUnitPicker = new VerticalAquaRadioButtonGroup(
        sceneModel.temperatureUnitsProperty,
        [
          {
            value: TemperatureSceneModel.Units.FAHRENHEIT,
            node: new Text( temperatureLabelFahrenheitString, { font: UNIT_PICKER_LABEL_FONT } )
          },
          {
            value: TemperatureSceneModel.Units.CELSIUS,
            node: new Text( temperatureLabelCelsiusString, { font: UNIT_PICKER_LABEL_FONT } )
          }
        ],
        { top: numberLineLabel.top, left: numberLineLabel.right + 10 }
      );
      this.addChild( temperatureUnitPicker );

      this.addChild( new Node( {
        children: sceneModel.permanentPointControllers.map(
          pointController => new TemperaturePointControllerNode( pointController )
        )
      } ) );

    }
  }

  return numberLineIntegers.register( 'TemperatureSceneView', TemperatureSceneView );
} );