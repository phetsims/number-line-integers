// Copyright 2019, University of Colorado Boulder

/**
 * view for the "Temperature" scene
 * TODO: investigate reducing code duplication between this and ElevationSceneView
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 * @author Arnab Purkayastha
 */
define( require => {
  'use strict';

  // modules
  const BackgroundNode = require( 'SCENERY_PHET/BackgroundNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const MonthsComboBox = require( 'NUMBER_LINE_INTEGERS/explore/view/MonthsComboBox' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/explore/view/SceneView' );
  const TemperatureMapNode = require( 'NUMBER_LINE_INTEGERS/explore/view/TemperatureMapNode' );
  const TemperaturePointControllerNode = require( 'NUMBER_LINE_INTEGERS/explore/view/TemperaturePointControllerNode' );
  const TemperatureSceneModel = require( 'NUMBER_LINE_INTEGERS/explore/model/TemperatureSceneModel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // constants
  const NUMBER_LINE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  const UNIT_PICKER_LABEL_FONT = new PhetFont( { size: 18 } );
  const NUMBER_LINE_PANEL_WIDTH = 200; // empirically determined
  const NUMBER_LINE_PANEL_MARGINS = 10;
  const TITLE_TO_SELECTOR_SPACING = 10;
  const CELSIUS_NUMBER_LINE_INDEX = TemperatureSceneModel.CELSIUS_NUMBER_LINE_INDEX;
  const FAHRENHEIT_NUMBER_LINE_INDEX = TemperatureSceneModel.FAHRENHEIT_NUMBER_LINE_INDEX;

  // strings
  const temperatureAmountCelsiusString = require( 'string!NUMBER_LINE_INTEGERS/temperatureAmountCelsius' );
  const temperatureAmountFahrenheitString = require( 'string!NUMBER_LINE_INTEGERS/temperatureAmountFahrenheit' );
  const temperatureLabelCelsiusString = require( 'string!NUMBER_LINE_INTEGERS/temperatureLabelCelsius' );
  const temperatureLabelFahrenheitString = require( 'string!NUMBER_LINE_INTEGERS/temperatureLabelFahrenheit' );
  const temperatureMapCaptionString = require( 'string!NUMBER_LINE_INTEGERS/temperatureMapCaption' );
  const temperatureString = require( 'string!NUMBER_LINE_INTEGERS/temperature' );

  class TemperatureSceneView extends SceneView {

    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds, {

        // options common to both number lines
        commonNumberLineNodeOptions: {
          tickMarkLabelPositionWhenVertical: 'left',
          pointNodeOptions: {
            customColorsForLabels: false
          }
        },

        // options unique to the individual number lines, must be in correct order
        uniqueNumberLineNodeOptionsList: [
          { numericalLabelTemplate: temperatureAmountFahrenheitString },
          { numericalLabelTemplate: temperatureAmountCelsiusString }
        ],

        // don't have the super constructor add the number line nodes - that will be done below
        automaticallyAddNLNodes: false
      } );

      // put the number lines on their own layer so that their location can be easily adjusted
      const numberLineLayer = new Node();
      const fahrenheitNumberLineNode = this.numberLineNodes[ FAHRENHEIT_NUMBER_LINE_INDEX ];
      const celsiusNumberLineNode = this.numberLineNodes[ CELSIUS_NUMBER_LINE_INDEX ];
      numberLineLayer.addChild( fahrenheitNumberLineNode );
      numberLineLayer.addChild( celsiusNumberLineNode );

      // get local references to other items needed to manage the two separate number lines
      const fahrenheitNumberLine = sceneModel.numberLines[ FAHRENHEIT_NUMBER_LINE_INDEX ];
      const fahrenheitComparisonStatementAccordionBox = this.comparisonStatementAccordionBoxes[ FAHRENHEIT_NUMBER_LINE_INDEX ];
      const celsiusNumberLine = sceneModel.numberLines[ CELSIUS_NUMBER_LINE_INDEX ];
      const celsiusComparisonStatementAccordionBox = this.comparisonStatementAccordionBoxes[ CELSIUS_NUMBER_LINE_INDEX ];

      // node where the contents of the number line panel will be placed
      const numberLinePanelContent = new Node();
      numberLinePanelContent.addChild( numberLineLayer );

      // make sure that the same operator is being used in both the celsius and fahrenheit comparison statements
      celsiusComparisonStatementAccordionBox.comparisonStatementNode.selectedOperatorProperty.link( selectedOperator => {
        fahrenheitComparisonStatementAccordionBox.comparisonStatementNode.selectedOperatorProperty.set( selectedOperator );
      } );
      fahrenheitComparisonStatementAccordionBox.comparisonStatementNode.selectedOperatorProperty.link( selectedOperator => {
        celsiusComparisonStatementAccordionBox.comparisonStatementNode.selectedOperatorProperty.set( selectedOperator );
      } );

      // @private
      this.monthsComboBox = new MonthsComboBox( sceneModel.monthProperty, this, {
        left: this.checkboxGroup.left,
        top: sceneModel.mapBounds.minY,
        buttonTouchAreaXDilation: 7,
        buttonTouchAreaYDilation: 7
      } );
      this.scenesLayer.addChild( this.monthsComboBox );

      // @private - map of the world that depicts temperature data
      this.temperatureMap = new TemperatureMapNode( sceneModel.monthProperty, sceneModel.mapBounds );
      this.temperatureMap.center = sceneModel.mapBounds.center;
      this.scenesLayer.addChild( this.temperatureMap );

      // add the node that represents the box that will hold the thermometers
      const thermometerBox = new Rectangle.bounds( sceneModel.thermometerBoxBounds, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 6
      } );
      this.scenesLayer.addChild( thermometerBox );

      // caption for the temperature map
      const temperatureMapCaption = new RichText( temperatureMapCaptionString, {
        align: 'center',
        centerX: this.temperatureMap.centerX,
        top: this.temperatureMap.bottom + 7, // a little bit under the map
        font: new PhetFont( 10 ),
        fill: '#707070'
      } );
      this.scenesLayer.addChild( temperatureMapCaption );

      // radio button group for selecting the temperature units
      const temperatureUnitsSelector = new VerticalAquaRadioButtonGroup(
        sceneModel.temperatureUnitsProperty,
        [
          {
            value: NLIConstants.TEMPERATURE_UNITS.FAHRENHEIT,
            node: new Text( temperatureLabelFahrenheitString, { font: UNIT_PICKER_LABEL_FONT } )
          },
          {
            value: NLIConstants.TEMPERATURE_UNITS.CELSIUS,
            node: new Text( temperatureLabelCelsiusString, { font: UNIT_PICKER_LABEL_FONT } )
          }
        ],
        {

          // limit the width to half the panel height to handle long labels from translations and string tests
          maxWidth: ( NUMBER_LINE_PANEL_WIDTH - 2 * NUMBER_LINE_PANEL_MARGINS ) / 2
        }
      );

      // title for the panel where the number line will appear
      const numberLinePanelTitle = new Text( temperatureString, {
        font: NUMBER_LINE_LABEL_FONT,
        centerX: celsiusNumberLineNode.centerX,
        bottom: celsiusNumberLineNode.top - 5,
        maxWidth: NUMBER_LINE_PANEL_WIDTH - temperatureUnitsSelector.width - TITLE_TO_SELECTOR_SPACING -
                  2 * NUMBER_LINE_PANEL_MARGINS
      } );

      // horizontal box with the title and the units selector that will be at the top of the number line panel
      const numberLinePanelHeader = new HBox( {
        children: [ numberLinePanelTitle, temperatureUnitsSelector ],
        spacing: TITLE_TO_SELECTOR_SPACING,
        align: 'top'
      } );
      numberLinePanelContent.addChild( numberLinePanelHeader );

      // align the number line nodes to be centered vertically under the header
      numberLineLayer.top = numberLinePanelTitle.bottom + 5;
      numberLineLayer.left = 15; // empirically determined for desired alignment under the panel header

      // manage the label texts for each thermometer
      const celsiusLabelsLayer = new Node();
      const fahrenheitLabelsLayer = new Node();
      const onAddedNumberLinePoint = ( numberLine, labelsLayer, addedNumberLinePoint ) => {

        // create the textual label
        const labelText = new Text( addedNumberLinePoint.controller.label, {
          font: new PhetFont( 16 ),
          maxWidth: layoutBounds.width * 0.03
        } );
        const labelNode = new BackgroundNode( labelText, NLIConstants.LABEL_BACKGROUND_OPTIONS );
        labelsLayer.addChild( labelNode );

        const numberLinePointListener = () => {
          labelNode.leftCenter = addedNumberLinePoint.getPositionInModelSpace().plus( new Vector2( 15, 0 ) );
        };
        addedNumberLinePoint.valueProperty.link( numberLinePointListener );

        const dragStateChangeHandler = dragging => {
          if ( dragging ) {
            labelNode.moveToFront();
          }
        };
        addedNumberLinePoint.isDraggingProperty.link( dragStateChangeHandler );

        const removalListener = removedNumberLinePoint => {
          if ( removedNumberLinePoint !== addedNumberLinePoint ) {
            return;
          }
          numberLine.residentPoints.removeItemRemovedListener( removalListener );
          labelsLayer.removeChild( labelNode );
          addedNumberLinePoint.valueProperty.unlink( numberLinePointListener );
        };
        numberLine.residentPoints.addItemRemovedListener( removalListener );
      };

      celsiusNumberLine.residentPoints.addItemAddedListener( addedPoint => {
        onAddedNumberLinePoint( celsiusNumberLine, celsiusLabelsLayer, addedPoint );
      } );
      fahrenheitNumberLine.residentPoints.addItemAddedListener( addedPoint => {
        onAddedNumberLinePoint( fahrenheitNumberLine, fahrenheitLabelsLayer, addedPoint );
      } );

      numberLineLayer.addChild( celsiusLabelsLayer );
      numberLineLayer.addChild( fahrenheitLabelsLayer );

      const numberLinePanel = new Panel(
        numberLinePanelContent,
        {
          fill: 'lightgray',
          stroke: 'transparent',
          align: 'center',
          resize: false,
          xMargin: NUMBER_LINE_PANEL_MARGINS,
          yMargin: NUMBER_LINE_PANEL_MARGINS,
          centerX: this.temperatureMap.left / 2, // centered between left edge of scene and left edge of map
          top: fahrenheitNumberLineNode.top,
          minWidth: NUMBER_LINE_PANEL_WIDTH,
          maxWidth: NUMBER_LINE_PANEL_WIDTH
        }
      );
      this.scenesLayer.addChild( numberLinePanel );

      Property.multilink(
        [ sceneModel.temperatureUnitsProperty, sceneModel.showNumberLineProperty ],
        ( temperatureUnits, showNumberLine ) => {
          celsiusNumberLineNode.visible = temperatureUnits === NLIConstants.TEMPERATURE_UNITS.CELSIUS;
          celsiusComparisonStatementAccordionBox.visible = celsiusNumberLineNode.visible;
          celsiusLabelsLayer.visible = celsiusNumberLineNode.visible;
          fahrenheitNumberLineNode.visible = temperatureUnits === NLIConstants.TEMPERATURE_UNITS.FAHRENHEIT;
          fahrenheitComparisonStatementAccordionBox.visible = fahrenheitNumberLineNode.visible;
          fahrenheitLabelsLayer.visible = fahrenheitNumberLineNode.visible;
          numberLinePanel.visible = showNumberLine;
        }
      );

      this.scenesLayer.addChild( new Node( {
        children: sceneModel.permanentPointControllers.map(
          pointController => new TemperaturePointControllerNode(
            pointController,
            sceneModel.numberLineAbsValIndicatorsVisibleProperty,
            sceneModel.temperatureUnitsProperty
          )
        )
      } ) );
    }
  }

  return numberLineIntegers.register( 'TemperatureSceneView', TemperatureSceneView );
} );
