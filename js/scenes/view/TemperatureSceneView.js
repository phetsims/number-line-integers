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
  const AccordionBox = require( 'SUN/AccordionBox' );
  const BackgroundNode = require( 'SCENERY_PHET/BackgroundNode' );
  const ComparisonStatementNode = require( 'NUMBER_LINE_INTEGERS/common/view/ComparisonStatementNode' );
  const Panel = require( 'SUN/Panel' );
  const MonthsComboBox = require( 'NUMBER_LINE_INTEGERS/scenes/view/MonthsComboBox' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/scenes/view/SceneView' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const TemperatureMapNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/TemperatureMapNode' );
  const TemperaturePointControllerNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/TemperaturePointControllerNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Vector2 = require( 'DOT/Vector2' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // constants
  const NUMBER_LINE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  const UNIT_PICKER_LABEL_FONT = new PhetFont( { size: 18 } );
  const DARK_COLOR_THRESHOLD = 150;

  // strings
  const temperatureString = require( 'string!NUMBER_LINE_INTEGERS/temperature' );
  const temperatureAmountCelsiusString = require( 'string!NUMBER_LINE_INTEGERS/temperatureAmountCelsius' );
  const temperatureAmountFahrenheitString = require( 'string!NUMBER_LINE_INTEGERS/temperatureAmountFahrenheit' );
  const temperatureLabelFahrenheitString = require( 'string!NUMBER_LINE_INTEGERS/temperatureLabelFahrenheit' );
  const temperatureLabelCelsiusString = require( 'string!NUMBER_LINE_INTEGERS/temperatureLabelCelsius' );
  const negativeTemperatureAmountString = require( 'string!NUMBER_LINE_INTEGERS/negativeTemperatureAmount' );
  const positiveTemperatureAmountString = require( 'string!NUMBER_LINE_INTEGERS/positiveTemperatureAmount' );

  class TemperatureSceneView extends SceneView {

    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds, {
        numberLineNodeOptions: {
          numberDisplayTemplate: temperatureAmountFahrenheitString,
          tickMarkLabelPositionWhenVertical: 'left',
          customColorsForLabels: false
        }
      } );

      // Replace single default numberLineNode with two from celsius and fahrenheit
      this.celsiusNumberLineNode = new NumberLineNode( sceneModel.celsiusNumberLine, {
        numberDisplayTemplate: temperatureAmountCelsiusString,
        tickMarkLabelPositionWhenVertical: 'left',
        customColorsForLabels: false,
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

      // @private
      this.monthsComboBox = new MonthsComboBox( sceneModel.monthProperty, this );
      this.addChild( this.monthsComboBox );

      // @private
      this.temperatureMap = new TemperatureMapNode( sceneModel.monthProperty, sceneModel.mapBounds );
      this.temperatureMap.center = sceneModel.mapBounds.center;
      this.addChild( this.temperatureMap );

      this.monthsComboBox.left = this.temperatureMap.right + 50;
      this.monthsComboBox.top = this.temperatureMap.top;

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

        // create the textual label
        const labelText = new Text( addedNumberLinePoint.controller.label, { font: new PhetFont( 16 ) } );
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

      // manages absolute value texts whenever thermometers go on and off the map
      const celsiusAbsoluteValueLabelsLayer = new Node();
      const fahrenheitAbsoluteValueLabelsLayer = new Node();
      const onAddedNumberLinePointAbsoluteValue = ( numberLine, absoluteValueLabelsLayer, addedNumberLinePoint ) => {

        // create the text and add it to a background
        const absoluteValueText = new Text( '', { font: new PhetFont( 12 ) } );
        const absoluteValueNode = new BackgroundNode( absoluteValueText, NLIConstants.LABEL_BACKGROUND_OPTIONS );
        absoluteValueLabelsLayer.addChild( absoluteValueNode );

        const numberLinePointListener = value => {
          const template = value < 0 ? negativeTemperatureAmountString : positiveTemperatureAmountString;
          absoluteValueText.text = StringUtils.fillIn( template, { value: Math.abs( value ) } );
          absoluteValueNode.leftCenter = addedNumberLinePoint.getPositionInModelSpace().plus( new Vector2( 40, 0 ) );
        };
        addedNumberLinePoint.valueProperty.link( numberLinePointListener );

        const numberLineColorListener = color => {
          absoluteValueText.fill = color;
          absoluteValueNode.background.fill = this.generateBackgroundColor( color );
        };
        addedNumberLinePoint.colorProperty.link( numberLineColorListener );

        const dragStateChangeHandler = dragging => {
          if ( dragging ) {
            absoluteValueNode.moveToFront();
          }
        };
        addedNumberLinePoint.isDraggingProperty.link( dragStateChangeHandler );

        const removalListener = removedNumberLinePoint => {
          if ( removedNumberLinePoint !== addedNumberLinePoint ) {
            return;
          }
          numberLine.residentPoints.removeItemRemovedListener( removalListener );
          absoluteValueLabelsLayer.removeChild( absoluteValueNode );
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

    /**
     * Calculate inverse greyscale background for a given color
     * @param {Color} c
     * @returns {Color}
     */
    generateBackgroundColor( c ) {
      const r = c.red;
      const g = c.green;
      const b = c.blue;
      const all = ( r + g + b ) / 3;
      if ( all > DARK_COLOR_THRESHOLD ) {
        return 'black';
      }
      //const grey = 255 - ( all * 255 / DARK_COLOR_THRESHOLD );
      return 'white';
    }
  }

  return numberLineIntegers.register( 'TemperatureSceneView', TemperatureSceneView );
} );
