// Copyright 2019-2020, University of Colorado Boulder

/**
 * NumberLine is a simple model of a number line.  It tracks points that are on the line, and those points can be added
 * and removed.  Since the line is one-dimensional, the points have only a single value.  This model is a somewhat
 * "pure" representation of a number line in the sense that it is not projected into space, nor is it limited in its
 * span.  Other subclasses add that functionality.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import NumberLinePoint from './NumberLinePoint.js';

class NumberLine {

  /**
   * {Object} [options]
   * @public
   */
  constructor( options ) {

    options = merge( {

      // {Object{initialValue, color}[]} - array of point specifications that describe what points should exist on
      // the number line when constructed and after a reset
      initialPointSpecs: []

    }, options );

    // @private {Object{ initialValue, color}[]} - array of point specifications that describe what points should
    // exist on the number line when constructed and after a reset
    this.initialPointSpecs = options.initialPointSpecs;

    // @public (read-only) {ObservableArray<NumberLinePoint>} - array of points on this number line
    this.residentPoints = new ObservableArray();

    // hook up a listener to make sure that the points don't land on top of one another
    this.residentPoints.addItemAddedListener( addedPoint => {

      // listener to make sure point lands in a good point when released
      const pointIsDraggingListener = dragging => {

        // do nothing if dragging or we are the only point here/there are no points here
        if ( dragging || this.getPointsAt( addedPoint.valueProperty.value ).length <= 1 ) {
          return;
        }

        // there is already a point at this location, so we have to choose another
        let beginningValue = addedPoint.mostRecentlyProposedValue;
        if ( beginningValue === null ) {
          beginningValue = addedPoint.valueProperty.value;
        }
        addedPoint.valueProperty.value = this.getNearestUnoccupiedValue( beginningValue );
      };
      addedPoint.isDraggingProperty.link( pointIsDraggingListener );

      // remove the listener when the point is removed from the number line
      const pointRemovalListener = removedPoint => {
        if ( removedPoint === addedPoint ) {
          removedPoint.isDraggingProperty.unlink( pointIsDraggingListener );
          this.residentPoints.removeItemRemovedListener( pointRemovalListener );
        }
      };
      this.residentPoints.addItemRemovedListener( pointRemovalListener );
    } );

    // add the initial points
    this.addInitialPoints();
  }

  /**
   * add the initial set of points to the number line, used during construction and reset
   * @private
   */
  addInitialPoints() {
    this.initialPointSpecs.forEach( pointSpec => {
      assert && assert( !this.hasPointAt( pointSpec.initialValue ), 'a point already exists at the specified location' );
      this.addPoint( new NumberLinePoint( pointSpec.initialValue, pointSpec.color, this ) );
    } );
  }

  /**
   * add a point to the number line
   * @param {NumberLinePoint} numberLinePoint
   * @public
   */
  addPoint( numberLinePoint ) {
    this.residentPoints.add( numberLinePoint );
  }

  /**
   * remove a point from the number line
   * @param {NumberLinePoint} numberLinePoint
   * @public
   */
  removePoint( numberLinePoint ) {
    this.residentPoints.remove( numberLinePoint );
  }

  /**
   * remove all points from the number line
   * @public
   */
  removeAllPoints() {
    this.residentPoints.clear();
  }

  /**
   * given a floating point number, return the closest integer value that is on the number line
   * @param {number} proposedValue
   * @returns {number}
   * @public
   */
  getConstrainedValue( proposedValue ) {
    const displayedRange = this.displayedRangeProperty.value;
    return Utils.clamp( Utils.roundSymmetric( proposedValue ), displayedRange.min, displayedRange.max );
  }

  /**
   * whether any point on the number line already exists at the provided value
   * @param {number} value
   * @returns {boolean}
   * @public
   */
  hasPointAt( value ) {
    return _.some( this.residentPoints.getArray(), point => point.valueProperty.value === value );
  }

  /**
   * get a list of all points at the provided value
   * @param {number} value
   * @returns {NumberLinePoint[]}
   * @private
   */
  getPointsAt( value ) {
    return _.filter( this.residentPoints.getArray(), point => point.valueProperty.value === value );
  }

  /**
   * get the closest valid value that isn't already occupied by a point
   * @param {number} value
   * @public
   */
  getNearestUnoccupiedValue( value ) {
    const roundedValue = Utils.roundSymmetric( value );
    let currentDistance = 0;
    const getValidValuesAtDistance = distance => {
      return [ roundedValue - distance, roundedValue + distance ]
        .filter( newValue => !this.hasPointAt( newValue ) && this.displayedRangeProperty.value.contains( newValue ) );
    };
    let validValues = getValidValuesAtDistance( currentDistance );
    while ( validValues.length === 0 ) {
      currentDistance++;
      validValues = getValidValuesAtDistance( currentDistance );
    }
    return _.sortBy( validValues, [ validValue => Math.abs( validValue - value ) ] )[ 0 ];
  }

  /**
   * reset to initial state
   * @public
   */
  reset() {
    this.removeAllPoints();
    this.addInitialPoints();
  }
}

numberLineIntegers.register( 'NumberLine', NumberLine );
export default NumberLine;