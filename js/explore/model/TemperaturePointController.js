// Copyright 2019, University of Colorado Boulder

/**
 * TemperaturePointController looks like a thermometer with a little triangle that pinpoints the location where the
 * temperature and color are sensed, and it also controls points on a number line.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Color = require( 'SCENERY/util/Color' );
  const merge = require( 'PHET_CORE/merge' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PaintColorProperty = require( 'SCENERY/util/PaintColorProperty' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const TemperatureToColorMapper = require( 'NUMBER_LINE_INTEGERS/explore/model/TemperatureToColorMapper' );
  const Util = require( 'DOT/Util' );

  // constants
  const TEMPERATURE_RANGE_ON_MAP = new Range( -60, 50 ); // in Celsius, must match range used to make map images

  // convenience functions
  const celsiusToFahrenheitInteger = temperatureInCelsius => Util.roundSymmetric( temperatureInCelsius * 9 / 5 + 32 );

  // color map for obtaining a color given a temperature value, must match algorithm used on maps
  const CELSIUS_TEMPERATURE_TO_COLOR_MAPPER = new TemperatureToColorMapper( TEMPERATURE_RANGE_ON_MAP );

  class TemperaturePointController extends PointController {

    /**
     * @param {TemperatureSceneModel} sceneModel
     * @param {string} labelText - the text with which this controller will be identified in the view
     * @param {Object} [options]
     * @public
     */
    constructor( sceneModel, labelText, options ) {

      options = merge( {
        noTemperatureColor: Color.white,
        defaultTemperature: 0, // in Celsius, used when no temperature is available from the model
        lockToNumberLine: 'never'
      }, options );

      super( options );

      // @private
      this.sceneModel = sceneModel;

      // @public (read-only) {string} - label for PointControllerNode and number line point
      this.label = labelText;

      // @public (read-only) - whether this point controller is over the map
      this.isOverMapProperty = new BooleanProperty( false );

      // @public (read-only) - timestamp in ms since epoch when this was most recently dropped on map, -1 when not on map
      this.droppedOnMapTimestamp = -1;

      // @public temperatures at the position of the point controller on the map
      this.celsiusTemperatureProperty = new NumberProperty( options.defaultTemperature );
      this.fahrenheitTemperatureProperty = new NumberProperty( celsiusToFahrenheitInteger( options.defaultTemperature ) );

      // @public color represented by temperature on map
      this.colorProperty = new PaintColorProperty( options.noTemperatureColor );

      // update temperature and other state information when moved or when month changes
      Property.multilink(
        [ this.positionProperty, sceneModel.monthProperty ],
        position => {

          const temperatureInCelsius = sceneModel.getTemperatureAtLocation( position );
          if ( temperatureInCelsius === null ) {

            // the provided position isn't over the map, so no temperature value can be obtained
            this.celsiusTemperatureProperty.value = this.celsiusTemperatureProperty.initialValue;
            this.fahrenheitTemperatureProperty.value = this.fahrenheitTemperatureProperty.initialValue;
            this.colorProperty.value = options.noTemperatureColor;
            this.isOverMapProperty.value = false;
          }
          else {

            // we got a valid temperature value back, update the values presented to the user
            this.celsiusTemperatureProperty.value = temperatureInCelsius;
            this.fahrenheitTemperatureProperty.value = celsiusToFahrenheitInteger( temperatureInCelsius );
            this.colorProperty.value = CELSIUS_TEMPERATURE_TO_COLOR_MAPPER.mapTemperatureToColor(
              this.celsiusTemperatureProperty.value
            );
            this.isOverMapProperty.value = true;

            // if there are points on the number line being controlled, update them
            if ( this.controlsNumberLinePoint() ) {
              this.celsiusNumberLinePoint.valueProperty.value = this.celsiusTemperatureProperty.value;
              this.celsiusNumberLinePoint.colorProperty.value = this.colorProperty.value;
              this.fahrenheitNumberLinePoint.valueProperty.value = this.fahrenheitTemperatureProperty.value;
              this.fahrenheitNumberLinePoint.colorProperty.value = this.colorProperty.value;
            }
          }
        }
      );

      // create/remove number line points based on whether we're over the map
      this.isOverMapProperty.lazyLink( over => {
        if ( over && this.isDraggingProperty.value ) {

          // state checking
          assert && assert( !this.controlsNumberLinePoint(), 'should not already have a point' );

          // create new points on each number line
          this.celsiusNumberLinePoint = new NumberLinePoint(
            this.celsiusTemperatureProperty.value,
            this.colorProperty.value,
            this.sceneModel.celsiusNumberLine,
            this
          );
          this.fahrenheitNumberLinePoint = new NumberLinePoint(
            this.fahrenheitTemperatureProperty.value,
            this.colorProperty.value,
            this.sceneModel.fahrenheitNumberLine,
            this
          );
          this.sceneModel.celsiusNumberLine.addPoint( this.celsiusNumberLinePoint );
          this.sceneModel.fahrenheitNumberLine.addPoint( this.fahrenheitNumberLinePoint );
          this.controlNumberLinePoint( this.celsiusNumberLinePoint );
          this.controlNumberLinePoint( this.fahrenheitNumberLinePoint );
        }
        else if ( !over && this.controlsNumberLinePoint() ) {

          // remove our points from the number line
          this.sceneModel.celsiusNumberLine.removePoint( this.celsiusNumberLinePoint );
          this.sceneModel.fahrenheitNumberLine.removePoint( this.fahrenheitNumberLinePoint );

          this.clearNumberLinePoints();
          this.celsiusNumberLinePoint = null;
          this.fahrenheitNumberLinePoint = null;
        }
      } );

      // update the map drop timestamp when dropped
      this.isDraggingProperty.lazyLink( isDragging => {
        if ( isDragging ) {

          // timestamp is set to -1 when not dropped on the map
          this.droppedOnMapTimestamp = -1;
        }
        else {
          if ( this.isOverMapProperty.value ) {

            // this point controller is being dropped on the map, update the timestamp
            this.droppedOnMapTimestamp = Date.now();
          }
        }

        // update the dragging state of the number line points if present
        this.celsiusNumberLinePoint && ( this.celsiusNumberLinePoint.isDraggingProperty.value = isDragging );
        this.fahrenheitNumberLinePoint && ( this.fahrenheitNumberLinePoint.isDraggingProperty.value = isDragging );
      } );
    }

    /**
     * @param {Vector2} proposedPosition
     * @override - necessary because PointController assumes that it is moving parallel to the number line
     *  which is not true for this class
     * @public
     */
    proposePosition( proposedPosition ) {
      this.positionProperty.value = proposedPosition;
    }

  }

  return numberLineIntegers.register( 'TemperaturePointController', TemperaturePointController );
} );
