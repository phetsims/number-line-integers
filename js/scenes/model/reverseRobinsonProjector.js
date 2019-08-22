// Copyright 2019, University of Colorado Boulder

/**
 * reverseRobminsonProjector is a singleton that takes a normalized X Y coordinate on a Robinson projection of the Earth
 * and converts it to latitude and longitude values based on the definition of a Robinson projection.  The information
 * for this was derived from the Wikipedia article at https://en.wikipedia.org/wiki/Robinson_projection.  The table
 * values and equations used herein were taken from this article as it existed on 8/12/2019.
 *
 * The Robinson projection defines two equations for mapping a latitude and longitude to an X-Y position:
 *   x = 0.8487 * R * X * ( lambda - lambdaZero )
 *   y = 1.3523 * R * Y
 * R is the radius of the globe at the scale of the map, lambda is the longitude (in radians), and lambdaZero is the
 * longitude of the central meridian for the map (also in radians).  The values for X and Y are from an empirically
 * derived table, indexed by latitude.  The Wikipedia article contains details on what these values signify.  This
 * object reverses the projection such that given a normalized X-Y position on the map where the (0,0) point is in the
 * center, a latitude and longitude value can be determined.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Util = require( 'DOT/Util' );

  // constants
  const R = 1; // assume a globe radius of 1 to make the math easy
  const LAMBDA_ZERO = 0; // assume the map is centered around the prime meridian

  // table of projection values - these are standard for this type of projection, and the values are in 5-degree
  // increments of latitude and are listed in the array in ascending order of latitude
  const ROBINSON_PROJECTION_TABLE = [
    {
      latitudeInDegrees: 0,
      X: 1,
      Y: 0
    },
    {
      latitudeInDegrees: 5,
      X: 0.9986,
      Y: 0.062
    },
    {
      latitudeInDegrees: 10,
      X: 0.9954,
      Y: 0.124
    },
    {
      latitudeInDegrees: 15,
      X: 0.99,
      Y: 0.186
    },
    {
      latitudeInDegrees: 20,
      X: 0.9822,
      Y: 0.248
    },
    {
      latitudeInDegrees: 25,
      X: 0.973,
      Y: 0.31
    },
    {
      latitudeInDegrees: 30,
      X: 0.96,
      Y: 0.372
    },
    {
      latitudeInDegrees: 35,
      X: 0.9427,
      Y: 0.434
    },
    {
      latitudeInDegrees: 40,
      X: 0.9216,
      Y: 0.4958
    },
    {
      latitudeInDegrees: 45,
      X: 0.8962,
      Y: 0.5571
    },
    {
      latitudeInDegrees: 50,
      X: 0.8679,
      Y: 0.6176
    },
    {
      latitudeInDegrees: 55,
      X: 0.835,
      Y: 0.6769
    },
    {
      latitudeInDegrees: 60,
      X: 0.7986,
      Y: 0.7346
    },
    {
      latitudeInDegrees: 65,
      X: 0.7597,
      Y: 0.7903
    },
    {
      latitudeInDegrees: 70,
      X: 0.7186,
      Y: 0.8435
    },
    {
      latitudeInDegrees: 75,
      X: 0.6732,
      Y: 0.8936
    },
    {
      latitudeInDegrees: 80,
      X: 0.6213,
      Y: 0.9394
    },
    {
      latitudeInDegrees: 85,
      X: 0.5722,
      Y: 0.9761
    },
    {
      latitudeInDegrees: 90,
      X: 0.5322,
      Y: 1
    }
  ];

  // calculate the max projection values based on our assumptions for R and LAMBDA_ZERO
  const MAX_X_PROJECTION_VALUE = 0.8487 * R * ROBINSON_PROJECTION_TABLE[ 0 ].X * ( ( Math.PI ) - LAMBDA_ZERO );
  const MAX_Y_PROJECTION_VALUE = 1.3523 * R * ROBINSON_PROJECTION_TABLE[ 18 ].Y;

  // using our assumptions, create a table of latitude to y projection values
  const LATITUDE_TO_Y_PROJECTION_MAPPING = [];
  ROBINSON_PROJECTION_TABLE.forEach( projectionTableEntry => {
    LATITUDE_TO_Y_PROJECTION_MAPPING.push( {
      latitudeInDegrees: projectionTableEntry.latitudeInDegrees,
      yProjectionValue: 1.3523 * R * projectionTableEntry.Y
    } );
  } );

  /**
   * Get the X and Y multipliers as used in the formulas described in the Wikipedia article linked above.  This is
   * done by finding the closest values and then interpolating
   * @param {number} projectedYValue
   */
  const getInterpolatedTableData = projectedYValue => {

    const absY = Math.abs( projectedYValue );
    assert && assert( absY <= MAX_Y_PROJECTION_VALUE, 'projected y values is larger than max allowed' );

    // determine the two closest latitude values and their weighting
    let lowerLatitude = 0;
    let lowerLatitudeWeighting = 1;
    let higherLatitude = 5;
    let higherLatitudeWeighting = 0;
    for ( let i = 0; i < LATITUDE_TO_Y_PROJECTION_MAPPING.length - 1; i++ ) {
      const lowerLatitudeToYMapEntry = LATITUDE_TO_Y_PROJECTION_MAPPING[ i ];
      const higherLatitudeToYMapEntry = LATITUDE_TO_Y_PROJECTION_MAPPING[ i + 1 ];
      if ( ( absY === lowerLatitudeToYMapEntry.yProjectionValue || absY === higherLatitudeToYMapEntry.yProjectionValue ) ||
           ( absY > lowerLatitudeToYMapEntry.yProjectionValue && absY < higherLatitudeToYMapEntry.yProjectionValue ) ) {
        lowerLatitude = LATITUDE_TO_Y_PROJECTION_MAPPING[ i ].latitudeInDegrees;
        const amountAboveLowerValue = absY - LATITUDE_TO_Y_PROJECTION_MAPPING[ i ].yProjectionValue;
        higherLatitude = LATITUDE_TO_Y_PROJECTION_MAPPING[ i + 1 ].latitudeInDegrees;
        const amountBelowHigherValue = LATITUDE_TO_Y_PROJECTION_MAPPING[ i + 1 ].yProjectionValue - absY;
        lowerLatitudeWeighting = amountBelowHigherValue / ( amountAboveLowerValue + amountBelowHigherValue );
        higherLatitudeWeighting = 1 - lowerLatitudeWeighting;
        break;
      }
    }

    // get the Robinson projection table rows for the two latitude values found
    const lowerRobinsonProjectionTableRow = ROBINSON_PROJECTION_TABLE[ Util.roundSymmetric( lowerLatitude / 5 ) ];
    const higherRobinsonProjectionTableRow = ROBINSON_PROJECTION_TABLE[ Util.roundSymmetric( higherLatitude / 5 ) ];

    // return an object with the interpolated latitude, X, and Y values
    // TODO: This uses linear interpolation.  Is that good enough for our purposes?
    return {
      latitudeInDegrees: lowerRobinsonProjectionTableRow.latitudeInDegrees * lowerLatitudeWeighting +
                         higherRobinsonProjectionTableRow.latitudeInDegrees * higherLatitudeWeighting,
      X: lowerRobinsonProjectionTableRow.X * lowerLatitudeWeighting +
         higherRobinsonProjectionTableRow.X * higherLatitudeWeighting,
      Y: lowerRobinsonProjectionTableRow.Y * lowerLatitudeWeighting +
         higherRobinsonProjectionTableRow.Y * higherLatitudeWeighting
    };
  };

  const reverseRobinsonProjector = {

    /**
     * Get the latitude and longitude associated with the normalized x and y values.  The x and y values are taken from
     * a position on a map where the point (0,0) is in the center.
     * @param {number} x
     * @param {number} y
     * @returns {Object} - latitude and longitude as a tuple
     * @public
     */
    xyToLatLong: ( x, y ) => {

      // scale the x and y values to match the max values that they can be in a Robinson projection
      const scaledAbsX = Math.abs( x ) * 2 * MAX_X_PROJECTION_VALUE;
      const scaledAbsY = Math.abs( y ) * 2 * MAX_Y_PROJECTION_VALUE;
      const xSign = x >= 0 ? 1 : -1;
      const ySign = y >= 0 ? 1 : -1;

      const projectionData = getInterpolatedTableData( scaledAbsY );
      const latitudeInDegrees = ySign * projectionData.latitudeInDegrees;
      const longitudeInRadians = xSign * scaledAbsX / ( 0.8487 * R * projectionData.X ) + LAMBDA_ZERO;
      const longitudeInDegrees = longitudeInRadians * 180 / Math.PI;

      // make sure the mapped values are legitimate, since they could end up outside the boundaries of the projection
      let returnValue = null;
      if ( longitudeInDegrees <= 180 ) {
        returnValue = {
          latitude: latitudeInDegrees,
          longitude: longitudeInDegrees
        };
      }

      return returnValue;
    },

    /**
     * This is a purely mathematical way to map x,y on a map image to a latitude and longitude, see
     * https://vdocuments.site/a-computational-approach-to-the-robinson-projection.html or, if that link goes dead,
     * search on "A Computational Approach to the Robinson Projection". The x and y values are taken from a position on
     * a map where the point (0,0) is in the center.
     * @param {number} x
     * @param {number} y
     * @returns {null|{latitude: {number}, longitude: {number}}}
     */
    xyToLatLongCalculated( x, y ) {

      const relativeX = Math.abs( x );
      const relativeY = Math.abs( 0.5072 * y );

      const sphereRadius = 1.178 / ( 2 * Math.PI );
      const thisBStar = relativeY / sphereRadius;
      let thisAStar = 0;
      for ( let i = 0; i <= 18; i++ ) {
        thisAStar += mValues[ i ] * Math.abs( BStarValues[ i ] - thisBStar );
      }

      const long = relativeX / ( sphereRadius * thisAStar );

      let lat = 0;
      for ( let i = 0; i <= 18; i++ ) {
        lat += nValues[ i ] * Math.sqrt(
          Math.pow( AStarValues[ i ] - thisAStar, 2 ) +
          Math.pow( BStarValues[ i ] - thisBStar, 2 )
        );
      }

      const latitudeInRadians = y > 0 ? lat : -lat;
      const longitudeInRadians = x > 0 ? long : -long;

      return {
        latitude: latitudeInRadians / Math.PI * 180,
        longitude: longitudeInRadians / Math.PI * 180
      };
    }
  };

  const AStarValues = [
    0.84870000, 0.84751182, 0.84479598,
    0.84021300, 0.83359314, 0.82578510,
    0.81475200, 0.80006949, 0.78216192,
    0.76060494, 0.73658673, 0.70866450,
    0.67777182, 0.64475739, 0.60987582,
    0.57134484, 0.52729731, 0.48562614,
    0.45167814
  ];

  const BStarValues = [
    0.00000000, 0.08384260, 0.16768520,
    0.25152780, 0.33537040, 0.41921300,
    0.50305560, 0.58689820, 0.67047034,
    0.75336633, 0.83518048, 0.91537187,
    0.99339958, 1.06872269, 1.14066505,
    1.20841528, 1.27035062, 1.31998003,
    1.35230000
  ];

  const mValues = [
    0.4737166113, -0.00911028522, -0.01113479305,
    -0.01214704697, -0.00708577740, -0.01923282436,
    -0.02176345915, -0.01957843209, -0.02288586729,
    -0.01676092031, -0.02731224791, -0.02386224240,
    -0.02119239013, -0.02327513775, -0.04193330922,
    -0.07123235442, -0.06423048161, -0.10536278437,
    1.00598851957
  ];

  const nValues = [
    1.07729625255, -0.00012324928, -0.00032923415,
    -0.00056627609, -0.00045168290, -0.00141388769,
    -0.00211521349, -0.00083658786, 0.00073523299,
    0.00349045186, 0.00502041018, 0.00860101415,
    0.01281238969, 0.01794606372, 0.02090220870,
    0.02831504310, 0.11177176318, 0.28108668066,
    -0.45126573496
  ];

  return numberLineIntegers.register( 'reverseRobinsonProjector', reverseRobinsonProjector );
} );