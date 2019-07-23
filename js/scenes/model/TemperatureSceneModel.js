// Copyright 2019, University of Colorado Boulder

/**
 * base class for all scenes in the "Scenes" screen
 *
 * @author John Blanco
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

      // The zero point is well below the vertical center and tne number line is not symmetric around zero.
      // The details of these values were empirically determined by comparing with the design doc and the elevation scene.
      const zeroPositionHeight = SCENE_BOUNDS.height * 0.6;
      const numberLineRange = new Range( -20, 100 );

      const mapWidth = 650;
      const mapHeight = 330;
      const mapCenter = new Vector2(
        SCENE_BOUNDS.centerX,
        zeroPositionHeight - numberLineRange.getCenter() * mapHeight / numberLineRange.getLength()
      );
      const mapBounds = new Bounds2(
        mapCenter.x - mapWidth / 2,
        mapCenter.y - mapHeight / 2,
        mapCenter.x + mapWidth / 2,
        mapCenter.y + mapHeight / 2
      );

      super( {
        numberLineZeroPosition: new Vector2( mapBounds.minX / 2, zeroPositionHeight ),
        numberLineOptions: {
          initialOrientation: NumberLineOrientation.VERTICAL,
          initialDisplayedRange: numberLineRange,
          heightInModelSpace: mapHeight
        }
      } );

      // @public (read-only) {Bounds2} - bounds of the map area
      this.mapBounds = mapBounds;

      // @private temperature data set
      this.dataSet = new temperatureDataSet( mapWidth, mapHeight );
    }

    /**
     * get the temperature and color at the specified model location
     * @param {Vector2} location
     * @returns {{color, temperature: number}|null} returns data unless location is invalid, in which case null is returned
     */
    getTemperatureAndColorAtLocation( location ) {

      const coordinate = this.dataSet.getLatLongAtPoint( location.x, location.y );

      const latDegrees = coordinate.latitude / Math.PI * 180;
      const lonDegrees = coordinate.longitude / Math.PI * 180;

      // returns null if location is not in map bounds
      if ( latDegrees > 90 || latDegrees < -90 ||
           lonDegrees > 180 || lonDegrees < -180 ) {
        return null;
      }

      return {
        temperature: this.dataSet.getTemperatureAtLatLong( latDegrees, lonDegrees ),
        color: Color.GREEN
      };
    }
  }

  return numberLineIntegers.register( 'TemperatureSceneModel', TemperatureSceneModel );
} );