// Copyright 2019, University of Colorado Boulder

/**
 * a point controller with some extensions that are specific to the "Temperature" scene
 * TODO: discuss how to reduce code duplication between this and ElevationPointController
 *
 * @author John Blanco
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Color = require( 'SCENERY/util/Color' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const PaintColorProperty = require( 'SCENERY/util/PaintColorProperty' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );

  /**
   * TODO: this class should eventually extend some common code temperature sensor model or something
   */
  class TemperaturePointController extends PointController {

    /**
     * @param {TemperatureSceneModel} sceneModel
     * @param {Object} [options]
     */
    constructor( sceneModel, options ) {

      options = _.extend( {
        lockToNumberLine: 'never',
        baseDisabledColor: new Color( 0, 0, 0, 0 ),
        baseDisabledTemperature: 0
      }, options );

      super( sceneModel.numberLine, options );

      // @private
      this.sceneModel = sceneModel;

      // @public (readonly) whether the point controller is over the map
      this.isOverMapProperty = new BooleanProperty( false );

      // @public temperature at the position of the point controller on the map
      this.temperatureProperty = new NumberProperty( 0 );

      // @public color represented by temperature on map
      this.colorProperty = new PaintColorProperty( options.baseDisabledColor );

      this.positionProperty.link( position => {
        const data = sceneModel.getTemperatureAndColorAtLocation( position );
        this.temperatureProperty.value = data ? data.temperature : options.baseDisabledTemperature;
        this.colorProperty.value = data ? data.color : options.baseDisabledColor;

        this.isOverMapProperty.value = data !== null;
        if ( this.isOverMapProperty.value && this.numberLinePoint ) {
          this.numberLinePoint.valueProperty.value = data.temperature;
          this.numberLinePoint.colorProperty.value = data.color;
        }
      } );

      // create/remove number line points based on whether we're over the elevation area
      this.isOverMapProperty.lazyLink( over => {
        if ( over && this.isDraggingProperty.value ) {

          // state checking
          assert && assert( !this.numberLinePoint, 'should not already have a point' );

          // create a new point on the number line
          const numberLinePoint = new NumberLinePoint(
            this.temperatureProperty.value,
            this.colorProperty.value,
            this.numberLine,
            this
          );
          this.numberLine.addPoint( numberLinePoint );
          this.numberLinePoint = numberLinePoint;
        }
        else if ( !over && this.numberLinePoint ) {

          // remove our point from the number line
          this.numberLine.removePoint( this.numberLinePoint );
          this.clearNumberLinePoint();
        }

      } );

    }

    /**
     * @param {Vector2} proposedPosition
     * @override - see base class for more information
     */
    proposePosition( proposedPosition ) {
      this.positionProperty.value = proposedPosition;
    }

  }

  return numberLineIntegers.register( 'TemperaturePointController', TemperaturePointController );

} );