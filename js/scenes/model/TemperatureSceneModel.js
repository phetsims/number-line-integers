// Copyright 2019, University of Colorado Boulder

/**
 * base class for all scenes in the "Scenes" screen
 *
 * @author John Blanco
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const Range = require( 'DOT/Range' );
  const SceneModel = require( 'NUMBER_LINE_INTEGERS/scenes/model/SceneModel' );
  const temperatureDataSet = require( 'NUMBER_LINE_INTEGERS/scenes/model/temperatureDataSet' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds
  const TEMPERATURE_DATA_SET = new temperatureDataSet();

  class TemperatureSceneModel extends SceneModel {

    constructor() {

      const mapWidth = 650;
      const mapHeight = 300;
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

      const numberLineRange = new Range( -20, 100 );
      const numberLineHeight = 405;
      super( {
        numberLineZeroPosition: new Vector2(
          mapBounds.minX / 2,

          // y position for number line 0 is calculation that centers number line vertically within scene
          0.5 * SCENE_BOUNDS.height + numberLineHeight * ( 0.5 + numberLineRange.min / numberLineRange.getLength() )
        ),
        numberLineOptions: {
          initialOrientation: NumberLineOrientation.VERTICAL,
          initialDisplayedRange: numberLineRange,
          heightInModelSpace: numberLineHeight
        }
      } );

      // @public (read-only) {Bounds2} - bounds of the map area
      this.mapBounds = mapBounds;

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
      this.permanentPointControllers = _.times( 3, () => new PointController( this.numberLine, {
        lockToNumberLine: 'never'
      } ) );

      // put the permanent point controllers in their starting positions
      this.permanentPointControllers.forEach( pointController => {
        this.putPointControllerInBox( pointController );
      } );

      // if the point controllers are released outside of the elevation areas, send them home.
      this.permanentPointControllers.forEach( pointController => {
        pointController.isDraggingProperty.lazyLink( isDragging => {
          if ( !isDragging &&
               this.getTemperatureAndColorAtLocation( pointController.positionProperty.value ) === null &&
               !pointController.numberLinePoint ) {
            this.putPointControllerInBox( pointController, true );
          }
        } );
      } );

    }

    /**
     * get the temperature and color at the specified model location
     * @param {Vector2} location
     * @returns {{color, temperature: number}|null} returns data unless location is invalid, in which case null is returned
     */
    getTemperatureAndColorAtLocation( location ) {

      // returns null if location is not in map bounds
      // TODO: this bounds check is naive because the actual bounds of the map aren't a rectangle
      if ( !this.mapBounds.containsPoint( location ) ) {
        return null;
      }

      const mapLocation = TEMPERATURE_DATA_SET.getLatLongAtPoint( location.x, location.y );
      return {
        temperature: TEMPERATURE_DATA_SET.getTemperatureAtLatLong( mapLocation.latitude, mapLocation.longitude ),
        color: Color.GREEN // TODO: base color off of temperature in a way that matches the map
      };
    }

    /**
     * place the provided point controller into the holding box, generally done on init, reset, and when the user "puts
     * it away"
     * @param {PointController} pointController
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
        this.thermometerBoxBounds.centerY
      );
      pointController.goToPosition( destination, animate );
    }

    /**
     * restore initial state
     * @public
     */
    reset() {

      super.reset();

      // put the point controllers back into their starting positions
      this.permanentPointControllers.forEach( pointController => {
        pointController.reset();
        this.putPointControllerInBox( pointController );
      } );
    }

  }

  return numberLineIntegers.register( 'TemperatureSceneModel', TemperatureSceneModel );
} );