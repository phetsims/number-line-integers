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
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLine' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const Range = require( 'DOT/Range' );
  const SceneModel = require( 'NUMBER_LINE_INTEGERS/scenes/model/SceneModel' );
  const temperatureDataSet = require( 'NUMBER_LINE_INTEGERS/scenes/model/temperatureDataSet' );
  const TemperaturePointController = require( 'NUMBER_LINE_INTEGERS/scenes/model/TemperaturePointController' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds

  class TemperatureSceneModel extends SceneModel {

    constructor() {

      const mapWidth = 650;
      const mapHeight = 330;
      const mapCenter = new Vector2(
        SCENE_BOUNDS.centerX,
        SCENE_BOUNDS.centerY * 0.85
      );
      const mapBounds = new Bounds2(
        mapCenter.x - mapWidth / 2,
        mapCenter.y - mapHeight / 2,
        mapCenter.x + mapWidth / 2,
        mapCenter.y + mapHeight / 2
      );

      const celsiusNumberLineRange = new Range( -51, 40 );
      const fahrenheitNumberLineRange = new Range( -60, 104 );
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

      // @private temperature data set
      this.dataSet = new temperatureDataSet( mapWidth, mapHeight );

      // specify the position of the box that will hold the thermometers
      const boxWidth = mapWidth * 0.5;
      const boxHeight = ( SCENE_BOUNDS.maxY - mapBounds.maxY ) * 0.4;
      const boxCenter = new Vector2( mapCenter.x, ( SCENE_BOUNDS.maxY + mapBounds.maxY ) / 2 );

      // @public (read-only) {Bounds2} - holding area for the thermometers
      this.thermometerBoxBounds = new Bounds2(
        boxCenter.x - boxWidth / 2,
        boxCenter.y - boxHeight / 2,
        boxCenter.x + boxWidth / 2,
        boxCenter.y + boxHeight / 2
      );

      // @public (read-only) - the point controllers that can be moved into the elevation scene
      this.permanentPointControllers = _.times( 3, () => new TemperaturePointController( this, {
        lockToNumberLine: 'never',
        scaleInBox: 0.5
      } ) );

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
     * @returns {{celsiusTemperature: number, color: Color, fahrenheitTemperature: number}|null} returns data unless location is invalid, in which case null is returned
     */
    getTemperatureAndColorAtLocation( location ) {
      const coordinate = this.dataSet.getLatLongAtPoint( location.x - this.mapBounds.minX, location.y - this.mapBounds.minY );

      const latDegrees = coordinate.latitude / Math.PI * 180;
      const lonDegrees = coordinate.longitude / Math.PI * 180;

      // returns null if location is not in map bounds
      if ( latDegrees > 89 || latDegrees < -90 || lonDegrees > 180 || lonDegrees < -180 ) {
        return null;
      }

      const celsiusTemperature = this.dataSet.getTemperatureAtLatLong( latDegrees, lonDegrees ) - 273;
      const fahrenheitTemperature = celsiusTemperature * 9 / 5 + 32;

      return {
        celsiusTemperature: celsiusTemperature,
        fahrenheitTemperature: Math.floor( fahrenheitTemperature ),
        color: this.dataSet.getColorAtTemperature( celsiusTemperature + 273 )
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


      // put the point controllers back into their starting positions
      this.permanentPointControllers.forEach( pointController => {
        pointController.reset();
        this.putPointControllerInBox( pointController );
      } );
    }

  }

  // @public Choice of temperature units that the scene can display
  TemperatureSceneModel.Units = new Enumeration( [ 'FAHRENHEIT', 'CELSIUS' ] );

  return numberLineIntegers.register( 'TemperatureSceneModel', TemperatureSceneModel );
} );