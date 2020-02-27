// Copyright 2019, University of Colorado Boulder

/**
 * A node that represents the temperature scene's map image
 *
 * @author Arnab Purkayastha
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import temperatureMapJanuary from '../../../images/world-temperatures-monthly-averaged-2018-01_jpg.js';
import temperatureMapFebruary from '../../../images/world-temperatures-monthly-averaged-2018-02_jpg.js';
import temperatureMapMarch from '../../../images/world-temperatures-monthly-averaged-2018-03_jpg.js';
import temperatureMapApril from '../../../images/world-temperatures-monthly-averaged-2018-04_jpg.js';
import temperatureMapMay from '../../../images/world-temperatures-monthly-averaged-2018-05_jpg.js';
import temperatureMapJune from '../../../images/world-temperatures-monthly-averaged-2018-06_jpg.js';
import temperatureMapJuly from '../../../images/world-temperatures-monthly-averaged-2018-07_jpg.js';
import temperatureMapAugust from '../../../images/world-temperatures-monthly-averaged-2018-08_jpg.js';
import temperatureMapSeptember from '../../../images/world-temperatures-monthly-averaged-2018-09_jpg.js';
import temperatureMapOctober from '../../../images/world-temperatures-monthly-averaged-2018-10_jpg.js';
import temperatureMapNovember from '../../../images/world-temperatures-monthly-averaged-2018-11_jpg.js';
import temperatureMapDecember from '../../../images/world-temperatures-monthly-averaged-2018-12_jpg.js';
import numberLineIntegers from '../../numberLineIntegers.js';

// constants
const TEMPERATURE_IMAGES_MONTHS = [ temperatureMapJanuary, temperatureMapFebruary, temperatureMapMarch,
  temperatureMapApril, temperatureMapMay, temperatureMapJune, temperatureMapJuly, temperatureMapAugust,
  temperatureMapSeptember, temperatureMapOctober, temperatureMapNovember, temperatureMapDecember ];

class TemperatureMapNode extends Node {

  /**
   * @param {NumberProperty} monthProperty
   * @param {Bounds2} mapBounds
   * @public
   */
  constructor( monthProperty, mapBounds ) {
    super();

    // @private
    this.mapBounds = mapBounds;

    let lastMonth = 1;

    const images = _.map( TEMPERATURE_IMAGES_MONTHS, image => {
      const imageNode = new Image( image, { visible: false } );
      imageNode.scale(
        this.mapBounds.width / imageNode.width,
        this.mapBounds.height / imageNode.height
      );
      this.addChild( imageNode );
      return imageNode;
    } );

    monthProperty.link( month => {
      images[ lastMonth - 1 ].visible = false;
      images[ month - 1 ].visible = true;
      lastMonth = month;
    } );
  }
}

numberLineIntegers.register( 'TemperatureMapNode', TemperatureMapNode );
export default TemperatureMapNode;