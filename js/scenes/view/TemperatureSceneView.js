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
  const Panel = require( 'SUN/Panel' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/scenes/view/SceneView' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const TemperaturePointControllerNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/TemperaturePointControllerNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Vector2 = require( 'DOT/Vector2' );
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
  const negativeTemperatureAmountString = require( 'string!NUMBER_LINE_INTEGERS/negativeTemperatureAmount' );
  const positiveTemperatureAmountString = require( 'string!NUMBER_LINE_INTEGERS/positiveTemperatureAmount' );

  // images
  const temperatureMap = require( 'image!NUMBER_LINE_INTEGERS/temperature-map.png' );

  class TemperatureSceneView extends SceneView {
    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds, {
        numberLineOptions: {
          numberDisplayTemplate: temperatureAmountFahrenheitString,
          flipSideOfLabels: true
        }
      } );

      this.celsiusNumberLineNode = new NumberLineNode( sceneModel.celsiusNumberLine, {
        numberDisplayTemplate: temperatureAmountCelsiusString,
        flipSideOfLabels: true,
        visible: false
      } );
      this.fahrenheitNumberLineNode = this.numberLineNode;

      sceneModel.fahrenheitNumberLine.showAbsoluteValuesProperty.link( showAbsoluteValues => {
        sceneModel.celsiusNumberLine.showAbsoluteValuesProperty.value = showAbsoluteValues;
      } );

      this.removeChild( this.numberLineNode );
      const numberLinePanelContent = new Node();
      numberLinePanelContent.addChild( this.fahrenheitNumberLineNode );
      numberLinePanelContent.addChild( this.celsiusNumberLineNode );

      // TODO: temporary version of the map image
      const temperatureMapImage = new Image( temperatureMap );
      temperatureMapImage.scale(
        sceneModel.mapBounds.width / temperatureMapImage.width,
        sceneModel.mapBounds.height / temperatureMapImage.height
      );

      // @private
      this.temperatureMap = new Node( {
        children: [ temperatureMapImage ],
        center: sceneModel.mapBounds.center
      } );
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
      numberLinePanelContent.addChild( numberLineLabel );

      const temperatureUnitPicker = new VerticalAquaRadioButtonGroup(
        sceneModel.isTemperatureInCelsiusProperty,
        [
          {
            value: false,
            node: new Text( temperatureLabelFahrenheitString, { font: UNIT_PICKER_LABEL_FONT } )
          },
          {
            value: true,
            node: new Text( temperatureLabelCelsiusString, { font: UNIT_PICKER_LABEL_FONT } )
          }
        ],
        { top: numberLineLabel.top, left: numberLineLabel.right + 10 }
      );
      numberLinePanelContent.addChild( temperatureUnitPicker );

      // manages absolute value texts whenever thermometers go on and off the map
      const celsiusAbsoluteValueLabelsLayer = new Node();
      const fahrenheitAbsoluteValueLabelsLayer = new Node();
      const onAddedNumberLinePoint = ( numberLine, absoluteValueLabelsLayer, addedNumberLinePoint ) => {
        const absoluteValueText = new Text( '', { font: new PhetFont( 12 ) } );
        const numberLinePointListener = value => {
          const template = value < 0 ? negativeTemperatureAmountString : positiveTemperatureAmountString;
          absoluteValueText.text = StringUtils.fillIn( template, { value: value } );
          absoluteValueText.leftCenter = addedNumberLinePoint.getPositionInModelSpace().plus( new Vector2( 10, 0 ) );
          absoluteValueText.fill = addedNumberLinePoint.colorProperty.value;
        };
        absoluteValueLabelsLayer.addChild( absoluteValueText );
        addedNumberLinePoint.valueProperty.link( numberLinePointListener );
        const removalListener = removedNumberLinePoint => {
          if ( removedNumberLinePoint !== addedNumberLinePoint ) {
            return;
          }
          numberLine.residentPoints.removeItemRemovedListener( removalListener );
          absoluteValueLabelsLayer.removeChild( absoluteValueText );
          addedNumberLinePoint.valueProperty.unlink( numberLinePointListener );
        };
        numberLine.residentPoints.addItemRemovedListener( removalListener );
      };
      sceneModel.celsiusNumberLine.residentPoints.addItemAddedListener(
        addedPoint => onAddedNumberLinePoint( sceneModel.celsiusNumberLine, celsiusAbsoluteValueLabelsLayer, addedPoint )
      );
      sceneModel.fahrenheitNumberLine.residentPoints.addItemAddedListener(
        addedPoint => onAddedNumberLinePoint( sceneModel.fahrenheitNumberLine, fahrenheitAbsoluteValueLabelsLayer, addedPoint )
      );

      numberLinePanelContent.addChild( celsiusAbsoluteValueLabelsLayer );
      numberLinePanelContent.addChild( fahrenheitAbsoluteValueLabelsLayer );

      const numberLinePanel = new Panel(
        numberLinePanelContent,
        {
          fill: 'lightgray',
          stroke: 'transparent',
          resize: false,
          xMargin: 10,
          yMargin: 10
        }
      );
      numberLinePanel.centerY = this.temperatureMap.centerY + 40;
      numberLinePanel.centerX -= 20;
      this.addChild( numberLinePanel );

      Property.multilink(
        [ sceneModel.isTemperatureInCelsiusProperty, sceneModel.showNumberLineProperty, sceneModel.numberLine.showAbsoluteValuesProperty ],
        ( isTemperatureInCelsius, showNumberLine, showAbsoluteValues ) => {
          this.celsiusNumberLineNode.visible = isTemperatureInCelsius;
          this.fahrenheitNumberLineNode.visible = !isTemperatureInCelsius;
          celsiusAbsoluteValueLabelsLayer.visible = this.celsiusNumberLineNode.visible && showAbsoluteValues;
          fahrenheitAbsoluteValueLabelsLayer.visible = this.fahrenheitNumberLineNode.visible && showAbsoluteValues;
          numberLinePanel.visible = showNumberLine;

          // TODO: figure out how to update the comparison statement node
        }
      );

      this.addChild( new Node( {
        children: sceneModel.permanentPointControllers.map(
          pointController => new TemperaturePointControllerNode( pointController )
        )
      } ) );

    }
  }

  return numberLineIntegers.register( 'TemperatureSceneView', TemperatureSceneView );
} );