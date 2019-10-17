// Copyright 2019, University of Colorado Boulder

/**
 * an object that implement the color mapping algorithms used in this sim
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Util = require( 'DOT/Util' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );

  // constants

  // data for the red-yellow-blue (RdYlBu) color mapping algorithm
  const RdYlBu_data = [
    [ 0.6470588235294118, 0.0, 0.14901960784313725 ],
    [ 0.84313725490196079, 0.18823529411764706, 0.15294117647058825 ],
    [ 0.95686274509803926, 0.42745098039215684, 0.2627450980392157 ],
    [ 0.99215686274509807, 0.68235294117647061, 0.38039215686274508 ],
    [ 0.99607843137254903, 0.8784313725490196, 0.56470588235294117 ],
    [ 1.0, 1.0, 0.74901960784313726 ],
    [ 0.8784313725490196, 0.95294117647058818, 0.97254901960784312 ],
    [ 0.6705882352941176, 0.85098039215686272, 0.9137254901960784 ],
    [ 0.45490196078431372, 0.67843137254901964, 0.81960784313725488 ],
    [ 0.27058823529411763, 0.45882352941176469, 0.70588235294117652 ],
    [ 0.19215686274509805, 0.21176470588235294, 0.58431372549019611 ]
  ];

  class TemperatureToColorMapper {

    /**
     * @param {Range} temperatureRange - the temperature range that will be mapped, units don't really matter
     */
    constructor( temperatureRange ) {

      // @private
      this.temperatureRange = temperatureRange;
    }

    /**
     * map a celsius temperature to a color value.  The temperature range and the color mapping algorithm must match
     * those used to create the maps used in the simulation for things to work out correctly.
     * @param {number} temperature
     * @returns {Color}
     */
    mapTemperatureToColor( temperature ) {

      // calculate a normalized temperature value
      const normalizedTemperature = ( temperature - this.temperatureRange.min ) / this.temperatureRange.getLength();

      // Clamp the value.  While it would be possible to create and use a linear function for out-of-bounds values, but
      // so far this has not been necessary, so it doesn't seem worth it.  Add it if you need it.
      const clampedNormalizedTemperature = Util.clamp( normalizedTemperature, 0, 1 );

      // return the mapped color
      return this.redYellowBlueReverse( clampedNormalizedTemperature );
    }

    /**
     * map a number to a color value based on the red-yellow-blue (RdYlBu) mapping used in Matplotlib
     * @param {number} value - a number in the range 0 to 1
     * @returns {Color}
     * @private
     */
    redYellowBlue( value ) {

      let red = 0;
      let green = 0;
      let blue = 0;

      const numColors = RdYlBu_data.length;
      const scaledValue = value * ( numColors - 1 );
      const lowerEntryIndex = Math.floor( scaledValue );
      const upperEntryIndex = Math.ceil( scaledValue );
      if ( lowerEntryIndex === upperEntryIndex ) {

        // the scaled value matches an entry precisely
        const rgbValues = RdYlBu_data[ lowerEntryIndex ];
        red = rgbValues[ 0 ];
        green = rgbValues[ 1 ];
        blue = rgbValues[ 2 ];
      }
      else {

        // we need to interpolate between the closest RGB values
        const lowerWeighting = 1 - scaledValue + lowerEntryIndex;
        const upperWeighting = 1 - lowerWeighting;
        const lowerRgbValues = RdYlBu_data[ lowerEntryIndex ];
        const upperRgbValues = RdYlBu_data[ upperEntryIndex ];
        red = lowerWeighting * lowerRgbValues[ 0 ] + upperWeighting * upperRgbValues[ 0 ];
        green = lowerWeighting * lowerRgbValues[ 1 ] + upperWeighting * upperRgbValues[ 1 ];
        blue = lowerWeighting * lowerRgbValues[ 2 ] + upperWeighting * upperRgbValues[ 2 ];
      }

      return new Color(
        Util.roundSymmetric( red * 255 ),
        Util.roundSymmetric( green * 255 ),
        Util.roundSymmetric( blue * 255 )
      );
    }

    /**
     * map a number to a color value based on the red-yellow-blue-reverse (RdYlBu_r) mapping used in Matplotlib
     * @param {number} value - a number in the range 0 to 1
     * @returns {Color}
     * @private
     */
    redYellowBlueReverse( value ) {
      return this.redYellowBlue( 1 - value );
    }
  }

  return numberLineIntegers.register( 'TemperatureToColorMapper', TemperatureToColorMapper );
} );