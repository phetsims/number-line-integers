// Copyright 2019, University of Colorado Boulder

/**
 * view for the "Temperature" scene
 * TODO: investigate reducing code duplication between this and ElevationSceneView
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const ComparisonStatementNode = require( 'NUMBER_LINE_INTEGERS/common/view/ComparisonStatementNode' );
  const Panel = require( 'SUN/Panel' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
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

      // Replace single default numberLineNode with two from celsius and fahrenheit
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

      // Do the same replacement with ComparisonStatementAccordionBox
      const celsiusComparisonStatementNode = new ComparisonStatementNode( sceneModel.celsiusNumberLine );
      this.celsiusComparisonAccordionBox = new AccordionBox(
        celsiusComparisonStatementNode,
        NLIConstants.COMPARISON_STATEMENT_ACCORDION_BOX_OPTIONS
      );
      this.fahrenheitComparisonAccordionBox = this.comparisonStatementAccordionBox;
      celsiusComparisonStatementNode.selectedOperatorProperty.link( selectedOperator => {
        this.comparisonStatementNode.selectedOperatorProperty.value = selectedOperator;
      } );
      this.comparisonStatementNode.selectedOperatorProperty.link( selectedOperator => {
        celsiusComparisonStatementNode.selectedOperatorProperty.value = selectedOperator;
      } );
      this.addChild( this.celsiusComparisonAccordionBox );

      // world map with temperature data
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

      // manages the label texts for each thermometer
      const celsiusLabelsLayer = new Node();
      const fahrenheitLabelsLayer = new Node();
      const onAddedNumberLinePoint = ( numberLine, labelsLayer, addedNumberLinePoint ) => {
        const labelText = new Text( addedNumberLinePoint.controller.label, { font: new PhetFont( 16 ) } );
        const numberLinePointListener = () => {
          labelText.leftCenter = addedNumberLinePoint.getPositionInModelSpace().plus( new Vector2( 15, 0 ) );
        };
        labelsLayer.addChild( labelText );
        addedNumberLinePoint.valueProperty.link( numberLinePointListener );
        const removalListener = removedNumberLinePoint => {
          if ( removedNumberLinePoint !== addedNumberLinePoint ) {
            return;
          }
          numberLine.residentPoints.removeItemRemovedListener( removalListener );
          labelsLayer.removeChild( labelText );
          addedNumberLinePoint.valueProperty.unlink( numberLinePointListener );
        };
        numberLine.residentPoints.addItemRemovedListener( removalListener );
      };

      // manages absolute value texts whenever thermometers go on and off the map
      const celsiusAbsoluteValueLabelsLayer = new Node();
      const fahrenheitAbsoluteValueLabelsLayer = new Node();
      const onAddedNumberLinePointAbsoluteValue = ( numberLine, absoluteValueLabelsLayer, addedNumberLinePoint ) => {
        const textBackground = new Rectangle( 0, 0, 1, 1, 0, 0, { fill: 'black' } );
        const absoluteValueText = new Text( '', { font: new PhetFont( 12 ) } );
        const numberLinePointListener = value => {
          const template = value < 0 ? negativeTemperatureAmountString : positiveTemperatureAmountString;
          absoluteValueText.text = StringUtils.fillIn( template, { value: value } );
          absoluteValueText.fill = addedNumberLinePoint.colorProperty.value;
          textBackground.setRectWidth( absoluteValueText.width + 3 );
          textBackground.setRectHeight( absoluteValueText.height + 3 );
          textBackground.leftCenter = addedNumberLinePoint.getPositionInModelSpace().plus( new Vector2( 30, 0 ) );
          absoluteValueText.center = textBackground.center;
        };
        absoluteValueLabelsLayer.addChild( textBackground );
        absoluteValueLabelsLayer.addChild( absoluteValueText );
        addedNumberLinePoint.valueProperty.link( numberLinePointListener );
        const removalListener = removedNumberLinePoint => {
          if ( removedNumberLinePoint !== addedNumberLinePoint ) {
            return;
          }
          numberLine.residentPoints.removeItemRemovedListener( removalListener );
          absoluteValueLabelsLayer.removeChild( absoluteValueText );
          absoluteValueLabelsLayer.removeChild( textBackground );
          addedNumberLinePoint.valueProperty.unlink( numberLinePointListener );
        };
        numberLine.residentPoints.addItemRemovedListener( removalListener );
      };

      sceneModel.celsiusNumberLine.residentPoints.addItemAddedListener( addedPoint => {
        onAddedNumberLinePoint( sceneModel.celsiusNumberLine, celsiusLabelsLayer, addedPoint );
        onAddedNumberLinePointAbsoluteValue( sceneModel.celsiusNumberLine, celsiusAbsoluteValueLabelsLayer, addedPoint );
      } );
      sceneModel.fahrenheitNumberLine.residentPoints.addItemAddedListener( addedPoint => {
        onAddedNumberLinePoint( sceneModel.fahrenheitNumberLine, fahrenheitLabelsLayer, addedPoint );
        onAddedNumberLinePointAbsoluteValue( sceneModel.fahrenheitNumberLine, fahrenheitAbsoluteValueLabelsLayer, addedPoint );
      } );

      numberLinePanelContent.addChild( celsiusLabelsLayer );
      numberLinePanelContent.addChild( fahrenheitLabelsLayer );
      numberLinePanelContent.addChild( celsiusAbsoluteValueLabelsLayer );
      numberLinePanelContent.addChild( fahrenheitAbsoluteValueLabelsLayer );

      const numberLinePanel = new Panel(
        numberLinePanelContent,
        {
          fill: 'lightgray',
          stroke: 'transparent',
          resize: false,
          xMargin: 10,
          yMargin: 10,
          centerX: this.temperatureMap.left / 2, // centered between left edge of scene and left edge of map
          top: this.comparisonStatementAccordionBox.top
        }
      );
      this.addChild( numberLinePanel );

      Property.multilink(
        [ sceneModel.isTemperatureInCelsiusProperty, sceneModel.showNumberLineProperty, sceneModel.numberLine.showAbsoluteValuesProperty ],
        ( isTemperatureInCelsius, showNumberLine, showAbsoluteValues ) => {
          this.celsiusNumberLineNode.visible = isTemperatureInCelsius;
          this.fahrenheitNumberLineNode.visible = !isTemperatureInCelsius;
          this.celsiusComparisonAccordionBox.visible = this.celsiusNumberLineNode.visible;
          this.fahrenheitComparisonAccordionBox.visible = this.fahrenheitNumberLineNode.visible;
          celsiusLabelsLayer.visible = this.celsiusNumberLineNode.visible;
          fahrenheitLabelsLayer.visible = this.fahrenheitNumberLineNode.visible;
          celsiusAbsoluteValueLabelsLayer.visible = this.celsiusNumberLineNode.visible && showAbsoluteValues;
          fahrenheitAbsoluteValueLabelsLayer.visible = this.fahrenheitNumberLineNode.visible && showAbsoluteValues;
          numberLinePanel.visible = showNumberLine;
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