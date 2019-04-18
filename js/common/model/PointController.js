// Copyright 2019, University of Colorado Boulder

/**
 * A point controller is a model element that is used to control points on a number line, but can exist independently
 * too.  It can be locked to a number line, or can be set such that it can be dragged away, thus removing the associated
 * number line point from the number line.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class PointController {

    /**
     * {Vector2} initialPosition
     * {NumberLine} numberLine - the number line on which this controller will be moving points
     */
    constructor( initialPosition, numberLine, options ) {

      options = _.extend( {

        // color used when represented in the view
        color: 'black',

        // {Vector2} - a "second home" for the point controller, used when the number lines with which it interacts can
        // be in multiple orientations
        alternativeHome: null
      }, options );

      // @public {Vector2Property} - position of this point in model space
      this.positionProperty = new Vector2Property( initialPosition );

      // @public {BooleanProperty} - indicates whether this is being dragged by the user
      this.draggingProperty = new BooleanProperty( false );

      // @public (read-only) {Vector2}
      this.alternativeHome = options.alternativeHome;

      // @public (read-only) {NumberLinePoint|null} - point on the number line being controlled, null if no point
      this.numberLinePoint = null;

      // &public (read-only) {Color}
      this.color = options.color;

      // when moved, update the number line point position (if we have one)
      this.positionProperty.link( position => {
        if ( this.numberLinePoint ) {
          this.numberLinePoint.valueProperty.set( numberLine.modelPositionToValue( position ) );
        }
      } );
    }

    /**
     * associate this controller with a point on the number line
     * @param {NumberLinePoint} numberLinePoint
     * @public
     */
    associateWithNumberLinePoint( numberLinePoint ) {
      this.numberLinePoint = numberLinePoint;
    }

    /**
     * remove the association between this controller and the point on the number line that it was controlling
     * @public
     */
    clearNumberLinePoint() {
      this.numberLinePoint = null;
    }

    /**
     * reset to initial state
     * @public
     */
    reset() {
      this.positionProperty.reset();
    }

    /**
     * set this point to its alternative home position
     * @public
     */
    goToAlternativeHome() {
      assert && assert( this.alternativeHome, 'no alternative home set' );
      this.positionProperty.set( this.alternativeHome );
    }
  }

  return numberLineIntegers.register( 'PointController', PointController );
} );