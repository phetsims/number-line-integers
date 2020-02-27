// Copyright 2019-2020, University of Colorado Boulder

/**
 * a node that represents a piggy bank
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import piggyBankWithFlowers from '../../../images/piggy-bank-with-flowers_png.js';
import piggyBankWithLightning from '../../../images/piggy-bank-with-lightning_png.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import PiggyBankDecoration from '../model/PiggyBankDecoration.js';
import piggyBankShapes from './piggyBankShapes.js';

class PiggyBankNode extends Node {

  /**
   * @param {Object} [options]
   * @public
   */
  constructor( options ) {

    options = merge( {
      fill: 'rgba( 0, 0, 0, 0 )', // initially transparent so that it is invisible but has size
      lineWidth: 0,
      decorationType: PiggyBankDecoration.FLOWERS
    }, options );

    const piggyBankOutlineNode = new Path( piggyBankShapes.MEDIUM_PIGGY_BANK_SHAPE, {
      fill: options.fill,
      lineWidth: options.lineWidth,
      center: Vector2.ZERO
    } );
    const overlayImage = new Image(
      options.decorationType === PiggyBankDecoration.FLOWERS ? piggyBankWithFlowers : piggyBankWithLightning,
      { opacity: 0.9 }
    );
    overlayImage.setScaleMagnitude( piggyBankOutlineNode.width / overlayImage.width );
    overlayImage.center = Vector2.ZERO;
    options.children = [ piggyBankOutlineNode, overlayImage ];
    super( options );

    // @private
    this.outline = piggyBankOutlineNode;
  }

  /**
   * @returns {ColorDef} the color of this piggy bank's fill
   * @public
   */
  getFill() {
    return this.outline.fill;
  }

  get fill() { return this.getFill(); }

  /**
   * @param {ColorDef} fill
   * @public
   */
  setFill( fill ) {
    this.outline.fill = fill;
  }

  set fill( fill ) { this.setFill( fill ); }

}

numberLineIntegers.register( 'PiggyBankNode', PiggyBankNode );
export default PiggyBankNode;