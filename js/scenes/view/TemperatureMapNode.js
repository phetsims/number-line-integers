// Copyright 2019, University of Colorado Boulder

/**
 * A node that represents the temperature scene's map image
 *
 * @author Arnab Purkayastha
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );

  // images
  const temperatureMapJanuary = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-01.png' );
  const temperatureMapFebruary = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-02.png' );
  const temperatureMapMarch = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-03.png' );
  const temperatureMapApril = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-04.png' );
  const temperatureMapMay = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-05.png' );
  const temperatureMapJune = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-06.png' );
  const temperatureMapJuly = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-07.png' );
  const temperatureMapAugust = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-08.png' );
  const temperatureMapSeptember = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-09.png' );
  const temperatureMapOctober = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-10.png' );
  const temperatureMapNovember = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-11.png' );
  const temperatureMapDecember = require( 'image!NUMBER_LINE_INTEGERS/world-temperatures-monthy-averaged-2018-12.png' );

  // constants
  const TEMPERATURE_IMAGES_MONTHS = [ temperatureMapJanuary, temperatureMapFebruary, temperatureMapMarch,
    temperatureMapApril, temperatureMapMay, temperatureMapJune, temperatureMapJuly, temperatureMapAugust,
    temperatureMapSeptember, temperatureMapOctober, temperatureMapNovember, temperatureMapDecember ];

  class TemperatureMapNode extends Node {

    /**
     * @param {NumberProperty} monthProperty
     * @param {Bounds2} mapBounds
     */
    constructor( monthProperty, mapBounds ) {
      super();

      // @private
      this.mapBounds = mapBounds;

      let lastMonth = 1;

      const images = _.map( TEMPERATURE_IMAGES_MONTHS, png => {
        const image = new Image( png, { visible: false } );
        this.scaleImage( image );
        this.addChild( image );
        return image;
      } );

      monthProperty.link( month => {
        images[ lastMonth - 1 ].visible = false;
        images[ month - 1 ].visible = true;
        lastMonth = month;
      } );
    }

    /**
     * Rescales new images to fit in map bounds
     * @private
     */
    scaleImage( image ) {
      image.scale(
        this.mapBounds.width / image.width,
        this.mapBounds.height / image.height
      );
    }

  }

  return numberLineIntegers.register( 'TemperatureMapNode', TemperatureMapNode );

} );