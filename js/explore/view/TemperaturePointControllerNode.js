// Copyright 2019, University of Colorado Boulder

/**
 * A scenery node that is used to control point positions in the temperature scene based on the temperature of the map
 * below this node
 *
 * @author Arnab Purkayastha
 * @author Saurabh Totey
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BackgroundNode = require( 'SCENERY_PHET/BackgroundNode' );
  const Color = require( 'SCENERY/util/Color' );
  const merge = require( 'PHET_CORE/merge' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const TemperatureAndColorSensorNode = require( 'SCENERY_PHET/TemperatureAndColorSensorNode' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const TOUCH_DILATION = 5;
  const TEMPERATURE_RANGE = new Range( -85, 104 ); // determined based on the temperature data that was used

  // strings
  const negativeTemperatureAmountString = require( 'string!NUMBER_LINE_INTEGERS/negativeTemperatureAmount' );
  const positiveTemperatureAmountString = require( 'string!NUMBER_LINE_INTEGERS/positiveTemperatureAmount' );
  const zeroTemperatureAmountString = require( 'string!NUMBER_LINE_INTEGERS/zeroTemperatureAmount' );

  class TemperaturePointControllerNode extends PointControllerNode {

    /**
     * @param {TemperaturePointController} pointController
     * @param {BooleanProperty} showAbsoluteValuesProperty
     * @param {Property} temperatureUnitsProperty - whether temperature is being shown in Celsius or Fahrenheit
     * @param {Object} [options]
     * @public
     */
    constructor( pointController, showAbsoluteValuesProperty, temperatureUnitsProperty, options ) {

      // create a node that contains thermometer and triangle
      const compositeThermometerNode = new Node();

      options = merge( {
        node: compositeThermometerNode,
        connectorLine: false
      }, options );

      const temperatureAndColorSensorNode = new TemperatureAndColorSensorNode(
        TEMPERATURE_RANGE,
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

      // add the textual label for this thermometer, generally a single letter
      const thermometerLabel = new Text( pointController.label, {
        font: new PhetFont( 16 ),
        centerX: temperatureAndColorSensorNode.thermometerBounds.centerX,
        top: temperatureAndColorSensorNode.top + 3, // offset empirically determined,
        maxWidth: 20
      } );
      compositeThermometerNode.addChild( thermometerLabel );

      // add a textual readout that will describe the temperature verbally, e.g. "20° above 0"
      const temperatureReadoutTextNode = new Text( '', {
        font: new PhetFont( 18 ),
        fill: Color.BLACK,
        maxWidth: 250
      } );
      const temperatureReadoutNode = new BackgroundNode(
        temperatureReadoutTextNode,
        merge( {}, NLIConstants.LABEL_BACKGROUND_OPTIONS, {

          // position empirically determined to be centered to the right of the bulb
          left: temperatureAndColorSensorNode.right + 3,
          bottom: temperatureAndColorSensorNode.bottom - 3,

          backgroundOptions: {
            opacity: 0.95,
            lineWidth: 2
          }
        } )
      );
      compositeThermometerNode.addChild( temperatureReadoutNode );

      // control the visibility of the textual label, no unlink needed because these point controllers are permanent
      Property.multilink(
        [ showAbsoluteValuesProperty, pointController.isOverMapProperty ],
        ( showAbsoluteValues, isOverMap ) => {
          temperatureReadoutNode.visible = showAbsoluteValues && isOverMap;
        }
      );

      // control the content of the textual label, no unlink needed because these point controllers are permanent
      Property.multilink(
        [
          pointController.fahrenheitTemperatureProperty,
          pointController.celsiusTemperatureProperty,
          temperatureUnitsProperty,
          pointController.isOverMapProperty
        ],
        ( fahrenheitTemperature, celsiusTemperature, temperatureUnits ) => {
          const value = temperatureUnits === NLIConstants.TEMPERATURE_UNITS.CELSIUS ? celsiusTemperature : fahrenheitTemperature;
          const template = value < 0 ? negativeTemperatureAmountString :
                           value > 0 ? positiveTemperatureAmountString :
                           zeroTemperatureAmountString;
          temperatureReadoutTextNode.text = StringUtils.fillIn( template, { value: Math.abs( value ) } );
          temperatureReadoutNode.background.stroke = pointController.colorProperty.value;
          temperatureReadoutNode.background.fill = pointController.colorProperty.value.colorUtilsBrighter( 0.75 );
        }
      );

      // dilate the touch area for easier grabbing
      compositeThermometerNode.touchArea = temperatureAndColorSensorNode.bounds.dilated( TOUCH_DILATION );

      super( pointController, options );
    }
  }

  return numberLineIntegers.register( 'TemperaturePointControllerNode', TemperaturePointControllerNode );
} );
