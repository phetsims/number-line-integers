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

  class TemperaturePointController extends PointController {

    /**
     * @param {TemperatureSceneModel} sceneModel
     * @param {Object} [options]
     */
    constructor( sceneModel, options ) {

      options = _.extend( {
        lockToNumberLine: 'never',
        baseDisabledColor: new Color( 0, 0, 0, 0 ),
        baseDisabledCelsiusTemperature: 0,
        baseDisabledFahrenheitTemperature: 32
      }, options );

      super( sceneModel.numberLine, options );

      // @private
      this.sceneModel = sceneModel;

      // @public (readonly) whether the point controller is over the map
      this.isOverMapProperty = new BooleanProperty( false );

      // @public temperatures at the position of the point controller on the map
      this.celsiusTemperatureProperty = new NumberProperty( 0 );
      this.fahrenheitTemperatureProperty = new NumberProperty( 32 );

      // @public color represented by temperature on map
      this.colorProperty = new PaintColorProperty( options.baseDisabledColor );

      this.positionProperty.link( position => {
        const data = sceneModel.getTemperatureAndColorAtLocation( position );
        this.celsiusTemperatureProperty.value = data ? data.celsiusTemperature : options.baseDisabledCelsiusTemperature;
        this.fahrenheitTemperatureProperty.value = data ? data.fahrenheitTemperature : options.baseDisabledFahrenheitTemperature;
        this.colorProperty.value = data ? data.color : options.baseDisabledColor;

        this.isOverMapProperty.value = data !== null;
        if ( this.isOverMapProperty.value && this.numberLinePoint ) {
          this.fahrenheitNumberLinePoint.valueProperty.value = data.fahrenheitTemperature;
          this.celsiusNumberLinePoint.valueProperty.value = data.celsiusTemperature;
          this.fahrenheitNumberLinePoint.colorProperty.value = data.color;
          this.celsiusNumberLinePoint.colorProperty.value = data.color;
        }
      } );

      // create/remove number line points based on whether we're over the elevation area
      this.isOverMapProperty.lazyLink( over => {
        if ( over && this.isDraggingProperty.value ) {

          // state checking
          assert && assert( !this.numberLinePoint, 'should not already have a point' );

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
          this.numberLinePoint = this.celsiusNumberLinePoint;
        }
        else if ( !over && this.numberLinePoint ) {

          // remove our points from the number line
          this.sceneModel.celsiusNumberLine.removePoint( this.celsiusNumberLinePoint );
          this.sceneModel.fahrenheitNumberLine.removePoint( this.fahrenheitNumberLinePoint );
          this.numberLinePoint = this.celsiusNumberLinePoint;
          this.clearNumberLinePoint();
          this.numberLinePoint = this.fahrenheitNumberLinePoint;
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