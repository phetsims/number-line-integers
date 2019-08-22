// Copyright 2019, University of Colorado Boulder

/**
 * base class for all scenes in the "Scenes" screen
 * TODO: discuss how to reduce code duplication between this and ElevationSceneModel
 *
 * @author John Blanco
 * @author Saurabh Totey
 * @author Arnab Purkayastha
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const TemperatureToColorMapper = require( 'NUMBER_LINE_INTEGERS/scenes/model/TemperatureToColorMapper' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const reverseRobinsonProjector = require( 'NUMBER_LINE_INTEGERS/scenes/model/reverseRobinsonProjector' );
  const SceneModel = require( 'NUMBER_LINE_INTEGERS/scenes/model/SceneModel' );
  const temperatureDataSet = require( 'NUMBER_LINE_INTEGERS/scenes/model/temperatureDataSet' );
  const TemperaturePointController = require( 'NUMBER_LINE_INTEGERS/scenes/model/TemperaturePointController' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const aString = require( 'string!NUMBER_LINE_INTEGERS/a' );
  const bString = require( 'string!NUMBER_LINE_INTEGERS/b' );
  const cString = require( 'string!NUMBER_LINE_INTEGERS/c' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds
  const THERMOMETER_LABELS = [ aString, bString, cString ];
  const MAP_WIDTH = 550;
  const MAP_HEIGHT = 280;
  const MAP_CENTER = new Vector2(
    SCENE_BOUNDS.centerX,
    SCENE_BOUNDS.centerY * 0.85
  );
  const TEMPERATURE_RANGE_ON_MAP = new Range( -60, 50 ); // in Celsius, must match range used to make map images
  const TEMPERATURE_TO_COLOR_MAPPER = new TemperatureToColorMapper( TEMPERATURE_RANGE_ON_MAP );

  class TemperatureSceneModel extends SceneModel {

    constructor() {

      const mapBounds = new Bounds2(
        MAP_CENTER.x - MAP_WIDTH / 2,
        MAP_CENTER.y - MAP_HEIGHT / 2,
        MAP_CENTER.x + MAP_WIDTH / 2,
        MAP_CENTER.y + MAP_HEIGHT / 2
      );

      const celsiusNumberLineRange = new Range( -52, 40 );
      const fahrenheitNumberLineRange = new Range( -62, 104 );
      const numberLineHeight = 405;

      const makeNumberLineOptions = range => {
        return {
          numberLineZeroPosition: new Vector2(
            mapBounds.minX / 2,

            // y position for number line 0 is calculation that centers number line vertically within scene
            0.5 * SCENE_BOUNDS.height + numberLineHeight * ( 0.5 + range.min / range.getLength() )
          ),
          numberLineOptions: {
            initialOrientation: NumberLineOrientation.VERTICAL,
            initialDisplayedRange: range,
            heightInModelSpace: numberLineHeight
          }
        };
      };

      super( makeNumberLineOptions( fahrenheitNumberLineRange ) );

      const celsiusNumberLineOptions = makeNumberLineOptions( celsiusNumberLineRange );

      // @public (read-only)
      this.celsiusNumberLine = new NumberLine( celsiusNumberLineOptions.numberLineZeroPosition, celsiusNumberLineOptions.numberLineOptions );

      // @public (read-only)
      this.fahrenheitNumberLine = this.numberLine;

      // @public (read-only) {Bounds2} - bounds of the map area
      this.mapBounds = mapBounds;

      // @public
      this.monthProperty = new NumberProperty( 1 );

      // specify the position of the box that will hold the thermometers
      const boxWidth = MAP_WIDTH * 0.5;
      const boxHeight = ( SCENE_BOUNDS.maxY - mapBounds.maxY ) * 0.4;
      const boxCenter = new Vector2( MAP_CENTER.x, ( SCENE_BOUNDS.maxY + mapBounds.maxY ) / 2 );

      // @public (read-only) {Bounds2} - holding area for the thermometers
      this.thermometerBoxBounds = new Bounds2(
        boxCenter.x - boxWidth / 2,
        boxCenter.y - boxHeight / 2,
        boxCenter.x + boxWidth / 2,
        boxCenter.y + boxHeight / 2
      );

      // @public (read-only) - the point controllers that can be moved into the elevation scene
      this.permanentPointControllers = _.times( 3, i => new TemperaturePointController(
        this,
        THERMOMETER_LABELS[ i ],
        { lockToNumberLine: 'never', scaleInBox: 0.5 }
      ) );

      // put the permanent point controllers in their starting positions
      this.permanentPointControllers.forEach( pointController => {
        this.putPointControllerInBox( pointController );
      } );

      // if the point controllers are released outside of the elevation areas, send them home.
      this.permanentPointControllers.forEach( pointController => {
        pointController.isDraggingProperty.lazyLink( isDragging => {
          if ( !isDragging &&
               !pointController.isOverMapProperty.value &&
               !pointController.numberLinePoint ) {
            this.putPointControllerInBox( pointController, true );
          }
        } );
      } );

      // @public
      this.isTemperatureInCelsiusProperty = new BooleanProperty( false );
    }

    /**
     * get the temperature and color at the specified model location
     * @public
     * @param {Vector2} location - model coordinates for where to get the temperature
     * @returns {{celsiusTemperature: number, color: Color, fahrenheitTemperature: number}|null} returns data unless
     * location is invalid, in which case null is returned
     */
    getTemperatureAndColorAtLocation( location ) {

      // convert the location into normalized values based on the map's position and size, centered in the middle
      const normalizedXPosition = ( location.x - this.mapBounds.centerX ) / this.mapBounds.width;
      const normalizedYPosition = ( this.mapBounds.centerY - location.y ) / this.mapBounds.height;

      if ( normalizedXPosition < -0.5 || normalizedXPosition > 0.5 ||
           normalizedYPosition < -0.5 || normalizedYPosition > 0.5 ) {

        // the point is not over the map
        return null;
      }

      console.log( '------------------' );

      // const latLong = reverseRobinsonProjector.xyToLatLongCalculated( normalizedXPosition, normalizedYPosition );
      console.time( 'i' );
      const latLong = reverseRobinsonProjector.xyToLatLong( normalizedXPosition, normalizedYPosition );
      console.timeEnd( 'i' );

      if ( latLong === null ) {
        return null;
      }


      console.log( 'from table+interpolation:' );
      console.log( 'latDegrees = ' + latLong.latitude );
      console.log( 'lonDegrees = ' + latLong.longitude );

      console.time( 'c' );
      const coordinate = reverseRobinsonProjector.xyToLatLongCalculated( normalizedXPosition, normalizedYPosition );
      console.timeEnd( 'c' );

      console.log( 'from formula:' );
      console.log( 'latDegrees = ' + coordinate.latitude );
      console.log( 'lonDegrees = ' + coordinate.longitude );

      // returns null if location is not in map bounds
      if ( coordinate.latitude > 89 || coordinate.latitude < -90 ||
           coordinate.longitude > 180 || coordinate.longitude < -180 ) {
        return null;
      }

      // const temperatureInKelvin = temperatureDataSet.getNearSurfaceTemperature( 1, latDegrees, lonDegrees );
      const temperatureInKelvin = temperatureDataSet.getNearSurfaceTemperature(
        this.monthProperty.value,
        latLong.latitude,
        latLong.longitude
      );
      const temperatureInCelsius = Util.roundSymmetric( temperatureInKelvin - 273.15 );

      return {
        celsiusTemperature: temperatureInCelsius,
        fahrenheitTemperature: Util.roundSymmetric( temperatureInKelvin * 9 / 5 - 459.67 ),
        color: TEMPERATURE_TO_COLOR_MAPPER.mapTemperatureToColor( temperatureInCelsius )
      };
    }

    /**
     * place the provided point controller into the holding box, generally done on init, reset, and when the user "puts
     * it away"
     * @param {TemperaturePointController} pointController
     * @param {boolean} [animate] - controls whether to animate the return to the box or do it instantly
     */
    putPointControllerInBox( pointController, animate = false ) {
      const index = this.permanentPointControllers.indexOf( pointController );
      const numPositions = this.permanentPointControllers.length;

      // error checking
      assert && assert( index >= 0, 'point controller not found on list' );
      assert && assert(
        pointController.numberLinePoint === null,
        'point controller should not be put away while controlling a point'
      );

      const spacing = this.thermometerBoxBounds.width / numPositions;
      const destination = new Vector2(
        this.thermometerBoxBounds.minX + spacing / 2 + spacing * index,
        this.thermometerBoxBounds.centerY + 25 // TODO: empirically determined value, should be handled in view instead
      );
      pointController.goToPosition( destination, animate );
    }

    /**
     * restore initial state
     * @public
     */
    reset() {

      super.reset();

      this.isTemperatureInCelsiusProperty.reset();
      this.fahrenheitNumberLine.reset();
      this.celsiusNumberLine.reset();
      this.monthProperty.reset();


      // put the point controllers back into their starting positions
      this.permanentPointControllers.forEach( pointController => {
        pointController.reset();
        this.putPointControllerInBox( pointController );
      } );
    }

  }

  return numberLineIntegers.register( 'TemperatureSceneModel', TemperatureSceneModel );
} );