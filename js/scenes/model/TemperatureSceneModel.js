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
  const Range = require( 'DOT/Range' );
  const SceneModel = require( 'NUMBER_LINE_INTEGERS/scenes/model/SceneModel' );
  const temperatureDataSet = require( 'NUMBER_LINE_INTEGERS/scenes/model/temperatureDataSet' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds

  class TemperatureSceneModel extends SceneModel {

    constructor() {

      const mapWidth = 650;
      const mapHeight = 300;
      const mapCenter = new Vector2(
        SCENE_BOUNDS.centerX,
        SCENE_BOUNDS.centerY
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

      // TODO: This is stubbed, needs to be filled out
      return {
        temperature: temperatureDataSet.getTemperatureAtLatLong( 0, 0 ),
        color: Color.GREEN
      };
    }
  }

  return numberLineIntegers.register( 'TemperatureSceneModel', TemperatureSceneModel );
} );